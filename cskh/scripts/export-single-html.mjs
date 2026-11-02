import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {bootSingleHtml} from './single-html-runtime.mjs';

const root=path.resolve(import.meta.dirname,'..');
const localRequire=createRequire(import.meta.url);
const candidates=[root,process.cwd(),process.env.CSKH_BUILD_MODULES,'/Users/phongnguyen/workspace/HoangPM_reqwise-figma-mcp'].filter(Boolean);
const resolve=name=>localRequire.resolve(name,{paths:candidates});
const {build}=await import(pathToFileURL(resolve('esbuild')));
const {marked}=await import(pathToFileURL(resolve('marked')));
const inputs=new Map(),assets=[],assetIds=new Map();
const digest=data=>createHash('sha256').update(data).digest('hex');
function read(file){const data=fs.readFileSync(file);inputs.set(path.relative(root,file),digest(data));return data.toString('utf8');}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function asset(file){
  file=path.resolve(file);if(!assetIds.has(file)){
    const raw=fs.readFileSync(file);inputs.set(path.relative(root,file),digest(raw));
    const mime={'.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'}[path.extname(file)];
    if(!mime)throw Error('Unsupported asset: '+file);
    assetIds.set(file,assets.length);assets.push('data:'+mime+';base64,'+raw.toString('base64'));
  }
  return '__CSKH_ASSET_'+assetIds.get(file)+'__';
}
function css(file,stack=[]){
  file=path.resolve(file);if(stack.includes(file))throw Error('Circular CSS import: '+file);
  let value=read(file).replace(/@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?\s*;/g,(_,ref)=>{
    if(/^(https?:|\/\/)/.test(ref))throw Error('Remote CSS dependency: '+ref);
    return css(path.resolve(path.dirname(file),ref),[...stack,file]);
  });
  return value.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/g,(all,ref)=>{
    if(/^(data:|#|__CSKH_ASSET_)/.test(ref))return all;
    if(/^(https?:|\/\/)/.test(ref))throw Error('Remote CSS asset: '+ref);
    return 'url("'+asset(path.resolve(path.dirname(file),ref))+'")';
  });
}

const brdRel = fs.existsSync(path.resolve(root, 'docs/CSKH-01-brd-v0.9.0.md')) ? 'docs/CSKH-01-brd-v0.9.0.md' : '../CSKH-01-brd-v0.9.0.md';
const aiDesignRel = fs.existsSync(path.resolve(root, 'docs/CSKH-ai-chat-design-spec-v0.8.0.md')) ? 'docs/CSKH-ai-chat-design-spec-v0.8.0.md' : '../CSKH-ai-chat-design-spec-v0.8.0.md';

const routes={
  review:'review-ai.html',portal:'index.html',customer:'customer-chat.html',staff:'ai-log.html',frames:'review.html',
  brd:brdRel,guide:'README.md',design:'DESIGN.md',qa:'QA.md',aiDesign:aiDesignRel
};
const routeFiles=new Map(Object.entries(routes).map(([key,file])=>[path.resolve(root,file),key]));
function links(html,source){
  return html.replace(/<a\b([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,(all,before,ref,after,label)=>{
    if(/^(?:[a-z]+:|#|\/\/)/i.test(ref))return all;
    const [file,query='']=ref.split('?');const [queryOnly,fragment='']=query.split('#');
    const key=routeFiles.get(path.resolve(path.dirname(source),file.split('#')[0]));
    if(!key)return '<span title="Tham chiếu trong kho mã: '+esc(ref)+'">'+label+'</span>';
    const params=new URLSearchParams(queryOnly.replaceAll('&amp;','&'));params.set('surface',key);
    return '<a'+before+'href="?'+esc(params.toString())+(fragment?'#'+esc(fragment):'')+'"'+after+'>'+label+'</a>';
  });
}
const docCss=`*{box-sizing:border-box}body{margin:0;background:#f6f8fd;color:#3b4177;font:14px/1.7 Lexend,system-ui}main{max-width:1240px;margin:auto;padding:32px 28px 90px}h1,h2,h3,h4{font-family:'Plus Jakarta Sans',system-ui;color:#16205c;line-height:1.35;scroll-margin-top:20px}h1{font-size:28px}h2{font-size:22px;margin-top:42px}h3{font-size:18px;margin-top:32px}h4{font-size:16px}a{color:#0052d7}table{display:block;overflow:auto;border-collapse:collapse;background:#fff;margin:24px 0;max-width:100%}th,td{border:1px solid #d7e0f0;padding:12px 16px;text-align:left;min-width:120px;vertical-align:top}th{background:#eef3fd}code{font:12px/1.6 ui-monospace,monospace;overflow-wrap:anywhere}pre{padding:18px;background:#eef1f9;overflow:auto;border-radius:8px}blockquote{border-left:4px solid #0052d7;margin:24px 0;padding:12px 20px;background:#fff}nav{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:24px}.doc-note{padding:16px;background:#eaf1ff;border-radius:8px}img{max-width:100%}@media(max-width:600px){main{padding:20px 16px 80px}h1{font-size:22px}}`;
const pages={};
for(const [key,ref] of Object.entries(routes)){
  const file=path.resolve(root,ref);let html=read(file);let styles='',script='',body='',className='';
  if(ref.endsWith('.md')){
    const markdown=html.replace(/^---\n[\s\S]*?\n---\n/,'');
    const rendered=links(marked.parse(markdown),file);
    styles=css(path.join(root,'fonts.css'))+'\n'+docCss;
    body='<main><nav><a href="?surface=review">← Bộ review</a><a href="?surface=portal&frame=M-03">Mở Portal</a></nav><p class="doc-note">Tài liệu được nhúng trong file bàn giao. Các tham chiếu lịch sử không nhúng được hiển thị như văn bản; prototype và API vẫn theo phạm vi mô phỏng.</p>'+rendered+'</main>';
  }else{
    html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,(_,ref)=>{styles+=css(path.resolve(path.dirname(file),ref))+'\n';return '';});
    html=html.replace(/<style[^>]*>([\s\S]*?)<\/style>/g,(_,text)=>{styles+=text+'\n';return '';});
    const entry=html.match(/<script type="module" src="([^"]+)"><\/script>/);
    if(entry){
      const built=await build({entryPoints:[path.resolve(root,entry[1])],bundle:true,format:'iife',platform:'browser',target:['es2022'],write:false,metafile:true,legalComments:'inline',charset:'utf8',plugins:[{
        name:'offline-assets-and-navigation',setup(b){b.onLoad({filter:/\.js$/},({path:file})=>{
          let contents=read(file).replaceAll('assets/hiuh-logo.png',asset(path.join(root,'assets/hiuh-logo.png')))
            .replaceAll('hiuh-ai-chat-review-v09','hiuh-ai-chat-offline-v09').replaceAll('cskh.views.v090.','cskh.views.offline.v090.')
            .replace(/location\.href=(`index\.html[^`]+`);/g,'window.__handoffNavigate($1);');
          return {contents,loader:'js'};
        });}
      }]});
      script=built.outputFiles[0].text;
      html=html.replace(entry[0],'');
    }
    className=html.match(/<body[^>]*class="([^"]+)"/)?.[1]||'';
    body=html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1]||html.replace(/<!doctype[^>]*>|<\/?html[^>]*>|<\/?head[^>]*>|<meta[^>]*>|<title>[\s\S]*?<\/title>|<link[^>]*>/gi,'');
    body=body.replace(/src="(assets\/[^"]+)"/g,(_,ref)=>'src="'+asset(path.join(root,ref))+'"');
    body=links(body,file);
    if(key==='review')body=body.replace('<main>','<main><p class="review-note"><strong>Bàn giao một file · v0.9</strong>Mở trực tiếp bằng Chrome/Edge. Đã nhúng font, ảnh, CSS, mã chạy và BRD. Mở hai góc nhìn khách/CSKH để thử cùng phiên; Portal và kho AI chat là hai bộ dữ liệu mẫu riêng. Nút “Bộ bàn giao” ở góc dưới giúp quay lại đây. Các liên kết website/chính sách bên ngoài cần Internet; prototype không cần mạng.</p>');
  }
  if(/@import\b/.test(styles.replace(/\/\*[\s\S]*?\*\//g,'')))throw Error('Unresolved CSS import: '+ref);
  pages[key]={title:html.match(/<title>([^<]*)<\/title>/)?.[1]||key,body,styles,script,className};
}
const notices=['LUCIDE-LICENSE','assets/fonts/lexend-OFL.txt','assets/fonts/plusjakartasans-OFL.txt'].map(file=>file+'\n'+read(path.join(root,file))).join('\n\n');
const payload=JSON.stringify({version:'0.9.0',pages,assets,routes,brdMarkdown:read(path.join(root,brdRel))}).replaceAll('<','\\u003c');
const html=`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CSKH v0.9 · Bộ bàn giao prototype</title><link rel="icon" href="data:,"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; base-uri 'none'; object-src 'none'"></head><body><p>Đang mở bộ bàn giao CSKH v0.9…</p><noscript>Vui lòng bật JavaScript để dùng prototype.</noscript><script id="handoff-data" type="application/json">${payload}</script><script>(${bootSingleHtml.toString()})();</script><!-- Third-party notices\n${notices.replaceAll('--','—')}\nAssets: HIUH logo and Montserrat supplied with the prototype; see source provenance.\n--></body></html>`;
const handoffDir = fs.existsSync(path.resolve(root,'../handoff')) ? path.resolve(root,'../handoff') : path.resolve(root,'handoff');
if (!fs.existsSync(handoffDir)) fs.mkdirSync(handoffDir, {recursive: true});
const output=path.resolve(handoffDir,'CSKH-Operation-Portal-v0.9.0.html');
fs.writeFileSync(output,html);
const result={output,bytes:Buffer.byteLength(html),sha256:digest(html),pages:Object.keys(pages),assetsEmbedded:assets.length,sourceHashes:Object.fromEntries(inputs),builtAt:new Date().toISOString()};
fs.writeFileSync(path.join(root,'evidence/handoff-single-v09/build.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({output,bytes:result.bytes,sha256:result.sha256,pages:result.pages,assetsEmbedded:assets.length},null,2));
