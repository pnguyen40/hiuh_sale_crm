import {installOperations} from './operations-controller.js';
import {ticketView} from './operations-ui.js';
import {installFilterControls} from './filter-ui.js';
import {waitDefaults} from './follow-up.js';
import {buildSummary,summaryState,receivedMessages} from "./context.js";
import {hydrateViews,emptyFilters,saveView,applyView,deleteView,recordEvent,visibleLogs,logCsv} from "./workbench.js";
import {logView} from "./workbench-ui.js";
import { mountReview } from "./review-controls.js";
import {
  scenario,
  current,
  canRead,
  canEdit,
  terminal,
  applyAction,
  visibleCases,
  CONTACTS,
} from "./model.js";
import { shell, listView, detailView, icon, esc } from "./views.js";
import { normalizePhone } from "./workflow.js";
import { overlayView, candidateList } from "./overlays.js";
const params = new URLSearchParams(location.search);
// Portal context is preserved visually; other modules are outside this CSKH handoff.
document.addEventListener("click", e => {
  if (e.target.closest("[data-portal-reference]")) e.preventDefault();
});
let s = scenario(
  /^M-\d{2}$/.test(params.get("frame") || "") ? params.get("frame") : "M-01",
);
hydrateViews(s);
if(s.screen==='detail')recordEvent(s,{action:'view_detail',caseId:s.caseId,result:canRead(s,current(s))?'SUCCESS':'DENIED',code:canRead(s,current(s))?null:'ACCESS_DENIED'});
let pending = false,
  rendering = false,
  opener = null,
  baseline = "",
  toastTimer;
const app = document.querySelector("#app"),
  overlays = document.querySelector("#overlays");
