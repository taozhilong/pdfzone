// core.js — 工具站框架:注册表、视图切换、选项面板分发、文件处理、结果输出
// 各工具通过 defTool() 注册到本文件维护的 T / OPTIONS / RUN 三个表里,
// 按类别拆分在 pdf-tools.js / img-tools.js / dev-tools.js / more-tools.js。
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const{PDFDocument}=PDFLib;

const T={},OPTIONS={},RUN={};
let ct=null,files=[];

function defTool(id,cfg,opts,run){
  T[id]=cfg;
  if(opts)OPTIONS[id]=opts;
  if(run)RUN[id]=run;
}

function showHome(){document.getElementById('home-view').style.display='block';document.getElementById('tv').classList.remove('act');files=[];}

function openTool(id){
  ct=id;const t=T[id];
  document.getElementById('home-view').style.display='none';
  document.getElementById('tv').classList.add('act');
  document.getElementById('tt').textContent=t.title[currentLang];
  document.getElementById('td').textContent=t.desc[currentLang];
  document.getElementById('dzi').textContent=t.icon;
  document.getElementById('dzt').textContent=t.title[currentLang];
  document.getElementById('dzh').textContent=t.hint[currentLang];
  const inp=document.getElementById('fi');
  if(t.accept){inp.accept=t.accept;inp.multiple=t.multi;inp.disabled=false;}
  else{inp.removeAttribute('accept');inp.removeAttribute('multiple');inp.disabled=true;}
  files=[];updateFileList();buildOptions();hideResult();hideError();hideTextOutput();applyLang();
  document.getElementById('qrc').style.display='none';
  document.getElementById('dz').style.display=t.needsFiles?'block':'none';
  document.getElementById('pbBtn').disabled=!t.needsFiles;
  document.getElementById('pbBtn').style.display=t.needsFiles?'block':'none';
  document.getElementById('pbBtn').textContent=I18N[currentLang].btn_start;
  document.getElementById('fi').value='';
  document.getElementById('clBtn').style.display='none';
}

function buildOptions(){
  const f=OPTIONS[ct];
  document.getElementById('op').innerHTML=f?f():'';
}

// File handling
const dz=document.getElementById('dz');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dg');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dg'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dg');handleFiles(e.dataTransfer.files);});
document.getElementById('fi').addEventListener('change',e=>handleFiles(e.target.files));

function handleFiles(fs){
  const t=T[ct];
  if(!t.needsFiles)return;
  for(let f of fs){
    if(files.length>=20)break;
    if(!t.multi&&files.length>=1)break;
    files.push(f);
  }
  updateFileList();
  document.getElementById('pbBtn').disabled=files.length===0;
  hideError();hideResult();
}

// 文件列表用 DOM 节点构建,文件名经 textContent 写入,天然防注入
function updateFileList(){
  const fl=document.getElementById('fl');
  if(files.length===0){fl.classList.remove('act');document.getElementById('clBtn').style.display='none';return;}
  fl.classList.add('act');
  document.getElementById('clBtn').style.display='block';
  fl.textContent='';
  files.forEach((f,i)=>{
    const row=document.createElement('div');row.className='fi';
    const left=document.createElement('div');left.className='fil';
    const icon=document.createElement('span');icon.textContent='📄 ';
    left.appendChild(icon);left.appendChild(document.createTextNode(f.name));
    const right=document.createElement('div');
    right.style.cssText='display:flex;align-items:center;gap:10px';
    const size=document.createElement('span');size.className='fs';size.textContent=fs2(f.size);
    const btn=document.createElement('button');btn.className='rb';btn.textContent='✕';
    btn.addEventListener('click',()=>rm(i));
    right.appendChild(size);right.appendChild(btn);
    row.appendChild(left);row.appendChild(right);
    fl.appendChild(row);
  });
}

function rm(i){files.splice(i,1);updateFileList();document.getElementById('pbBtn').disabled=files.length===0;}

function clearFiles(){files=[];updateFileList();hideResult();}

function fs2(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(1)+' MB';}

function showError(m){const e=document.getElementById('ebx');e.textContent=m;e.classList.add('act');}
function hideError(){document.getElementById('ebx').classList.remove('act');}
function showResult(msg,url,name,info){
  const r=document.getElementById('rbx');
  document.getElementById('rti').textContent=info||msg;
  const l=document.getElementById('dl');
  l.href=url;l.download=name||'output';
  r.classList.add('act');
}
function hideResult(){document.getElementById('rbx').classList.remove('act');}
function showTextOutput(txt){const e=document.getElementById('to');e.textContent=txt;e.classList.add('act');}
function hideTextOutput(){document.getElementById('to').classList.remove('act');document.getElementById('to').textContent='';}
function setProgress(p){document.getElementById('pb').classList.add('act');document.getElementById('pf').style.width=p+'%';}
function resetProgress(){document.getElementById('pb').classList.remove('act');document.getElementById('pf').style.width='0%';}

// 统一入口:「开始处理」按钮按 RUN 表分发
async function processTool(){
  hideError();hideResult();hideTextOutput();
  const btn=document.getElementById('pbBtn');
  btn.disabled=true;btn.textContent=I18N[currentLang].processing;
  setProgress(10);
  try{
    const run=RUN[ct];
    if(run)await run();
  }catch(e){showError(I18N[currentLang].err_process_failed+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=I18N[currentLang].btn_start;resetProgress();}
}

function loadImg(file){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=reject;
    img.src=URL.createObjectURL(file);
  });
}
