import {esc,icon,field} from './views.js';

// One control for all case filters. Native popover puts options above scroll containers.
export function filterChip({label,name,value,options,multiple=false,locked=false,extra='',leading='',className='',scope='cases'}) {
  const values=Array.isArray(value)?value:value?[value]:[],active=values.length>0,key=scope==='cases'?name:scope+'-'+name;
  return `<div class="wb-filter ${className}" data-menu="${key}"><button type="button" class="wb-filter-trigger ${active?'is-active':''}" data-filter-trigger="${key}" aria-expanded="false" ${locked?'':`aria-controls="filter-pop-${key}" aria-haspopup="dialog"`} ${locked?'aria-disabled="true" aria-describedby="status-lock-hint"':''}>${leading?icon(leading):'<span class="filter-dot" aria-hidden="true"></span>'}<span>${esc(label)}${locked?': Mới':active&&multiple&&name!=='columns'?' · '+values.length:''}</span>${icon('ChevronDown')}</button>${locked?'<span id="status-lock-hint" class="filter-hint" role="tooltip">Chờ nhận chỉ có trạng thái Mới.</span>':`<div id="filter-pop-${key}" class="wb-popover" popover="manual" role="dialog" aria-label="${esc(label)}" data-filter-scope="${scope}" data-filter-name="${name}" data-multiple="${multiple}"><div class="popover-heading"><strong>${esc(label)} · ${multiple?'Chọn nhiều':'Chọn một'}</strong><button type="button" class="button ghost icon-only" data-filter-close aria-label="Đóng ${esc(label)}">${icon('X')}</button></div><div class="popover-options">${options.map(([v,text])=>`<label class="filter-option"><input type="${multiple?'checkbox':'radio'}" name="filter-${key}" data-filter="${name}" data-filter-scope="${scope}" value="${esc(v)}" ${values.includes(v)||(!values.length&&v==='')?'checked':''}>${esc(text)}</label>`).join('')}</div>${extra}${multiple?`<p class="filter-guidance">${name==='columns'?'Mã yêu cầu và thao tác luôn hiển thị.':'Không chọn = tất cả. Kết quả cập nhật ngay.'}</p><div class="popover-footer"><button type="button" class="button ghost" data-filter-clear>${name==='columns'?'Mặc định':'Bỏ chọn'}</button><button type="button" class="button primary" data-filter-close>Xong</button></div>`:''}</div>`}</div>`;
}
export const filterDateRange=f=>f.period==='custom'?`<div class="filter-date-range">${field('Từ ngày','from',f.from,{type:'date',id:'case-from'})}${field('Đến ngày','to',f.to,{type:'date',id:'case-to'})}${f.from&&f.to&&f.from>f.to?'<p class="form-error" role="alert">Ngày kết thúc phải từ ngày bắt đầu trở đi.</p>':''}</div>`:'';

