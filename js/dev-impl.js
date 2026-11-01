// dev-impl.js — 开发者类工具的实现函数(1/2:二维码/编解码/颜色)
function generateQR(){
  const text=document.getElementById('qrInput')?.value||'';
  if(!text){showError(I18N[currentLang].err_qr_input);return;}
  if(typeof qrcode==='undefined'){showError(I18N[currentLang].err_qr_lib);return;}
  const size=parseInt(document.getElementById('qrSize')?.value||250);
  let qr;
  try{
    qr=qrcode(0,'M');
    qr.addData(text);
    qr.make();
  }catch(e){showError(I18N[currentLang].err_process_failed+e.message);return;}
  const count=qr.getModuleCount();
  const moduleSize=Math.max(2,Math.floor(size/(count+8))); // 4-module quiet zone
  const dim=moduleSize*count;
  const off=Math.floor((size-dim)/2);
  const canvas=document.getElementById('qrc');
  canvas.width=size;canvas.height=size;
  canvas.style.display='block';
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#ffffff';
  ctx.fillRect(0,0,size,size);
  ctx.fillStyle='#000000';
  for(let row=0;row<count;row++){
    for(let col=0;col<count;col++){
      if(qr.isDark(row,col))ctx.fillRect(off+col*moduleSize,off+row*moduleSize,moduleSize,moduleSize);
    }
  }
  showResult(I18N[currentLang].succ_qr,canvas.toDataURL('image/png'),'qrcode.png',I18N[currentLang].info);
}

function base64Enc(){const v=document.getElementById('b64Input')?.value||'';if(!v){showError(I18N[currentLang].err_b64_input);return;}const enc=btoa(unescape(encodeURIComponent(v)));showTextOutput(enc);}
function base64Dec(){const v=document.getElementById('b64Input')?.value||'';if(!v){showError(I18N[currentLang].err_b64_input);return;}try{const dec=decodeURIComponent(escape(atob(v)));showTextOutput(dec);}catch(e){showError(I18N[currentLang].err_b64_decode);}}
function urlEnc(){const v=document.getElementById('urlInput')?.value||'';if(!v){showError(I18N[currentLang].err_url_input);return;}showTextOutput(encodeURIComponent(v));}
function urlDec(){const v=document.getElementById('urlInput')?.value||'';if(!v){showError(I18N[currentLang].err_url_input);return;}try{showTextOutput(decodeURIComponent(v));}catch(e){showError(I18N[currentLang].err_url_decode);}}

function convertColor(){
  const input=document.getElementById('colorIn').value.trim();
  if(!input)return;
  let hex,rgb,hsl;
  if(input.startsWith('#')){
    hex=input;rgb=hexToRgb(hex);hsl=rgbToHsl(rgb.r,rgb.g,rgb.b);
  }else if(input.startsWith('rgb')){
    const m=input.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if(!m){showError(I18N[currentLang].err_rgb_format);return;}
    rgb={r:parseInt(m[1]),g:parseInt(m[2]),b:parseInt(m[3])};
    hex=rgbToHex(rgb.r,rgb.g,rgb.b);
    hsl=rgbToHsl(rgb.r,rgb.g,rgb.b);
  }else if(input.startsWith('hsl')){
    const m=input.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
    if(!m){showError(I18N[currentLang].err_hsl_format);return;}
    hsl={h:parseInt(m[1]),s:parseInt(m[2]),l:parseInt(m[3])};
    rgb=hslToRgb(hsl.h,hsl.s,hsl.l);
    hex=rgbToHex(rgb.r,rgb.g,rgb.b);
  }else{
    showError(I18N[currentLang].err_input_color);
    return;
  }
  document.getElementById('colorPreview').style.background=hex;
  const out=document.getElementById('colorOutput');
  out.textContent='HEX: '+hex+'\nRGB: rgb('+rgb.r+', '+rgb.g+', '+rgb.b+')\nHSL: hsl('+hsl.h+', '+hsl.s+'%, '+hsl.l+'%)';
  document.getElementById('colorResult').style.display='block';
  hideError();
}
function hexToRgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return{r,g,b};}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}}return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};}
function hslToRgb(h,s,l){h/=360;s/=100;l/=100;let r,g,b;if(s===0){r=g=b=l;}else{const q=l<0.5?l*(1+s):l+s-l*s;const p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}return{r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)};}
function hue2rgb(p,q,t){if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;}

