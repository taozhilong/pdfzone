// more-tools.js — 更多工具(6 个):正则测试/JWT/CSV↔JSON/HTML实体/文本替换/图片转Base64
function moreOptions(){
  switch(ct){
    case 'regexTest':
      return `<h4 data-i18n="regex_pattern_label">正则表达式（不含两侧斜杠）</h4>
        <div class="or"><input type="text" id="rePattern" class="wid" placeholder="(\\\\d{4})-(\\\\d{2})-(\\\\d{2})" style="flex:1;font-family:monospace">
        <label><input type="checkbox" id="reG" checked> g</label><label><input type="checkbox" id="reI"> i</label><label><input type="checkbox" id="reM"> m</label></div>
        <div class="ol" style="margin-top:8px" data-i18n="regex_text_label">测试文本</div>
        <textarea id="reText" rows="5" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace;width:100%;box-sizing:border-box"></textarea>
        <button class="btn btn-p" onclick="runRegex()" style="margin-top:8px" data-i18n="regex_run">测试</button>`;
    case 'jwtDecode':
      return `<h4 data-i18n="jwt_input_label">粘贴 JWT</h4>
        <textarea id="jwtInput" class="wid" rows="4" placeholder="eyJhbGciOi..." style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace"></textarea>
        <button class="btn btn-p" onclick="decodeJWT()" style="margin-top:8px" data-i18n="jwt_decode">解码</button>`;
    case 'csvJson':
      return `<h4 data-i18n="csv_input_label">输入（CSV → JSON 用 CSV 文本；JSON → CSV 用 JSON 数组）</h4>
        <textarea id="csvInput" class="wid" rows="6" placeholder="a,b,c&#10;1,2,3" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace"></textarea>
        <div class="or" style="margin-top:8px"><label><input type="checkbox" id="csvHeader" checked> <span data-i18n="csv_header">首行为表头</span></label></div>
        <div class="btng">
          <button class="btn btn-p" onclick="csvToJson()" style="width:auto;flex:1" data-i18n="csv_to_json">CSV → JSON</button>
          <button class="btn btn-s" onclick="jsonToCsv()" style="width:auto;flex:1" data-i18n="json_to_csv">JSON → CSV</button>
        </div>`;
    case 'htmlEntity':
      return `<h4 data-i18n="he_input_label">输入文本</h4>
        <textarea id="heInput" class="wid" rows="4" placeholder="" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-p" onclick="htmlEncode()" style="width:auto;flex:1" data-i18n="he_encode">编码 →</button>
          <button class="btn btn-s" onclick="htmlDecode()" style="width:auto;flex:1" data-i18n="he_decode">← 解码</button>
        </div>`;
    case 'textReplace':
      return `<h4 data-i18n="tr_find_label">查找</h4>
        <input type="text" id="trFind" class="wid" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;font-family:monospace">
        <div class="ol" style="margin-top:6px" data-i18n="tr_replace_label">替换为</div>
        <input type="text" id="trReplace" class="wid" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;font-family:monospace">
        <div class="or" style="margin-top:6px"><label><input type="checkbox" id="trRegex"> <span data-i18n="tr_regex">按正则查找</span></label></div>
        <div class="ol" style="margin-top:6px" data-i18n="tr_input_label">文本（原地替换，结果显示在下方）</div>
        <textarea id="trInput" class="wid" rows="6" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace"></textarea>
        <button class="btn btn-p" onclick="textReplace()" style="margin-top:8px" data-i18n="tr_apply">全部替换</button>`;
  }
  return '';
}

