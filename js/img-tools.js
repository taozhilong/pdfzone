// img-tools.js — 图片类工具(4 个)
defTool('imgCompress',{title:{zh:'图片压缩',en:'Compress Images'},desc:{zh:'压缩 JPG/PNG 图片体积',en:'Compress JPG/PNG image size'},hint:{zh:'选择 JPG/PNG 图片',en:'Select JPG/PNG images'},accept:'image/jpeg,image/png',multi:true,icon:'🗜️',needsFiles:true},()=>{
  return `<h4 data-i18n="imgcomp_quality">压缩质量</h4>
    <div class="ol" data-i18n="imgcomp_target">目标质量：</div>
    <div class="or"><input type="range" id="compQ" min="10" max="100" value="80" style="width:70%" oninput="document.getElementById('compQLabel').textContent=this.value+'%'"><span id="compQLabel" style="font-size:13px;width:28%;text-align:right">80%</span></div>
    <div class="ol" style="margin-top:8px" data-i18n="imgcomp_format">输出格式：</div>
    <div class="or"><select id="outFmt" class="wid"><option value="jpeg" selected data-i18n="imgcomp_jpg_small">JPG（体积小）</option><option value="png" data-i18n="imgcomp_png_quality">PNG（质量高）</option></select></div>`;
},compressImages);
defTool('imgResize',{title:{zh:'调整图片大小',en:'Resize Images'},desc:{zh:'修改图片尺寸和分辨率',en:'Change image dimensions and resolution'},hint:{zh:'选择 JPG/PNG 图片',en:'Select JPG/PNG images'},accept:'image/*',multi:false,icon:'📐',needsFiles:true},()=>{
  return `<h4 data-i18n="imgresize_size">调整尺寸</h4>
    <div class="or"><label data-i18n="imgresize_width">宽度：</label><input type="number" id="newW" data-i18n-placeholder="imgresize_w_placeholder" placeholder="像素" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span><label style="margin-left:16px" data-i18n="imgresize_height">高度：</label><input type="number" id="newH" data-i18n-placeholder="imgresize_h_placeholder" placeholder="自动" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span></div>
    <div class="or"><label><input type="checkbox" id="keepRatio" checked onchange="document.getElementById('newH').disabled=this.checked" data-i18n="imgresize_keep_ratio">保持宽高比</label></div>`;
},resizeImages);
defTool('imgConvert',{title:{zh:'图片格式转换',en:'Convert Image Format'},desc:{zh:'JPG/PNG/WebP 互转',en:'Convert between JPG/PNG/WebP'},hint:{zh:'选择图片',en:'Select images'},accept:'image/*',multi:true,icon:'🔄',needsFiles:true},()=>`<h4 data-i18n="imgconv_format">输出格式</h4><div class="or"><select id="convFmt" class="wid"><option value="jpeg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option></select></div>`,convertImages);
defTool('gifMaker',{title:{zh:'GIF 制作',en:'Make GIF'},desc:{zh:'将多张图片合成为 GIF 动图',en:'Combine images into animated GIF'},hint:{zh:'选择多张图片（建议同尺寸）',en:'Select multiple images (same size recommended)'},accept:'image/*',multi:true,icon:'🎞️',needsFiles:true},()=>{
  return `<h4 data-i18n="gif_settings">GIF 设置</h4>
    <div class="or"><label data-i18n="gif_delay">帧间隔：</label><input type="number" id="gifDelay" value="500" min="50" max="2000" style="width:70px"><span style="color:var(--tl);font-size:13px">ms</span><label style="margin-left:16px" data-i18n="gif_width">宽：</label><input type="number" id="gifW" value="400" min="50" max="1000" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span></div>`;
},makeGif);

async function compressImages(){
  if(files.length<1)throw new Error(I18N[currentLang].err_compress_min);
  setProgress(20);
  const q=parseInt(document.getElementById('compQ')?.value||80)/100;
  const fmt=document.getElementById('outFmt')?.value||'jpeg';
  const zip=new JSZip();
  for(let i=0;i<files.length;i++){
    const f=files[i];
    const cv=document.createElement('canvas');
    const ctx=cv.getContext('2d');
    const img=await loadImg(f);
    cv.width=img.width;cv.height=img.height;
    ctx.drawImage(img,0,0);
    const ext=fmt==='jpeg'?'jpg':fmt;
    const dataUrl=cv.toDataURL('image/'+fmt,q);
    zip.file(f.name.replace(/\.[^.]+$/,'.'+ext),dataUrl.split(',')[1],{base64:true});
    setProgress(20+(i/files.length)*70);
  }
  const content=await zip.generateAsync({type:'blob'});
  showResult(I18N[currentLang].succ_compress_imgs+files.length+I18N[currentLang].succ_imgs,URL.createObjectURL(content),'compressed_images.zip');
}