export function installFilterControls(getState,render) {
  let active=null;
  const group=(s,scope)=>scope==='log'?s.logFilters:scope==='tickets'?s.ticketFilter:s.filters;
  const resetPage=(s,scope)=>{if(scope==='log'){s.logPage=1;s.logDetail=null;}else if(scope==='tickets')s.ticketPage=1;else s.page=1;};
  const trigger=key=>document.querySelector(`[data-filter-trigger="${key}"]`);
  const panel=key=>document.getElementById('filter-pop-'+key);
  const inputs=p=>[...p.querySelectorAll('input:not(:disabled)')];
  function close(restore=false) {
    if(!active)return;
    const key=active;active=null;
    const p=panel(key);if(p?.matches(':popover-open'))p.hidePopover();
    trigger(key)?.setAttribute('aria-expanded','false');
    if(restore)trigger(key)?.focus();
  }
  function position() {
    const p=panel(active),b=trigger(active);if(!p||!b)return;
    const r=b.getBoundingClientRect(),gap=4,edge=12;
    const h=p.getBoundingClientRect().height,w=p.getBoundingClientRect().width;
    p.style.left=Math.max(edge,Math.min(r.left,innerWidth-w-edge))+'px';
    p.style.top=Math.max(edge,Math.min(r.bottom+gap,innerHeight-h-edge))+'px';
  }
  function open(key,focus=true) {
    const b=trigger(key),p=panel(key);if(!b||!p||b.getAttribute('aria-disabled')==='true')return;
    close();active=key;p.showPopover();b.setAttribute('aria-expanded','true');position();
    if(focus)(p.querySelector('input:checked')||inputs(p)[0]||p.querySelector('button'))?.focus({preventScroll:true});
  }
  function update(keep,focusId) {
    const key=active,strip=document.querySelector('.wb-filter-strip'),scroll=strip?.scrollLeft||0;
    close();render();const nextStrip=document.querySelector('.wb-filter-strip');if(nextStrip)nextStrip.scrollLeft=scroll;
    if(keep){open(key,false);const p=panel(key);const t=focusId?.id?document.getElementById(focusId.id):[...p.querySelectorAll('input')].find(el=>el.dataset.filter===focusId?.name&&el.value===focusId?.value);t?.focus({preventScroll:true});}
    else trigger(key)?.focus({preventScroll:true});
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-filter-trigger]');
    if(b){e.preventDefault();if(b.getAttribute('aria-disabled')==='true')return;active===b.dataset.filterTrigger?close(true):open(b.dataset.filterTrigger);return;}
    if(e.target.closest('[data-filter-clear]')){const p=panel(active),s=getState(),scope=p.dataset.filterScope,key=p.dataset.filterName;if(key==='columns')s.columns=['source','person','topic','lastMessage','status','owner','received','follow'];else group(s,scope)[key]=[];resetPage(s,scope);update(true);panel(active)?.querySelector('[data-filter-clear]')?.focus();return;}
    if(e.target.closest('[data-filter-close]'))return close(true);
    if(active&&!panel(active)?.contains(e.target))close();
  });
  document.addEventListener('change',e=>{
    const t=e.target,s=getState();
    if(t.dataset.filter){
      const key=t.dataset.filter,scope=t.dataset.filterScope||'cases',f=group(s,scope);
      if(key==='columns'){s.columns=t.checked?[...new Set([...s.columns,t.value])]:s.columns.filter(v=>v!==t.value);}
      else if(t.type==='checkbox'){const values=Array.isArray(f[key])?f[key]:f[key]?[f[key]]:[];f[key]=t.checked?[...new Set([...values,t.value])]:values.filter(v=>v!==t.value);}
      else f[key]=t.value;
      resetPage(s,scope);update(t.type==='checkbox'||(key==='period'&&t.value==='custom'),{name:key,value:t.value});
    }else if(t.closest('.filter-date-range')){s.filters[t.name]=t.value;s.page=1;update(true,{id:t.id});}
  });
  document.addEventListener('keydown',e=>{
    if(!active)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close(true);return;}
    const p=panel(active);if(!p?.contains(e.target))return;
    const options=inputs(p).filter(x=>x.type==='checkbox'||x.type==='radio');
    const at=options.indexOf(e.target);
    if(at>=0&&['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();options[(at+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+options.length)%options.length]?.focus();}
    if(at>=0&&e.key==='Enter'){e.preventDefault();e.target.click();}
    if(e.key==='Tab'){
      const focusables=[...p.querySelectorAll('button,input')].filter(x=>!x.disabled);
      if(e.shiftKey&&e.target===focusables[0]){e.preventDefault();close(true);}
      else if(!e.shiftKey&&e.target===focusables.at(-1)){
        const b=trigger(active);const all=[...document.querySelectorAll('button,input,select,a[href],summary')].filter(x=>!x.disabled&&!x.closest('.wb-popover')&&x.getClientRects().length);
        const next=all[all.indexOf(b)+1];close();if(next){e.preventDefault();next.focus();}
      }
    }
  },true);
  window.addEventListener('resize',()=>{if(active)position();});
  document.addEventListener('scroll',e=>{if(active&&!panel(active)?.contains(e.target))position();},true);
  return {close};
}
