import { STORE_KEY, createSession, demoSession } from './chat-model.js';
let memory = { sessions: [], activeId: null };
export let storageAvailable = true;
export function loadStore() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) { const value = JSON.parse(raw); if (Array.isArray(value.sessions)) memory = value; } }
  catch { storageAvailable = false; }
  return structuredClone(memory);
}
export function saveStore(value) {
  memory = structuredClone(value);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); } catch { storageAvailable = false; }
  window.dispatchEvent(new CustomEvent('chat-store-update'));
}
export function initSession() {
  const params = new URLSearchParams(location.search), db = loadStore();
  let s = db.sessions.find(s => s.id === (params.get('sid') || db.activeId));
  if (!s || params.has('scenario')) {
    s = params.has('scenario') ? demoSession(params.get('scenario'), params.get('channel') === 'APP' ? 'APP' : 'WEB') : createSession();
    db.sessions.push(s); db.activeId=s.id; saveStore(db);
  }
  const url = new URL(location.href); url.searchParams.set('sid',s.id); url.searchParams.delete('scenario'); url.searchParams.delete('channel'); history.replaceState(null,'',url);
  return s.id;
}
export function getSession(id) { return loadStore().sessions.find(s=>s.id===id); }
export async function changeSession(id, fn) {
  const apply = () => {
    const db=loadStore(), s=db.sessions.find(s=>s.id===id);
    if (!s) throw Error('Phiên mẫu không còn tồn tại. Mở phiên mới để tiếp tục.');
    const result=fn(s); saveStore(db); return result;
  };
  return navigator.locks ? navigator.locks.request(STORE_KEY, apply) : apply();
}
export function subscribe(fn) {
  window.addEventListener('storage', e=>{ if(e.key===STORE_KEY) fn(); });
  window.addEventListener('chat-store-update',fn);
}
export function addSession(s) { const db=loadStore();db.sessions.push(s);db.activeId=s.id;saveStore(db);return s.id; }