async function resizeImages(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_resize_one);
  setProgress(20);
  const newW=parseInt(document.getElementById('newW')?.value)||0;
  const newH=parseInt(document.getElementById('newH')?.value)||0;
  const keepRatio=document.getElementById('keepRatio')?.checked;
  if(!newW&&!newH)throw new Error(I18N[currentLang].err_resize_dim);
  const f=files[0];
  const img=await loadImg(f);
  let w=newW,h=newH;
  if(keepRatio){
    if(newW&&!newH)h=Math.round(img.height*newW/img.width);
    else if(newH&&!newW)w=Math.round(img.width*newH/img.height);
    else if(newW&&newH)h=Math.round(img.height*newW/img.width); // width takes priority
  }
  if(!w||!h||w<1||h<1)throw new Error(I18N[currentLang].err_resize_dim);
  const cv=document.createElement('canvas');
  cv.width=w;cv.height=h;
  const ctx=cv.getContext('2d');
  ctx.drawImage(img,0,0,w,h);
  setProgress(70);
  const ext=f.name.split('.').pop().toLowerCase();
  const fmt=ext==='png'?'image/png':'image/jpeg';
  const blob=await new Promise(r=>cv.toBlob(r,fmt,0.92));
  showResult(I18N[currentLang].succ_resized+w+'×'+h,URL.createObjectURL(blob),'resized_'+f.name);
}

async function convertImages(){
  if(files.length<1)throw new Error(I18N[currentLang].err_compress_min);
  setProgress(20);
  const fmt=document.getElementById('convFmt')?.value||'jpeg';
  const zip=new JSZip();
  for(let i=0;i<files.length;i++){
    const f=files[i];
    const cv=document.createElement('canvas');
    const ctx=cv.getContext('2d');
    const img=await loadImg(f);
    cv.width=img.width;cv.height=img.height;
    ctx.drawImage(img,0,0);
    const ext=fmt;
    const dataUrl=cv.toDataURL('image/'+fmt,0.92);
    zip.file(f.name.replace(/\.[^.]+$/,'.'+ext),dataUrl.split(',')[1],{base64:true});
    setProgress(20+(i/files.length)*70);
  }
  const content=await zip.generateAsync({type:'blob'});
  showResult(I18N[currentLang].succ_convert_imgs+files.length+I18N[currentLang].succ_to_fmt+fmt.toUpperCase(),URL.createObjectURL(content),'converted.zip');
}

async function makeGif(){
  if(files.length<2)throw new Error(I18N[currentLang].err_gif_min);
  setProgress(20);
  const delay=parseInt(document.getElementById('gifDelay')?.value||500);
  const targetW=parseInt(document.getElementById('gifW')?.value||400);
  const imgs=[];
  for(const f of files){imgs.push(await loadImg(f));}
  const ratio=targetW/imgs[0].width;
  const w=Math.min(targetW,Math.round(imgs[0].width*ratio));
  const h=Math.max(1,Math.round(imgs[0].height*(w/imgs[0].width)));
  const gif=new GIF({workers:1,workerScript:await ensureGifWorker(),quality:10,width:w,height:h});
  for(let i=0;i<imgs.length;i++){
    const cv=document.createElement('canvas');
    cv.width=w;cv.height=h;
    const ctx=cv.getContext('2d');
    ctx.drawImage(imgs[i],0,0,w,h);
    gif.addFrame(ctx,{copy:true,delay:delay});
    setProgress(20+(i/imgs.length)*40);
  }
  const blob=await new Promise((resolve,reject)=>{
    gif.on('finished',resolve);
    gif.on('abort',()=>reject(new Error('gif render aborted')));
    gif.render();
  });
  setProgress(95);
  showResult(I18N[currentLang].succ_gif+files.length+I18N[currentLang].succ_frames,URL.createObjectURL(blob),'animation.gif');
}

// gif.js worker must be same-origin: fetch the CDN script and wrap in a blob URL
let _gifWorkerUrl=null;
async function ensureGifWorker(){
  if(_gifWorkerUrl)return _gifWorkerUrl;
  const r=await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
  if(!r.ok)throw new Error('gif.js worker load failed');
  _gifWorkerUrl=URL.createObjectURL(new Blob([await r.text()],{type:'application/javascript'}));
  return _gifWorkerUrl;
}