function dataForm() {
  const form = document.querySelector("#overlay-form");
  return form ? Object.fromEntries(new FormData(form)) : {};
}
function isDirty() {
  return s.overlay && JSON.stringify(dataForm()) !== baseline;
}
function confirmLeave() {
  if(!s.noteDraft&&!s.resumeDraft&&!s.ticketNote&&!Object.values(s.liveDrafts||{}).some(Boolean)&&!isDirty())return true;
  if(!window.confirm("Có nội dung chưa lưu. Bạn muốn bỏ thay đổi?"))return false;
  s.noteDraft="";s.resumeDraft="";s.ticketNote="";s.liveDrafts={};return true;
}
function render() {
  if (rendering) return;
  rendering = true;
  try {
    filterControls.close();
    app.innerHTML = shell(s, s.screen === "list" ? listView(s) : s.screen === "log" ? logView(s) : s.screen==="tickets"?ticketView(s):detailView(s));
    renderOverlay();
    document.title =
      (s.screen === "list" ? "Tiếp nhận & Xử lý" : s.screen === "log" ? "CSKH log" : s.screen==="tickets"?"Phiếu yêu cầu":"Chi tiết yêu cầu") +
      " · Operation Portal";
    window.CSKH.ready = true;
  } finally {
    rendering = false;
  }
}
function renderOverlay() {
  if (!canRead(s, current(s))) s.overlay = null;
  overlays.innerHTML = overlayView(s);
  app.inert = !!s.overlay;
  if (s.overlay) {
    baseline = JSON.stringify(dataForm());
    document.querySelector("#overlay-title")?.focus();
  }
}
function toast(message, tone = "") {
  clearTimeout(toastTimer);
  const el = document.querySelector("#toast");
  el.className = "show " + tone;
  el.innerHTML = icon(tone ? "CircleAlert" : "CircleCheck") + esc(message);
  toastTimer = setTimeout(() => (el.className = ""), 6500);
}
function showOverlay(id) {
  const c = current(s);
  const superOnly = ["D-04", "D-08"].includes(id);
  if (
    !canRead(s, c) ||
    (superOnly && s.role !== "SUPERVISOR") ||
    (id === "D-08" && !terminal(c)) ||
    (id !== "D-08" && terminal(c))
  )
    return toast(
      "Thao tác không được phép với quyền hoặc trạng thái hiện tại.",
      "error",
    );
  opener = document.activeElement;
  const d = opener?.dataset;
  s.openerSelector = d?.action
    ? `[data-action="${d.action}"]${d.id ? `[data-id="${d.id}"]` : ""}`
    : null;
  if(id === "D-11")s.ticketRequestKey=crypto.randomUUID();
  s.overlay = id;
  s.linkMode = "link";
  s.formValues = id === "D-05" ? waitDefaults(c) : null;
  renderOverlay();
}
function closeOverlay(force = false) {
  if (pending) return;
  if (
    !force &&
    isDirty() &&
    !window.confirm("Có thay đổi chưa lưu. Bạn muốn bỏ thay đổi?")
  )
    return;
  s.overlay = null;
  overlays.innerHTML = "";
  app.inert = false;
  if (opener?.isConnected) opener.focus();
  else if (s.openerSelector) document.querySelector(s.openerSelector)?.focus();
}
function openCase(id) {
  if (!confirmLeave()) return;
  const c = s.cases.find((c) => c.id === id);
  if (!canRead(s, c)) {recordEvent(s,{action:'view_detail',caseId:id,result:'DENIED',code:'ACCESS_DENIED'});return toast("Bạn chưa có quyền xem chi tiết yêu cầu này.", "error");}
  recordEvent(s,{action:'view_detail',caseId:id});
  s.caseId = id;
  s.detailSection="source";
  s.screen = "detail";
  s.overlay = null;
  s.noteDraft = "";
  s.resumeDraft = "";
  s.resume = false;
  s.justStarted=null;
  s.ticketNote="";
  s.moreTimeline = false;
  render();
  document.querySelector("h1")?.setAttribute("tabindex", "-1");
  document.querySelector("h1")?.focus();
}
async function save(action, data = {}, button = null, id = s.caseId) {
  if (pending) return false;
  const previousLogSeq = s.logSeq, context = s;
  pending = true;
  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.insertAdjacentHTML("afterbegin", icon("LoaderCircle", "spinner"));
  }
  try {
    await new Promise((r) => setTimeout(r, 350));
    if(s!==context)return false;
    if (params.get("fail") === "1")
      throw new Error(
        "Chưa lưu được thay đổi. Nội dung đã nhập vẫn được giữ; vui lòng thử lại.",
      );
    if (action === "claim" && params.get("race") === "1") {
      s.cases.find((c) => c.id === id).owner = "linh";
      throw new Error(
        "Yêu cầu đã có người phụ trách. Danh sách đã được cập nhật.",
      );
    }
    const c = applyAction(s, id, action, data);
    pending = false;
    if (action === "claim") {
      s.caseId = c.id;
      s.detailSection="source";
  s.screen = "detail";
      recordEvent(s,{action:"view_detail",caseId:c.id});
      s.noteDraft = "";
    }
    if (action === "start")s.justStarted=c.id;
    if (action === "note") s.noteDraft = "";
    if (action === "resume") {
      s.resume = false;
      s.resumeDraft = "";
    }
    const restore = s.openerSelector;
    s.overlay = null;
    s.formValues = null;
    render();
    if (restore) document.querySelector(restore)?.focus();
    toast(
      action === "claim"
        ? "Đã nhận xử lý. Bắt đầu xử lý khi bạn sẵn sàng."
        : "Đã lưu thay đổi.",
    );
    return true;
  } catch (e) {
    if(s.logSeq===previousLogSeq)recordEvent(s,{action,caseId:id,result:params.get('race')==='1'?'DENIED':'FAILED',code:params.get('race')==='1'?'ASSIGNMENT_CONFLICT':'SAVE_FAILED'});
    if (s.overlay) {
      const el = document.querySelector("#modal-error");
      el.textContent = e.message;
      el.classList.add("visible");
      el.scrollIntoView({ block: "nearest" });
      const first = document.querySelector(
        "#overlay-form input[required]:invalid, #overlay-form select[required]:invalid, #overlay-form textarea[required]:invalid",
      );
      if (first) {
        first.setAttribute("aria-invalid", "true");
        first.setAttribute("aria-describedby", "modal-error");
        first.focus();
      }
    } else if (action === "claim") {
      render();
      toast(e.message, "warning");
    } else if (action === "note") {
      document.querySelector("#note-error").textContent = e.message;
    } else toast(e.message, "error");
    return false;
  } finally {
    pending = false;
    if (button?.isConnected) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.querySelector(".spinner")?.remove();
    }
  }
}
document.addEventListener("click", async (event) => {
  const el = event.target.closest("[data-action]");
  if (!el || el.disabled || pending) return;
  const action = el.dataset.action,
    id = el.dataset.id;
  if(action==='nav-toggle'||action==='nav-close'){
    s.navOpen=action==='nav-toggle'?!s.navOpen:false;
    document.querySelector('#screen').classList.toggle('nav-open',s.navOpen);
    document.querySelector('[data-action=nav-toggle]').setAttribute('aria-expanded',String(s.navOpen));
    const main=document.querySelector('main'),header=document.querySelector('.portal-header');main.inert=s.navOpen;header.inert=s.navOpen;
    document.querySelector(s.navOpen?'[data-action=nav-close].mobile-close-nav':'[data-action=nav-toggle]')?.focus();return;
  }
  if(action==='detail-section'){s.detailSection=id;document.querySelector('.detail-columns').dataset.mobileSection=id;document.querySelectorAll('[data-action=detail-section]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.id===id)));return;}
  if(action==='notes-jump'){document.querySelector('#private-notes')?.scrollIntoView({block:'start'});document.querySelector('#private-notes')?.focus();}
  if(action==='summary-source'){
    const c=current(s);if(!canRead(s,c)||!receivedMessages(c).some(m=>m.id===id))return;
    const target=[...document.querySelectorAll('[data-message-id]')].find(el=>el.dataset.messageId===id);target?.scrollIntoView({block:'center'});target?.focus();
  }
  if(action==='summary-refresh'){
    const c=current(s),context=s;
    if(!canRead(s,c)||c.kind!=='ai'||['LOADING','UNAVAILABLE'].includes(summaryState(c)))return;
    const rev=c.transcript.version,sessionId=c.transcript.id,coverage=c.log,previous=structuredClone(c.aiSummary);
    c.aiSummary={...(c.aiSummary||{}),state:'LOADING'};render();
    await new Promise(r=>setTimeout(r,600));
    if(s!==context)return;
    if(!canRead(s,c)){recordEvent(s,{action:'summary_refresh',caseId:c.id,result:'DENIED',code:'ACCESS_DENIED'});return;}
    if(c.transcript.id!==sessionId||c.transcript.version!==rev||c.log!==coverage){c.aiSummary=previous?{...previous,state:'READY'}:null;if(current(s)?.id===c.id)render();return;}
    if(params.get('fail')==='1'){c.aiSummary={state:'ERROR'};recordEvent(s,{action:'summary_refresh',caseId:c.id,result:'FAILED',code:'SUMMARY_UNAVAILABLE'});}
    else {c.aiSummary=buildSummary(c);recordEvent(s,{action:'summary_refresh',caseId:c.id});}
    if(current(s)?.id===c.id)render();
  }
  if (action === "list") {
    if (!confirmLeave()) return;
    s.navOpen=false;
    s.screen = "list";
    s.caseId = null;
    s.overlay = null;
    s.revoked = false;
    s.noteDraft = "";
    s.resumeDraft = "";
    s.resume = false;
    render();
  }
  if(action==='log') {if(!confirmLeave())return;s.navOpen=false;s.screen='log';s.overlay=null;s.noteDraft='';s.resumeDraft='';render();}
  if(action==='sort-column'){s.sort=s.sortKey===id&&s.sort==='asc'?'desc':'asc';s.sortKey=id;s.page=1;render();}
  if(action==='filter-remove'){if(id==='liveOnly'){s.liveOnly=false;s.page=1;render();return;}s.filters[id]=['source','status','topic','owner','session'].includes(id)?[]:'';if(id==='period'){s.filters.from='';s.filters.to='';}s.page=1;render();}
  if(action==='view-save'||action==='view-rename'){s.viewEditor=action==='view-save'?'save':'rename';s.viewName=null;s.viewError='';render();document.querySelector('#view-name')?.focus();}
  if(action==='view-editor-close'){s.viewEditor=null;render();}
  if(action==='saved-view'){try{applyView(s,id);s.viewEditor=null;render();}catch(e){toast(e.message,'error');}}
  if(action==='view-delete'){const v=s.savedViews.find(v=>v.id===s.activeView);if(v&&window.confirm('Xóa view “'+v.name+'”? Dữ liệu yêu cầu vẫn được giữ.')){try{deleteView(s,v.id);s.viewEditor=null;render();toast('Đã xóa view.')}catch(e){toast(e.message,'error')}}}
  if(action==='log-detail'){s.logDetail=visibleLogs(s).some(e=>e.id===id)?id:null;render();}
  if(action==='log-detail-close'){s.logDetail=null;render();}
  if(action==='log-clear'){s.logFilters={q:'',actor:'',action:'',result:'',type:'',period:'',from:'',to:''};s.logDetail=null;s.logPage=1;render();}
  if(action==='log-sort'){s.logSort=s.logSort==='asc'?'desc':'asc';s.logPage=1;render();}
  if(action==='log-prev'||action==='log-next'){s.logPage+=action==='log-next'?1:-1;render();}
  if(action==='log-export'){
    if(s.role!=='SUPERVISOR'||s.revoked){recordEvent(s,{action:'log_export',objectType:'LOG_EXPORT',result:'DENIED',code:'EXPORT_DENIED'});return toast('Bạn không có quyền xuất nhật ký.','error');}
    const rows=visibleLogs(s);if(!rows.length)return toast('Không có sự kiện phù hợp để xuất.','warning');
    try {const url=URL.createObjectURL(new Blob([logCsv(rows)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='CSKH-log-20261101.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);recordEvent(s,{action:'log_export',objectType:'LOG_EXPORT',count:rows.length});render();toast('Đã tạo tệp CSV theo bộ lọc và quyền hiện tại.');}catch{recordEvent(s,{action:'log_export',objectType:'LOG_EXPORT',result:'FAILED',code:'EXPORT_FAILED'});toast('Chưa tạo được tệp. Vui lòng thử lại.','error');}
  }
  if (action === "view") {
    s.view = id;
    s.liveOnly=false;
    s.filters = emptyFilters();
    s.activeView=null;s.viewEditor=null;s.sortKey='received';
    s.page = 1;
    s.sort = id === "queue" ? "asc" : "desc";
    s.error = false;
    render();
  }
  if (action === "clear") {
    s.liveOnly=false;
    s.filters = emptyFilters();
    s.page = 1;
    render();
  }
  if (action === "sort") {
    s.sort = s.sort === "asc" ? "desc" : "asc";
    render();
  }
  if (action === "prev" || action === "next") {
    s.page += action === "next" ? 1 : -1;
    render();
  }
  if (action === "retry-list") {
    s.error = false;
    render();
  }
  if (action === "open") openCase(id);
  if (action === "claim") await save("claim", {}, el, id);
  if (action === "assign") {
    s.caseId = id;
    showOverlay("D-04");
  }
  if (action === "overlay") showOverlay(id);
  if (action === "close-overlay") closeOverlay();
  if (action === "start") await save("start", {}, el);
  if (action === "resume") {
    s.resume = true;
    render();
    document.querySelector("#resume-note")?.focus();
  }
  if (action === "save-resume")
    await save(
      "resume",
      { reason: document.querySelector("#resume-note")?.value },
      el,
    );
  if (action === "retry-chat") {
    el.disabled = true;
    await new Promise((r) => setTimeout(r, 350));
    if(s!==context)return false;
    if (params.get("fail") === "1") {
      el.disabled = false;
      return toast("Chưa tải được hội thoại. Vui lòng thử lại.", "error");
    }
    current(s).log = "FULL";
    render();
  }
  if (action === "link-mode") {
    if (
      isDirty() &&
      !window.confirm("Bỏ nội dung chưa lưu để đổi cách liên kết?")
    )
      return;
    s.linkMode = id;
    renderOverlay();
  }
  if (action === "copy-phone") {
    try {
      await navigator.clipboard.writeText(
        current(s).care.phone ?? current(s).original.phone,
      );
      toast("Đã sao chép số liên hệ.");
    } catch {
      toast("Trình duyệt chưa cho phép sao chép.", "error");
    }
  }
  if (action === "timeline-more") {
    s.moreTimeline = true;
    render();
  }
  if (action === "history-more") {
    s.showHistory = true;
    render();
  }
});
document.addEventListener("input", (event) => {
  const t = event.target;
  if(s.overlay && t.closest("#overlay-form")){s.formValues=dataForm();const error=document.querySelector("#modal-error");if(error){error.textContent="";error.classList.remove("visible");}}
  if (t.id === "search") {
    s.filters.q = t.value;
    s.page = 1;
    const caret = t.selectionStart;
    render();
    const search = document.querySelector("#search");
    search.focus();
    search.setSelectionRange(caret, caret);
  }
  if(t.id==='log-search'){s.logFilters.q=t.value;s.logPage=1;s.logDetail=null;const caret=t.selectionStart;render();const el=document.querySelector('#log-search');el.focus();el.setSelectionRange(caret,caret);}
  if(t.id==='view-name')s.viewName=t.value;
  if (t.id === "note") {
    s.noteDraft = t.value;
    document.querySelector("#note-count").textContent =
      t.value.length + " / 4.000";
  }
  if (t.id === "resume-note") s.resumeDraft = t.value;
  if (t.name === "contactQuery") {
    document.querySelector("#candidates").innerHTML = candidateList(s, t.value);
  }
  t.removeAttribute("aria-invalid");
});
document.addEventListener("change", (event) => {
  const t = event.target;
  if (rendering || !t.isConnected) return;
  if(s.overlay && t.closest("#overlay-form"))s.formValues=dataForm();
  if(t.id==='sort-key'){s.sortKey=t.value;s.page=1;render();}
  if(t.closest('#log-filters')&&t.name&&!t.dataset.filter){s.logFilters[t.name]=t.value;s.logPage=1;s.logDetail=null;render();}
  if (t.closest("#filters") && t.name && !t.dataset.filter && !t.closest(".wb-popover")) {
    s.filters[t.name] = t.value;
    s.page = 1;
    render();
  }
  if (s.overlay === "D-09" && t.name === "relationship") {
    const host=document.querySelector("#patient-field");
    host.hidden=t.value !== "REPRESENTATIVE";
    host.querySelector("input").required=t.value === "REPRESENTATIVE";
  }
});
document.addEventListener("submit", async (event) => {
  event.preventDefault();
  if(event.target.id==='view-editor'){
    s.viewName=document.querySelector('#view-name').value;
    try{saveView(s,s.viewName,s.viewEditor==='rename'?s.activeView:null);s.viewEditor=null;s.viewError='';render();toast('Đã lưu view cá nhân.');}catch(e){s.viewError=e.message;render();document.querySelector('#view-name')?.focus();}return;
  }
  if (event.target.id === "note-form")
    await save(
      "note",
      { text: document.querySelector("#note").value },
      event.submitter,
    );
  if (event.target.id === "overlay-form") {
    const actions = {
      "D-11": "ticket-create",
      "D-01": "link",
      "D-02": "contact",
      "D-09": "booking",
      "D-10": "crm",
      "D-03": "category",
      "D-04": "assign",
      "D-05": "wait",
      "D-06": "resolve",
      "D-07": "cancel",
      "D-08": "reopen",
    };
    await save(actions[s.overlay], dataForm(), event.submitter);
  }
});
document.addEventListener("keydown", (event) => {
  if(s.navOpen){
    if(event.key==="Escape"){event.preventDefault();document.querySelector(".mobile-close-nav")?.click();}
    if(event.key==="Tab"){const a=[...document.querySelectorAll("#portal-nav button:not(:disabled),#portal-nav a")].filter(x=>x.getClientRects().length);if(event.shiftKey&&document.activeElement===a[0]){event.preventDefault();a.at(-1)?.focus();}else if(!event.shiftKey&&document.activeElement===a.at(-1)){event.preventDefault();a[0]?.focus();}}
    return;
  }
  if (!s.overlay) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeOverlay();
  }
  if (event.key === "Tab") {
    const items = [
      ...overlays.querySelectorAll(
        "button:not(:disabled),input:not(:disabled):not([type=hidden]),select:not(:disabled),textarea:not(:disabled)",
      ),
    ].filter((el) => el.getClientRects().length);
    const first = items[0],
      last = items.at(-1);
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement.id === "overlay-title")
    ) {
      event.preventDefault();
      last?.focus();
    } else if (
      !event.shiftKey &&
      (document.activeElement === last ||
        document.activeElement.id === "overlay-title")
    ) {
      event.preventDefault();
      first?.focus();
    }
  }
});
window.addEventListener("resize",()=>{if(innerWidth>1023&&s.navOpen)document.querySelector(".mobile-close-nav")?.click();});
window.addEventListener("beforeunload", (e) => {
  if (s.noteDraft || s.resumeDraft || s.ticketNote || Object.values(s.liveDrafts||{}).some(Boolean) || isDirty()) {
    e.preventDefault();
    e.returnValue = "";
  }
});
window.CSKH = {
  ready: false,
  inspect: () => ({
    frame: s.frame,
    screen: s.screen,
    role: s.role,
    view: s.view,
    overlay: s.overlay,
    pending,
    filters:structuredClone(s.filters),sortKey:s.sortKey,sort:s.sort,columns:[...s.columns],savedViews:structuredClone(s.savedViews),activeView:s.activeView,logs:structuredClone(visibleLogs(s)),
    tickets:structuredClone(s.tickets),ticketId:s.ticketId,liveDrafts:structuredClone(s.liveDrafts),liveOnly:s.liveOnly,clockOffset:s.clockOffset,caseCount:s.cases.length,
    current: current(s),
    visibleIds: visibleCases(s).map((x) => x.id),
  }),
  loadFrame: (frame, { holdFeedback = false } = {}) => {
    s = scenario(frame);
    hydrateViews(s);
    pending = false;
    document.querySelector("#toast").className = "";
    render();
    if (s.conflict)
      toast(
        "Yêu cầu đã có người phụ trách. Danh sách đã được cập nhật.",
        "warning",
      );
    // Only the external review/capture harness holds transient feedback.
    // Normal user actions retain the original 6.5-second toast duration.
    if (holdFeedback) clearTimeout(toastTimer);
  },
  advanceClock: (ms) => {s.clockOffset+=ms;render();},
  simulateRevoke: () => {
    s.revoked = true;
    s.liveDrafts={};s.ticketNote="";
    s.noteDraft = "";
    s.resumeDraft = "";
    s.formValues = null;
    s.overlay = null;
    if (current(s)) current(s).owner = "linh";
    render();
  },
  simulateCRM: (version, state, ref, receiver) => {
    const c=current(s), h=c?.crmHandoff;
    if (!h || !Number.isInteger(version) || version<=h.version || !["ACCEPTED","REJECTED"].includes(state)) return false;
    if (state === "ACCEPTED" && (!ref || !receiver)) return false;
    const before=structuredClone(c);
    Object.assign(h,{version,state,ref:ref||null,receiver:receiver||null});
    recordEvent(s,{action:"crm_update",caseId:c.id,actor:"system",before,after:c});
    c.audit.unshift({title:"CRM cập nhật tiếp nhận",detail:state === "ACCEPTED" ? `${ref} · ${receiver}` : "CRM chưa tiếp nhận. CSKH tiếp tục xử lý.", time:"09:45"});
    render(); return true;
  },
  simulateSource: (version, status, id) => {
    const c = current(s);
    if (!c?.bookingRequest || !Number.isInteger(version) || version <= c.sourceVersion || !["PENDING_ARRANGEMENT","CONFIRMED","CANCELLED","REJECTED","UNKNOWN"].includes(status)) return false;
    if (status === "CONFIRMED" && !id) return false;
    const before=structuredClone(c);
    c.sourceVersion = version;
    c.bookingStatus = status;
    c.appointmentId = id || null;
    recordEvent(s,{action:"source_update",caseId:c.id,actor:"system",before,after:c});
    c.audit.unshift({
      title: "Cập nhật lịch từ nguồn",
      detail: status,
      time: "09:45",
    });
    render();
    return true;
  },
};
const filterControls=installFilterControls(()=>s,render);
installOperations(()=>s,render,toast,confirmLeave);
render();
if (s.conflict)
  toast(
    "Yêu cầu đã có người phụ trách. Danh sách đã được cập nhật.",
    "warning",
  );

mountReview();
