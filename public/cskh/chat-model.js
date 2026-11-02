export const POLICY_URL = 'https://hiuhospital.com/chinh-sach-bao-mat';
export const CONFIG = Object.freeze({ idleMs: 600000, warningMs: 120000, maxMessage: 4000 });
export const STORE_KEY = 'hiuh-ai-chat-review-v09';
const requireThat = (condition, message) => { if (!condition) throw Error(message); };
export const uid = () => globalThis.crypto.randomUUID();
export const remainingMs = (s, now = Date.now()) => Math.max(0, s.expiresAt - now);
export const sessionStatus = (s, now = Date.now()) => s.phase === 'ENDED' || !remainingMs(s, now) ? 'EXPIRED' : !s.connected ? 'UNKNOWN' : remainingMs(s, now) <= s.config.warningMs ? 'ENDING' : 'ACTIVE';
export const canSend = (s, now = Date.now()) => ['ACTIVE','ENDING'].includes(sessionStatus(s, now));
export const clockText = (s, now = Date.now()) => { const n = Math.ceil(remainingMs(s, now) / 1000); return `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`; };
export function event(s, type, meta = {}, now = Date.now()) {
  s.events.push({ id: uid(), type, at: now, order:s.revision+1, sequence: s.events.length + 1, ...meta });
  s.revision++;
}
export function createSession(channel = 'WEB', now = Date.now(), config = CONFIG) {
  const s = { id: `AI-${channel}-${uid().slice(0,8).toUpperCase()}`, channel, config: {...config}, createdAt: now, expiresAt: now + config.idleMs, lastCustomerActivityAt: now, connected: true, phase: 'AI_ACTIVE', humanLocked: false, owner: null, caseState: null, caseId: null, locale: 'vi', localeMode: 'auto', localeSource: 'fallback', revision: 0, messages: [], events: [], contact: { name: '', phone: '' }, care: null, warnings: [], handoff: null, coverage: 'FULL', notes: [], seen: [], notice: { shownAt: now, language: 'vi', policyUrl: POLICY_URL, copyVersion: 'chat-notice-20261102', consent: null } };
  event(s, 'SESSION_STARTED', { channel }, now);
  event(s, 'NOTICE_SHOWN', { locale: 'vi' }, now);
  s.messages.push({ id: uid(), role: 'AI', text: 'Xin chào! Tôi là Trợ lý AI của Bệnh viện Đại học Quốc tế Hồng Bàng. Tôi có thể hỗ trợ bạn tìm thông tin khám và dịch vụ của bệnh viện.', at: now, locale: 'vi', order:0 });
  return s;
}
export function normalizePhone(raw) {
  let phone = String(raw ?? '').trim().replace(/[\s.()\-–—]/g, '');
  if (/^\+84\d{9}$/.test(phone)) phone = '0' + phone.slice(3);
  return phone;
}
export function validateContact(contact) {
  const errors = [];
  if (!String(contact.name ?? '').trim()) errors.push('ERR_NAME_EMPTY');
  if (!String(contact.phone ?? '').replace(/[\s\-–—]/g,'')) errors.push('ERR_PHONE_EMPTY');
  else if (!/^\d{10}$/.test(normalizePhone(contact.phone))) errors.push('ERR_PHONE_INVALID');
  return errors;
}
export function setLanguage(s, mode, now = Date.now()) {
  requireThat(['auto','vi','en'].includes(mode), 'Ngôn ngữ chưa được hỗ trợ.');
  const before = s.locale;
  s.localeMode = mode;
  s.locale = mode === 'auto' ? 'vi' : mode;
  s.localeSource = mode === 'auto' ? 'fallback' : 'manual';
  event(s, 'LANGUAGE_CHANGED', { before, locale: s.locale, source: s.localeSource }, now);
}
// Small, explicit demo detector. Production requires a confidence-aware language service.
export function detectLanguage(s, text, now = Date.now()) {
  if (s.localeMode !== 'auto') return;
  const english = /\b(hello|please|appointment|english|help|thank|staff)\b/i.test(text);
  const vietnamese = /[ăâđêôơưĂÂĐÊÔƠƯàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/.test(text);
  const locale = vietnamese ? 'vi' : english ? 'en' : s.locale;
  if (locale !== s.locale) { const before = s.locale; s.locale = locale; s.localeSource = 'detected'; event(s, 'LANGUAGE_CHANGED', { before, locale, source: 'detected' }, now); }
}
export function expire(s, now = Date.now()) {
  if (s.phase !== 'ENDED' && now >= s.expiresAt) { s.phase = 'ENDED'; event(s, 'SESSION_EXPIRED', {}, s.expiresAt); return true; }
  return false;
}
function activity(s, now) { s.lastCustomerActivityAt = now; s.expiresAt = now + s.config.idleMs; }
export function openHandoff(s, now = Date.now()) {
  requireThat(canSend(s,now) && !s.humanLocked && s.phase === 'AI_ACTIVE', 'Phiên chưa sẵn sàng để chuyển CSKH.');
  s.phase = 'HANDOFF_FORM';
}
export function cancelHandoff(s) {
  requireThat(s.phase === 'HANDOFF_FORM' && !s.humanLocked, 'Phiên đã chuyển sang CSKH.');
  s.phase = 'AI_ACTIVE';
}
export function requestHandoff(s, contact, { allowWarnings = false, key = uid(), now = Date.now() } = {}) {
  if (s.handoff?.key === key) {
    requireThat(s.contact.name === String(contact.name??'') && s.contact.phone === String(contact.phone??''), 'Cùng khóa bàn giao nhưng nội dung khác. Kiểm tra yêu cầu đã nhận.');
    return s.handoff;
  }
  requireThat(canSend(s,now) && s.phase === 'HANDOFF_FORM' && !s.humanLocked, 'Phiên đã hết hoặc đã gửi yêu cầu.');
  const warnings = validateContact(contact);
  if (warnings.length && !allowWarnings) return { warnings, needsConfirmation: true };
  requireThat(String(contact.name??'').length<=100 && String(contact.phone??'').length<=50, 'Tên tối đa 100 ký tự, số điện thoại tối đa 50 ký tự.');
  s.contact = { name: String(contact.name ?? '').slice(0,100), phone: String(contact.phone ?? '').slice(0,50) };
  s.warnings = validateContact(s.contact);
  s.phase = 'REQUESTED'; s.humanLocked = true;
  s.caseId = `CS-DEMO-${s.id.slice(-8)}`; s.caseState = 'NEW';
  s.handoff = { key, receivedAt: now, botAckAt: null, requestId: uid(), snapshotMessageIds: s.messages.map(m=>m.id), locale: s.locale, acknowledgedWarnings: allowWarnings && warnings.length > 0 };
  activity(s,now);
  event(s, 'HANDOFF_REQUESTED', { validationCodes: [...s.warnings], result: 'SUCCESS' }, now);
  return s.handoff;
}
export function claimCase(s, actor = 'Mai Anh', now = Date.now()) {
  requireThat(s.caseId && !s.owner, 'Ca đã có người phụ trách hoặc chưa được bàn giao.');
  s.owner = actor; event(s, 'CASE_CLAIMED', { actor }, now);
}
export function startCase(s, actor = 'Mai Anh', now = Date.now()) {
  requireThat(s.owner === actor && s.caseState === 'NEW', 'Chỉ người phụ trách được bắt đầu xử lý.');
  s.caseState = 'IN_PROGRESS'; event(s, 'CASE_STARTED', { actor }, now);
}
export function acceptHandoff(s, actor = 'Mai Anh', now = Date.now()) {
  requireThat(s.owner === actor && s.caseState === 'IN_PROGRESS' && s.phase === 'REQUESTED' && canSend(s,now), 'Kiểm tra phụ trách, tiến độ và kết nối trước khi tiếp quản.');
  s.handoff.botAckAt = now; s.phase = 'HUMAN_ACTIVE'; s.humanLocked = true;
  event(s, 'HUMAN_CONNECTED', { actor, botAck: true }, now);
}
export function sendMessage(s, role, text, { key = uid(), now = Date.now(), actor = 'Mai Anh', sessionId = s.id } = {}) {
  requireThat(sessionId === s.id, 'Sai phiên hội thoại.');
  if (s.seen.includes(key)) {
    const prior=s.messages.find(m=>m.id===key);
    requireThat(prior?.text===String(text).trim()&&prior.role===role, 'Cùng khóa tin nhắn nhưng nội dung khác.');
    return false;
  }
  requireThat(canSend(s,now), 'Phiên đã hết hoặc mất kết nối. Nội dung nháp được giữ.');
  const body = String(text).trim();
  requireThat(body && body.length <= s.config.maxMessage, 'Tin nhắn cần từ 1 đến 4.000 ký tự.');
  if (role === 'CUSTOMER') {
    requireThat(s.phase !== 'HANDOFF_FORM', 'Hoàn tất hoặc đóng form chuyển CSKH trước.');
    requireThat(now >= s.lastCustomerActivityAt, 'Sự kiện cũ không gia hạn phiên.');
    activity(s,now); detectLanguage(s,body,now);
  } else if (role === 'STAFF') {
    requireThat(s.phase === 'HUMAN_ACTIVE' && s.owner === actor && s.caseState === 'IN_PROGRESS' && s.handoff?.botAckAt, 'Chỉ gửi sau khi nhận ca, bắt đầu xử lý và có xác nhận AI đã dừng.');
  } else if (role === 'AI') requireThat(!s.humanLocked && s.phase === 'AI_ACTIVE', 'AI đã dừng trong phiên này.');
  else throw Error('Người gửi không hợp lệ.');
  s.seen.push(key);
  s.messages.push({ id:key, role, text:body, at:now, locale:s.locale, order:s.revision+1 });
  event(s, 'MESSAGE_SENT', { messageId:key, role, result:'SUCCESS' }, now);
  return true;
}
export function reconnect(s, now = Date.now()) {
  requireThat(s.phase !== 'ENDED' && remainingMs(s,now) > 0, 'Phiên đã hết. Bắt đầu phiên mới để tiếp tục.');
  s.connected = true; event(s, 'CONNECTION_RESTORED', {}, now);
}
export function updateCare(s, contact, actor = 'Mai Anh', now = Date.now(), reason = '') {
  requireThat(s.owner === actor, 'Bạn cần là người phụ trách.');
  requireThat(!validateContact(contact).length, 'Kiểm tra tên và số điện thoại 10 chữ số.');
  const before=s.care||s.contact;
  const correction=['name','phone'].some(k=>String(before[k]||'').trim()&&String(before[k]).trim()!==String(contact[k]).trim());
  requireThat(!correction||reason.trim(), 'Ghi lý do khi sửa thông tin đã có.');
  s.careHistory||=[];
  s.careHistory.push({before:{...before},after:{name:contact.name,phone:contact.phone},reason:reason.trim(),actor,at:now});
  s.care = { name:contact.name.trim(), phone:normalizePhone(contact.phone), updatedAt:now, actor };
  event(s, 'CONTACT_SUPPLEMENTED', { actor }, now);
}
export function demoSession(name='initial', channel='WEB', now=Date.now()) {
  const s=createSession(channel,now);
  if (name==='english') { setLanguage(s,'en',now); sendMessage(s,'CUSTOMER','Hello, I would like help with an appointment.',{now}); }
  if (['form','warning','waiting','human','invalid','partial','expired','offline'].includes(name)) {
    sendMessage(s,'CUSTOMER','Tôi muốn hỏi thêm về lịch khám vào sáng thứ Bảy.',{now});
    sendMessage(s,'AI','Tôi có thể hỗ trợ bạn tìm thông tin. Bạn cũng có thể chọn kết nối với bộ phận CSKH để được trao đổi trực tiếp.',{now});
  }
  if (['form','validation'].includes(name)) openHandoff(s,now);
  if (['waiting','human','invalid','partial','expired','offline'].includes(name)) {
    openHandoff(s,now); requestHandoff(s,{name:'Nguyễn Minh An',phone:name==='invalid'?'090 123':'090 000 0000'},{allowWarnings:true,now});
    if (name!=='waiting') {claimCase(s,'Mai Anh',now);startCase(s,'Mai Anh',now);}
    if (name==='human') {acceptHandoff(s,'Mai Anh',now);sendMessage(s,'STAFF','Chào bạn An, mình là Mai Anh từ bộ phận CSKH. Mình đã nhận được nội dung bạn trao đổi và sẽ hỗ trợ thêm về lịch khám.',{now});}
  }
  if (name==='warning') {s.lastCustomerActivityAt=now-s.config.idleMs+95000;s.expiresAt=now+95000;}
  if (name==='expired') {s.expiresAt=now-1;expire(s,now);}
  if (name==='offline') s.connected=false;
  if (name==='partial') s.coverage='PARTIAL';
  return s;
}
