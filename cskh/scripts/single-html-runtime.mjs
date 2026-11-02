// Serialized by the exporter; no imports or dependencies may be used inside.
export function bootSingleHtml(){
  const data=JSON.parse(document.getElementById('handoff-data').textContent);
  const expand=text=>text.replace(/__CSKH_ASSET_(\d+)__/g,(_,id)=>data.assets[Number(id)]);
  const params=new URLSearchParams(location.search);
  const surface=params.get('surface')||(params.has('frame')?'portal':'review');
  const page=data.pages[surface]||data.pages.review;
  const base=location.href.split('?')[0].split('#')[0];
  const fileRoutes=Object.fromEntries(Object.entries(data.routes).map(([key,file])=>[file.split('/').at(-1),key]));
  function destination(ref){
    if(!ref||/^(?:[a-z]+:|#|\/\/)/i.test(ref))return ref;
    if(ref.startsWith('?'))return base+ref;
    const [file,query='']=ref.split('?');
    const route=fileRoutes[file.split('/').at(-1)];
    if(!route)return null;
    const next=new URLSearchParams(query);next.set('surface',route);return base+'?'+next.toString();
  }
  window.__handoffNavigate=ref=>{const next=destination(ref);if(next)location.href=next;};
  function navigate(e){
    const anchor=e.composedPath().find(el=>el?.tagName==='A');if(!anchor||anchor.hasAttribute('download'))return;
    const ref=anchor.getAttribute('href');const next=destination(ref);
    if(next&&next!==ref){anchor.href=next;}
  }
  document.addEventListener('click',navigate,true);
  // Rewrite dynamic chat links as well, so copy-link/new-tab keeps the single file.
  function rewrite(root){for(const a of root.querySelectorAll?.('a[href]')||[]){const ref=a.getAttribute('href'),next=destination(ref);if(next&&next!==ref)a.setAttribute('href',next);}}
  function mobileHome(){
    const header=document.querySelector('.portal-header');if(!header||header.querySelector('.handoff-mobile-home'))return;
    const a=document.createElement('a');a.className='handoff-mobile-home';a.href=base+'?surface=review';a.textContent='↩';a.title='Về bộ review';a.setAttribute('aria-label','Về bộ review');header.append(a);
  }
  document.title=page.title+' · Offline v0.9';
  const style=document.createElement('style');style.textContent=expand(page.styles);document.head.append(style);
  const exportStyle=document.createElement('style');exportStyle.textContent='.handoff-mobile-home{display:none}@media(max-width:600px){.portal-header .handoff-mobile-home{display:inline-flex;align-items:center;justify-content:center;flex:0 0 44px;height:44px;margin-left:auto;color:#0052d7;font:22px/1 system-ui;text-decoration:none}.portal-breadcrumb{min-width:0;overflow:hidden}}';document.head.append(exportStyle);
  document.body.className=page.className;
  document.body.innerHTML=expand(page.body);
  rewrite(document);
  new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)rewrite(node);mobileHome();}).observe(document.body,{subtree:true,childList:true});
  const host=document.createElement('div');host.id='handoff-navigation';document.body.append(host);
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>:host{position:fixed;right:14px;bottom:14px;z-index:16000;font:12px/1.5 Lexend,system-ui;color:#16205c}button,a{font:inherit}button{border:1px solid #bdcbe6;background:#fff;color:#16205c;border-radius:20px;padding:10px 16px;cursor:pointer;box-shadow:0 3px 12px #16205c16}button:focus-visible,a:focus-visible{outline:3px solid #6597ed;outline-offset:2px}#panel{position:fixed;inset:auto 14px 62px auto;margin:0;width:290px;max-width:calc(100vw - 28px);max-height:70vh;overflow:auto;padding:20px;background:#fff;border:1px solid #c7cce0;border-radius:12px;color:#16205c;box-shadow:0 6px 26px #16205c22}h2{font-size:16px;margin:0 0 12px}a{display:block;color:#0052d7;text-decoration:none;padding:10px 8px;border-radius:6px}a:hover{background:#eef3fd}p{font-size:11px;color:#59657b;margin:12px 0 0}#download{margin-top:12px}@media print{:host{display:none}}</style><button type="button" popovertarget="panel">Bộ bàn giao · v0.9</button><div id="panel" popover="auto"><h2>CSKH · Prototype v0.9</h2><a href="?surface=review">Tổng quan & trạng thái mẫu</a><a href="?surface=portal&frame=M-03">Tiếp nhận & Xử lý</a><a href="?surface=customer">AI chat phía khách</a><a href="?surface=staff">AI log phía CSKH</a><a href="?surface=frames">51 frame Portal</a><a href="?surface=brd">Đọc BRD v0.9</a><a href="?surface=design">Design system & ánh xạ</a><button id="download" type="button">Tải BRD Markdown</button><p>Dữ liệu mô phỏng. AI, mạng, ACK và quyền chưa kết nối hệ thống thật. Mở cùng file trong hai tab để thử chat hai phía.</p></div>`;
  rewrite(shadow);
  // Customer has its review bar; Portal gets a compact home link in the header.
  // Keep the export-only launcher away from send buttons and table pagination.
  const mobileStyle=document.createElement('style');
  mobileStyle.textContent='@media(max-width:600px){:host{display:none}}';
  shadow.append(mobileStyle);
  shadow.querySelector('#download').onclick=()=>{const url=URL.createObjectURL(new Blob([data.brdMarkdown],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='CSKH-01-brd-v0.9.0.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  if(page.script){const script=document.createElement('script');script.textContent=expand(page.script);document.body.append(script);}
  window.__CSKH_HANDOFF={version:data.version,surface,pages:Object.keys(data.pages),assets:data.assets.length};
}