// dev-impl.js — 开发者类工具的实现函数(2/2:JSON/哈希/时间/密码/UUID/比对/统计/命名/进制/参数/清理)
function jsonInputVal(){return document.getElementById('jsonInput')?.value||'';}
function jsonOut(v){const el=document.getElementById('jsonOut');if(el)el.value=v;}
const JSON_ESC_MAP={'"':'"','\\':'\\','n':'\n','t':'\t','r':'\r','/':'/','b':'\b','f':'\f',"'":"'"};
function jsonUnescapeStr(v){return v.replace(/\\(.)/g,(m,c)=>JSON_ESC_MAP[c]!==undefined?JSON_ESC_MAP[c]:m);}
function jsonParse(v){try{return JSON.parse(v);}catch(e){return JSON.parse(jsonUnescapeStr(v));}}
function jsonPretty(){const v=jsonInputVal();if(!v){showError(I18N[currentLang].err_json_input);return;}
  const raw=document.getElementById('jsonIndent')?.value||'2';
  const indent=raw==='\t'?'\t':parseInt(raw,10);
  try{jsonOut(JSON.stringify(jsonParse(v),null,indent));hideError();}catch(e){showError(I18N[currentLang].err_json_invalid+jsonErrPos(v,e));}}
function jsonMinify(){const v=jsonInputVal();if(!v){showError(I18N[currentLang].err_json_input);return;}try{jsonOut(JSON.stringify(jsonParse(v)));hideError();}catch(e){showError(I18N[currentLang].err_json_invalid+jsonErrPos(v,e));}}
function jsonValidate(){
  const v=jsonInputVal();
  if(!v){showError(I18N[currentLang].err_json_input);return;}
  try{JSON.parse(v);jsonOut('✓ JSON '+(I18N[currentLang].json_valid_ok));hideError();}
  catch(e){showError(I18N[currentLang].err_json_invalid+jsonErrPos(v,e));}
}
function jsonEscape(){
  const inp=document.getElementById('jsonInput');
  const v=inp?.value||'';
  if(!v){showError(I18N[currentLang].err_json_input);return;}
  inp.value=v.replace(/(["\\])/g,'\\$1').replace(/\n/g,'\\n');
  hideError();
}
function jsonUnescape(){
  const inp=document.getElementById('jsonInput');
  const v=inp?.value||'';
  if(!v){showError(I18N[currentLang].err_json_input);return;}
  inp.value=jsonUnescapeStr(v);hideError();
}
function jsonErrPos(v,e){
  const m=(e.message||'').match(/position (\d+)/);
  if(!m)return e.message;
  const pos=parseInt(m[1]);
  const before=v.slice(0,pos).split('\n');
  return ' ['+(I18N[currentLang].json_err_line)+(before.length)+':'+(before[before.length-1].length+1)+'] '+e.message;
}
function jsonClear(){
  const i=document.getElementById('jsonInput'),o=document.getElementById('jsonOut');
  if(i)i.value='';if(o)o.value='';
  hideError();
}
async function jsonCopy(){
  const el=document.getElementById('jsonOut');
  const v=el?.value||'';
  if(!v){showError(I18N[currentLang].err_json_output_empty);return;}
  try{
    await navigator.clipboard.writeText(v);
    const btn=event.target;const old=btn.textContent;btn.textContent='✓';
    setTimeout(()=>{btn.textContent=I18N[currentLang].json_copy;},1200);
  }catch(e){el.select();}
}

async function calcHash(){
  const v=document.getElementById('hashInput')?.value||'';
  if(!v){showError(I18N[currentLang].err_hash_input);return;}
  const algo=document.getElementById('hashAlgo')?.value||'SHA-256';
  try{
    const buf=await crypto.subtle.digest(algo,new TextEncoder().encode(v));
    const hex=[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
    showTextOutput(algo+': '+hex);hideError();
  }catch(e){showError(I18N[currentLang].err_process_failed+e.message);}
}

function tsConvert(){
  const raw=(document.getElementById('tsInput')?.value||'').trim();
  if(!raw){showError(I18N[currentLang].err_ts_input);return;}
  const pad=n=>String(n).padStart(2,'0');
  const fmt=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
  let d;
  if(/^\d{10}$/.test(raw))d=new Date(parseInt(raw)*1000);
  else if(/^\d{13}$/.test(raw))d=new Date(parseInt(raw));
  else d=new Date(raw.replace('T',' ').replace(/-/g,'/'));
  if(isNaN(d.getTime())){showError(I18N[currentLang].err_ts_invalid);return;}
  showTextOutput(fmt(d)+'\n'+I18N[currentLang].ts_seconds+': '+Math.floor(d.getTime()/1000)+'\n'+I18N[currentLang].ts_millis+': '+d.getTime()+'\n'+I18N[currentLang].ts_iso+': '+d.toISOString());hideError();
}
function tsNow(){const now=Date.now();document.getElementById('tsInput').value=String(Math.floor(now/1000));showTextOutput(I18N[currentLang].ts_seconds+': '+Math.floor(now/1000)+'\n'+I18N[currentLang].ts_millis+': '+now);}

function genPassword(){
  const len=parseInt(document.getElementById('pwdLen')?.value||16);
  let chars='';
  if(document.getElementById('pwdUpper')?.checked)chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(document.getElementById('pwdLower')?.checked)chars+='abcdefghijklmnopqrstuvwxyz';
  if(document.getElementById('pwdDigit')?.checked)chars+='0123456789';
  if(document.getElementById('pwdSymbol')?.checked)chars+='!@#$%^&*';
  if(!chars||len<4||len>128){showError(I18N[currentLang].err_pwd_opts);return;}
  const arr=new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pwd='';
  for(let i=0;i<len;i++)pwd+=chars[arr[i]%chars.length];
  showTextOutput(pwd);hideError();
}

function genUuids(){
  const n=parseInt(document.getElementById('uuidCount')?.value||5);
  if(n<1||n>100){showError(I18N[currentLang].err_uuid_count);return;}
  const upper=document.getElementById('uuidUpper')?.checked;
  const out=[];
  for(let i=0;i<n;i++){
    let u=(crypto.randomUUID?crypto.randomUUID():uuidFallback());
    if(upper)u=u.toUpperCase();
    out.push(u);
  }
  showTextOutput(out.join('\n'));hideError();
}
function uuidFallback(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{
    const r=crypto.getRandomValues(new Uint8Array(1))[0]%16;
    const v=c==='x'?r:(r&0x3|0x8);
    return v.toString(16);
  });
}

// Text diff (line-based LCS) — 输出用 DOM 节点构建,文本经 textContent 写入
function diffTexts(){
  const a=(document.getElementById('diffA')?.value||'').split('\n');
  const b=(document.getElementById('diffB')?.value||'').split('\n');
  const n=a.length,m=b.length;
  if(n*m>250000){showError(I18N[currentLang].err_diff_big);return;}
  const dp=Array.from({length:n+1},()=>new Uint16Array(m+1));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)
    dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
  let i=0,j=0,added=0,removed=0,same=0;
  const out=[];
  while(i<n&&j<m){
    if(a[i]===b[j]){out.push({t:'=',s:a[i]});i++;j++;same++;}
    else if(dp[i+1][j]>=dp[i][j+1]){out.push({t:'-',s:a[i]});i++;removed++;}
    else{out.push({t:'+',s:b[j]});j++;added++;}
  }
  while(i<n){out.push({t:'-',s:a[i]});i++;removed++;}
  while(j<m){out.push({t:'+',s:b[j]});j++;added++;}
  const box=document.getElementById('to');
  box.classList.add('act');
  box.textContent='';
  const summary=document.createElement('div');
  summary.textContent=I18N[currentLang].diff_summary_added+added+I18N[currentLang].diff_summary_removed+removed+I18N[currentLang].diff_summary_same+same;
  box.appendChild(summary);
  box.appendChild(document.createTextNode('\n'));
  const colors={'=':'var(--tl)','+':'#166534','-':'#991b1b'};
  const marks={'=':'  ','+':'+ ','-':'- '};
  out.forEach((l,idx)=>{
    const span=document.createElement('span');
    span.style.color=colors[l.t];
    span.textContent=(idx?'\n':'')+marks[l.t]+l.s;
    box.appendChild(span);
  });
  hideError();
}

function wcUpdate(){
  const v=document.getElementById('wcInput')?.value||'';
  const chars=v.length;
  const noSpace=v.replace(/\s/g,'').length;
  const cjk=(v.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)||[]).length;
  const words=(v.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g,' ').match(/[A-Za-z0-9_'-]+/g)||[]).length;
  const lines=v?v.split('\n').length:0;
  const box=document.getElementById('wcResult');
  if(box)box.textContent=I18N[currentLang].wc_chars+': '+chars+' · '+
    I18N[currentLang].wc_nospace+': '+noSpace+' · '+
    I18N[currentLang].wc_cjk+': '+cjk+' · '+
    I18N[currentLang].wc_words+': '+words+' · '+
    I18N[currentLang].wc_lines+': '+lines;
}

function caseTo(style){
  const raw=(document.getElementById('caseInput')?.value||'').trim();
  if(!raw){showError(I18N[currentLang].err_case_input);return;}
  const words=raw.replace(/([a-z0-9])([A-Z])/g,'$1 $2')
    .split(/[\s_-]+/).filter(Boolean)
    .map(w=>w.toLowerCase());
  if(!words.length){showError(I18N[currentLang].err_case_input);return;}
  const cap=w=>w.charAt(0).toUpperCase()+w.slice(1);
  let result;
  switch(style){
    case 'camel':result=words.map((w,idx)=>idx?cap(w):w).join('');break;
    case 'pascal':result=words.map(cap).join('');break;
    case 'snake':result=words.join('_');break;
    case 'kebab':result=words.join('-');break;
    case 'const':result=words.join('_').toUpperCase();break;
    case 'title':result=words.map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');break;
  }
  showTextOutput(result);hideError();
}

function baseConvert(){
  const raw=(document.getElementById('baseInput')?.value||'').trim();
  if(!raw){showError(I18N[currentLang].err_base_input);return;}
  const from=parseInt(document.getElementById('baseFrom')?.value||10,10);
  const n=parseInt(raw,from);
  if(isNaN(n)||n<0||n>Number.MAX_SAFE_INTEGER){showError(I18N[currentLang].err_base_invalid);return;}
  showTextOutput(
    I18N[currentLang].base_bin+': '+n.toString(2)+'\n'+
    I18N[currentLang].base_oct+': '+n.toString(8)+'\n'+
    I18N[currentLang].base_dec+': '+n.toString(10)+'\n'+
    I18N[currentLang].base_hex+': '+n.toString(16).toUpperCase());
  hideError();
}

function parseUrlParams(){
  const raw=(document.getElementById('upInput')?.value||'').trim();
  if(!raw){showError(I18N[currentLang].err_up_input);return;}
  const qs=raw.includes('?')?raw.slice(raw.indexOf('?')+1):raw;
  const params=[...new URLSearchParams(qs)];
  if(!params.length){showError(I18N[currentLang].err_up_none);return;}
  const obj={};
  params.forEach(([k,v])=>{
    if(obj[k]===undefined)obj[k]=v;
    else if(Array.isArray(obj[k]))obj[k].push(v);
    else obj[k]=[obj[k],v];
  });
  showTextOutput(params.map(([k,v])=>k+' = '+v).join('\n')+'\n\nJSON:\n'+JSON.stringify(obj,null,2));
  hideError();
}

function textCleanRun(mode){
  const ta=document.getElementById('tcInput');
  const v=ta?.value||'';
  if(!v){showError(I18N[currentLang].err_tc_input);return;}
  let lines=v.split('\n');
  if(document.getElementById('tcTrim')?.checked)lines=lines.map(l=>l.trim());
  if(document.getElementById('tcNoEmpty')?.checked)lines=lines.filter(l=>l!=='');
  if(document.getElementById('tcDedupe')?.checked)lines=[...new Set(lines)];
  if(mode==='asc')lines.sort((a,b)=>a.localeCompare(b,'zh'));
  else if(mode==='desc')lines.sort((a,b)=>b.localeCompare(a,'zh'));
  else if(mode==='shuffle'){
    for(let i=lines.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [lines[i],lines[j]]=[lines[j],lines[i]];
    }
  }
  ta.value=lines.join('\n');
  showTextOutput(lines.join('\n'));
  hideError();
}
