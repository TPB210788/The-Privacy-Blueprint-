const fs=require('fs');const {chromium}=require('playwright');(async()=>{
const A='/home/user/The-Privacy-Blueprint-/netlify-site/assets/';
const f=n=>'data:font/woff2;base64,'+fs.readFileSync(A+'fonts/'+n).toString('base64');
const logo=fs.readFileSync(A+'logo-full-light.svg','utf8').replace('<svg ','<svg style="width:210px;height:auto;display:block" ');
// Blueprint drawing: keyhole in a framed plate, with dimension lines and labelled callouts
const sage='#9DBFB9', brass='#B68A4C';
const draw=(W,H,cx,cy,s)=>`
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">
 <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${sage}"/></marker></defs>
 <g fill="none" stroke="${sage}" stroke-width="1.4">
  <rect x="${cx-150*s}" y="${cy-170*s}" width="${300*s}" height="${340*s}" stroke-opacity=".9"/>
  <rect x="${cx-130*s}" y="${cy-150*s}" width="${260*s}" height="${300*s}" stroke-dasharray="6 6" stroke-opacity=".55"/>
  <circle cx="${cx}" cy="${cy-35*s}" r="${48*s}" stroke-width="2"/>
  <path d="M${cx-24*s} ${cy+5*s} L${cx-40*s} ${cy+110*s} L${cx+40*s} ${cy+110*s} L${cx+24*s} ${cy+5*s}" stroke-width="2"/>
  <circle cx="${cx}" cy="${cy-35*s}" r="${3}" fill="${sage}"/>
  <path d="M${cx} ${cy-200*s}V${cy+200*s}M${cx-180*s} ${cy-35*s}H${cx+180*s}" stroke-dasharray="14 5 3 5" stroke-opacity=".45" stroke-width="1"/>
  <!-- dimension lines -->
  <path d="M${cx-150*s} ${cy+200*s}H${cx+150*s}" marker-start="url(#ar)" marker-end="url(#ar)"/>
  <path d="M${cx-150*s} ${cy+175*s}V${cy+210*s}M${cx+150*s} ${cy+175*s}V${cy+210*s}" stroke-opacity=".6"/>
  <path d="M${cx+185*s} ${cy-170*s}V${cy+170*s}" marker-start="url(#ar)" marker-end="url(#ar)"/>
  <path d="M${cx+155*s} ${cy-170*s}H${cx+195*s}M${cx+155*s} ${cy+170*s}H${cx+195*s}" stroke-opacity=".6"/>
 </g>
 <g font-family="R" font-size="${12.5*s}" letter-spacing="2.4" fill="${sage}">
  <text x="${cx}" y="${cy+228*s}" text-anchor="middle">UK GDPR · DUAA 2025</text>
  <text x="${cx+205*s}" y="${cy}" transform="rotate(90 ${cx+205*s} ${cy})" text-anchor="middle">16 AREAS</text>
 </g>
 ${[
   ['LAWFUL BASIS', cx-48*s, cy-60*s, cx-250*s, cy-130*s,'end'],
   ['RETENTION', cx-150*s, cy+40*s, cx-250*s, cy+40*s,'end'],
   ['DPAs', cx-36*s, cy+90*s, cx-250*s, cy+150*s,'end'],
   ['72 HRS', cx+150*s, cy-120*s, cx+300*s, cy-150*s,'start'],
   ['DSARs', cx+40*s, cy+100*s, cx+300*s, cy+120*s,'start'],
 ].map(([t,x1,y1,x2,y2,a])=>`<g><circle cx="${x1}" cy="${y1}" r="4" fill="${brass}"/><path d="M${x1} ${y1}L${x2+(a==='end'?14:-14)} ${y2}H${x2+(a==='end'?4:-4)}" stroke="${brass}" stroke-width="1.2" fill="none"/>
   <text x="${x2}" y="${y2+5}" text-anchor="${a}" font-family="R" font-size="${14*s}" letter-spacing="2.6" fill="#E9E2D3">${t}</text></g>`).join('')}
</svg>`;
const page=(W,H,cx,cy,s,titleSize,pad,showLogo)=>`<html><head><style>
@font-face{font-family:P;font-weight:500;src:url(${f('playfair-display-latin-500-normal.woff2')})}
@font-face{font-family:P;font-style:italic;font-weight:500;src:url(${f('playfair-display-latin-500-italic.woff2')})}
@font-face{font-family:R;font-weight:500;src:url(${f('raleway-latin-500-normal.woff2')})}
@font-face{font-family:R;font-weight:600;src:url(${f('raleway-latin-600-normal.woff2')})}
body{margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;background-color:#1C2B4A;
background-image:linear-gradient(rgba(157,191,185,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(157,191,185,.09) 1px,transparent 1px),linear-gradient(rgba(157,191,185,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(157,191,185,.04) 1px,transparent 1px);
background-size:100px 100px,100px 100px,20px 20px,20px 20px}
.t{position:absolute;left:${pad}px;top:50%;transform:translateY(-50%);max-width:${W*0.5}px}
.k{font-family:R;font-weight:600;font-size:${titleSize*0.2}px;letter-spacing:.26em;color:#C5DAD5;display:flex;align-items:center;gap:16px;margin-bottom:${titleSize*0.35}px}
.k:before{content:'';width:48px;height:2px;background:#B68A4C}
h1{font-family:P;font-weight:500;color:#fff;font-size:${titleSize}px;line-height:1.1;margin:0 0 ${titleSize*0.3}px}
h1 em{color:#9DBFB9}
p{font-family:R;font-weight:500;color:#C9D3E0;font-size:${titleSize*0.27}px;line-height:1.5;margin:0}
.tb{position:absolute;left:${pad}px;bottom:${pad*0.42}px;border:1px solid rgba(157,191,185,.5);display:flex;font-family:R;font-weight:600;font-size:11px;letter-spacing:.2em;color:#C5DAD5}
.tb span{padding:7px 12px;border-left:1px solid rgba(157,191,185,.5)}.tb span:first-child{border-left:0}
.lg{position:absolute;left:${pad}px;bottom:${pad*0.4}px}
.bar{position:absolute;left:0;bottom:0;width:100%;height:8px;background:#9DBFB9}
</style></head><body>${draw(W,H,cx,cy,s)}
<div class="t"><div class="k">THE PRIVACY BLUEPRINT</div>
<h1>Data protection,<br><em>drawn up properly.</em></h1>
<p>Practical UK GDPR guides for founders and growing businesses. Every two weeks.</p></div>
${showLogo?`<div class="lg">${logo}</div>`:''}
<div class="tb"><span>SHEET 01</span><span>REV 2026</span><span>THEPRIVACYBLUEPRINT.CO.UK</span></div>
<div class="bar"></div></body></html>`;
const b=await chromium.launch();
for(const [W,H,cx,cy,s,ts,pad,lg,out] of [[1500,500,1080,235,0.95,60,90,false,'substack-header-1500x500.png'],[1100,400,800,190,0.78,46,64,false,'substack-header-1100x400.png']]){
 const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:2});await p.setContent(page(W,H,cx,cy,s,ts,pad,lg));await p.waitForTimeout(600);
 await p.screenshot({path:'/home/user/The-Privacy-Blueprint-/brand/'+out});}
await b.close();})();