defTool('regexTest',{title:{zh:'正则测试',en:'Regex Tester'},desc:{zh:'正则表达式匹配测试',en:'Test regular expression matches'},hint:{zh:'',en:''},accept:'',multi:false,icon:'𝄐',needsFiles:false},moreOptions);
defTool('jwtDecode',{title:{zh:'JWT 解码',en:'JWT Decoder'},desc:{zh:'解析 JWT 的头部与载荷',en:'Decode JWT header and payload'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🎟️',needsFiles:false},moreOptions);
defTool('csvJson',{title:{zh:'CSV ↔ JSON',en:'CSV ↔ JSON'},desc:{zh:'CSV 与 JSON 互转',en:'Convert between CSV and JSON'},hint:{zh:'',en:''},accept:'',multi:false,icon:'📊',needsFiles:false},moreOptions);
defTool('htmlEntity',{title:{zh:'HTML 实体编解码',en:'HTML Entities'},desc:{zh:'HTML 特殊字符转义/还原',en:'Encode/decode HTML entities'},hint:{zh:'',en:''},accept:'',multi:false,icon:'&',needsFiles:false},moreOptions);
defTool('textReplace',{title:{zh:'文本替换',en:'Text Replace'},desc:{zh:'批量查找替换（支持正则）',en:'Batch find and replace (regex supported)'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔁',needsFiles:false},moreOptions);
defTool('imgBase64',{title:{zh:'图片转 Base64',en:'Image to Base64'},desc:{zh:'图片转 dataURL 字符串',en:'Convert image to dataURL string'},hint:{zh:'选择1张图片',en:'Select 1 image'},accept:'image/*',multi:false,icon:'🖼️',needsFiles:true},null,imgToBase64);

// 正则测试(动态构造正则属于该工具的本意)
function runRegex(){
  const pat=document.getElementById('rePattern')?.value||'';
  const text=document.getElementById('reText')?.value||'';
  if(!pat){showError(I18N[currentLang].err_regex_empty);return;}
  let flags='';
  if(document.getElementById('reG')?.checked)flags+='g';
  if(document.getElementById('reI')?.checked)flags+='i';
  if(document.getElementById('reM')?.checked)flags+='m';
  if(!flags.includes('g'))flags+='g';
  let re;
  try{re=RegExp(pat,flags);}
  catch(e){showError(I18N[currentLang].err_regex_pattern+e.message);return;}
  const lines=[];
  let count=0;
  for(const m of text.matchAll(re)){
    count++;
    if(count>500)break;
    const groups=m.length>1?'    ['+m.slice(1).map(g=>g===undefined?'':g).join(', ')+']':'';
    lines.push('#'+count+' @'+m.index+': '+m[0]+groups);
  }
  showTextOutput(I18N[currentLang].regex_result+': '+count+'\n\n'+(lines.join('\n')||I18N[currentLang].regex_none));
  hideError();
}

// JWT 解码(仅解码展示,不校验签名)
function jwtB64UrlDecode(s){
  const b64=s.replace(/-/g,'+').replace(/_/g,'/');
  const padded=b64+'='.repeat((4-b64.length%4)%4);
  const bytes=Uint8Array.from(atob(padded),c=>c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function decodeJWT(){
  const token=(document.getElementById('jwtInput')?.value||'').trim();
  if(!token){showError(I18N[currentLang].err_jwt_input);return;}
  const parts=token.split('.');
  if(parts.length<2){showError(I18N[currentLang].err_jwt_format);return;}
  try{
    const header=JSON.stringify(JSON.parse(jwtB64UrlDecode(parts[0])),null,2);
    const payload=JSON.stringify(JSON.parse(jwtB64UrlDecode(parts[1])),null,2);
    let out='HEADER:\n'+header+'\n\nPAYLOAD:\n'+payload;
    if(parts[2])out+='\n\nSIGNATURE: '+parts[2]+'\n('+I18N[currentLang].jwt_noverify+')';
    showTextOutput(out);hideError();
  }catch(e){showError(I18N[currentLang].err_jwt_format);}
}

// CSV ↔ JSON
function splitCsvLine(line,delim){
  const cells=[];let cur='',inQ=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){if(inQ&&line[i+1]==='"'){cur+='"';i++;}else inQ=!inQ;}
    else if(ch===delim&&!inQ){cells.push(cur);cur='';}
    else cur+=ch;
  }
  cells.push(cur);
  return cells;
}
function csvToJson(){
  const raw=document.getElementById('csvInput')?.value||'';
  if(!raw.trim()){showError(I18N[currentLang].err_csv_input);return;}
  const hasHeader=document.getElementById('csvHeader')?.checked;
  const lines=raw.trim().split(/\r?\n/);
  const rows=lines.map(l=>splitCsvLine(l,','));
  let out;
  if(hasHeader&&rows.length>1){
    const head=rows[0];
    out=rows.slice(1).map(r=>{
      const o={};head.forEach((h,i)=>o[h]=r[i]!==undefined?r[i]:'');return o;});
  }else{
    out=rows.map(r=>r.map(c=>{
      const n=Number(c);
      return (c!==''&&!isNaN(n)&&/^[\d.-]+$/.test(c.trim()))?n:c;}));
  }
  showTextOutput(JSON.stringify(out,null,2));hideError();
}
function jsonToCsv(){
  const raw=document.getElementById('csvInput')?.value||'';
  if(!raw.trim()){showError(I18N[currentLang].err_csv_input);return;}
  let data;
  try{data=JSON.parse(raw);}catch(e){showError(I18N[currentLang].err_json_invalid+e.message);return;}
  if(!Array.isArray(data)||(data.length&&('object'!==typeof data[0]||Array.isArray(data[0])))){
    showError(I18N[currentLang].err_csv_array);return;}
  if(!data.length){showTextOutput('');return;}
  const keys=[...new Set(data.flatMap(o=>Object.keys(o)))];
  const escCell=v=>{
    const s=v===null||v===undefined?'':String(v);
    return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
  };
  const csv=[keys.map(escCell).join(',')].concat(data.map(o=>keys.map(k=>escCell(o[k])).join(','))).join('\n');
  showTextOutput(csv);hideError();
}

// HTML 实体编解码
const HE_MAP={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const HE_RMAP={'amp':'&','lt':'<','gt':'>','quot':'"','apos':"'",'nbsp':' '};
function htmlEncode(){
  const inp=document.getElementById('heInput');
  const v=inp?.value||'';
  if(!v){showError(I18N[currentLang].err_he_input);return;}
  inp.value=v.replace(/[&<>"']/g,c=>HE_MAP[c]);
  showTextOutput(inp.value);hideError();
}
function htmlDecode(){
  const inp=document.getElementById('heInput');
  const v=inp?.value||'';
  if(!v){showError(I18N[currentLang].err_he_input);return;}
  const r=v.replace(/&#x([0-9a-fA-F]+);/g,(m,h)=>String.fromCodePoint(parseInt(h,16)))
        .replace(/&#(\d+);/g,(m,d)=>String.fromCodePoint(parseInt(d,10)))
        .replace(/&([a-zA-Z]+);/g,(m,n)=>HE_RMAP[n.toLowerCase()]!==undefined?HE_RMAP[n.toLowerCase()]:m);
  inp.value=r;
  showTextOutput(r);hideError();
}

// 文本替换
function textReplace(){
  const find=document.getElementById('trFind')?.value||'';
  if(!find){showError(I18N[currentLang].err_tr_find);return;}
  const rep=document.getElementById('trReplace')?.value||'';
  const src=document.getElementById('trInput')?.value||'';
  let result,count=0;
  if(document.getElementById('trRegex')?.checked){
    let re;
    try{re=RegExp(find,'g');}catch(e){showError(I18N[currentLang].err_regex_pattern+e.message);return;}
    result=src.replace(re,()=>{count++;return rep;});
  }else{
    count=src.split(find).length-1;
    result=src.split(find).join(rep);
  }
  document.getElementById('trInput').value=result;
  showTextOutput(I18N[currentLang].tr_replaced+count+I18N[currentLang].tr_occurrences+'\n\n'+result);
  hideError();
}

// 图片转 Base64
async function imgToBase64(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_resize_one);
  setProgress(50);
  const dataUrl=await new Promise((resolve,reject)=>{
    const fr=new FileReader();
    fr.onload=()=>resolve(fr.result);
    fr.onerror=reject;
    fr.readAsDataURL(files[0]);
  });
  setProgress(95);
  showTextOutput(dataUrl);
}
