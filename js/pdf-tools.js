// pdf-tools.js — PDF 类工具(11 个)
defTool('merge',{title:{zh:'合并 PDF',en:'Merge PDF'},desc:{zh:'将多个 PDF 文件合并为一个',en:'Combine multiple PDF files into one'},hint:{zh:'选择多个 PDF 文件',en:'Select multiple PDF files'},accept:'.pdf',multi:true,icon:'📑',needsFiles:true},null,mergePDFs);
defTool('split',{title:{zh:'拆分 PDF',en:'Split PDF'},desc:{zh:'按指定页数或范围将 PDF 拆分成多个',en:'Split PDF into multiple files by page range'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'✂️',needsFiles:true},()=>{
  return `<h4 data-i18n="split_method">拆分方式</h4>
    <div class="or"><input type="radio" name="st" value="ranges" id="r1" checked onchange="ts()"><label for="r1" data-i18n="split_by_range">按范围</label><input type="radio" name="st" value="every" id="r2" onchange="ts()"><label for="r2" data-i18n="split_every_n">每 N 页</label></div>
    <div id="rangeRow"><div class="ol" data-i18n="split_range_label">页码范围（如 1-3, 4-6）：</div><input type="text" id="rangesIn" class="wid" data-i18n-placeholder="split_range_placeholder" placeholder="1-3, 4-6, 7-10"></div>
    <div id="everyRow" style="display:none"><div class="ol" data-i18n="split_every_label">每几页一份：</div><input type="number" id="everyIn" value="1" min="1" style="width:80px"></div>`;
},splitPDF);
defTool('compress',{title:{zh:'压缩 PDF',en:'Compress PDF'},desc:{zh:'减小 PDF 文件大小',en:'Reduce PDF file size'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'📦',needsFiles:true},()=>`<h4 data-i18n="compress_quality">压缩质量</h4><div class="or"><select id="qSel" class="wid"><option value="extreme" data-i18n="compress_extreme">极限压缩（文件最小）</option><option value="recommended" selected data-i18n="compress_recommended">推荐（平衡）</option><option value="low" data-i18n="compress_low">低压缩（质量最高）</option></select></div>`,compressPDF);
defTool('rotate',{title:{zh:'旋转 PDF',en:'Rotate PDF'},desc:{zh:'旋转 PDF 页面角度（90°/180°/270°）',en:'Rotate PDF pages (90°/180°/270°)'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🔄',needsFiles:true},()=>{
  return `<h4 data-i18n="rotate_angle">旋转角度</h4>
    <div class="or"><select id="rotDeg" class="wid"><option value="90" data-i18n="rotate_90">90° 顺时针</option><option value="180" data-i18n="rotate_180">180°</option><option value="270" data-i18n="rotate_270">270° 逆时针</option></select></div>
    <div class="ol" style="margin-top:8px" data-i18n="rotate_pages_label">选择页面（留空=全部）：</div>
    <input type="text" id="rotPages" class="wid" data-i18n-placeholder="rotate_pages_placeholder" placeholder="如 1,3,5 或留空">`;
},rotatePDF);
defTool('deletePages',{title:{zh:'删除页面',en:'Delete Pages'},desc:{zh:'从 PDF 中删除指定页面',en:'Remove specific pages from PDF'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🗑️',needsFiles:true},()=>`<h4 data-i18n="delete_pages_title">删除页面</h4><div class="ol" data-i18n="delete_pages_label">输入要删除的页码（如 2,4,5-7）：</div><input type="text" id="delPages" class="wid" data-i18n-placeholder="delete_pages_placeholder" placeholder="2,4,5-7">`,deletePDFPages);
defTool('pdfToImage',{title:{zh:'PDF 转图片',en:'PDF to Images'},desc:{zh:'将 PDF 每一页转换为 JPG 图片',en:'Convert each PDF page to JPG image'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🖼️',needsFiles:true},()=>`<h4 data-i18n="pdf2img_format">输出格式</h4><div class="or"><select id="imgFmt" style="width:50%"><option value="jpeg">JPG</option><option value="png">PNG</option></select><label data-i18n="pdf2img_quality">质量：</label><input type="number" id="imgQ" value="90" min="10" max="100" style="width:50px"><span>%</span></div>`,pdfToImages);
defTool('imageToPdf',{title:{zh:'图片转 PDF',en:'Images to PDF'},desc:{zh:'将 JPG/PNG 图片合并为一个 PDF',en:'Combine JPG/PNG images into one PDF'},hint:{zh:'选择多张图片',en:'Select multiple images'},accept:'image/*',multi:true,icon:'📄',needsFiles:true},null,imagesToPDF);
defTool('extractText',{title:{zh:'提取文字',en:'Extract Text'},desc:{zh:'从 PDF 中提取所有文本内容',en:'Extract all text content from PDF'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'📝',needsFiles:true},null,extractText);
defTool('unlockPdf',{title:{zh:'PDF 解锁',en:'Unlock PDF'},desc:{zh:'去除 PDF 密码保护（需提供密码）',en:'Remove PDF password protection (password required)'},hint:{zh:'选择1个受保护的 PDF',en:'Select 1 protected PDF'},accept:'.pdf',multi:false,icon:'🔓',needsFiles:true},()=>`<h4 data-i18n="unlock_label">PDF 密码（如已加密）：</h4><input type="password" id="pdfPwd" class="wid" data-i18n-placeholder="unlock_placeholder" placeholder="留空表示仅解除所有者限制">`,unlockPDF);
defTool('watermark',{title:{zh:'PDF 加水印',en:'Add Watermark'},desc:{zh:'给每页添加斜向文字水印',en:'Add diagonal text watermark to every page'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'💧',needsFiles:true},()=>{
  return `<h4 data-i18n="wm_settings">水印设置</h4>
    <div class="ol" data-i18n="wm_text_label">水印文字（仅英文/数字）：</div>
    <input type="text" id="wmText" class="wid" value="CONFIDENTIAL" maxlength="50">
    <div class="or" style="margin-top:8px"><label data-i18n="wm_size_label">字号：</label><input type="number" id="wmSize" value="48" min="10" max="200" style="width:70px">
    <label style="margin-left:16px" data-i18n="wm_opacity_label">不透明度：</label>
    <select id="wmOpacity"><option value="0.1" data-i18n="wm_op_light">浅 (10%)</option><option value="0.25" selected data-i18n="wm_op_medium">中 (25%)</option><option value="0.5" data-i18n="wm_op_dark">深 (50%)</option></select></div>`;
},watermarkPDF);
defTool('reorderPages',{title:{zh:'页面重排',en:'Reorder Pages'},desc:{zh:'按自定义顺序重排 PDF 页面',en:'Reorder PDF pages in custom order'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🔀',needsFiles:true},()=>`<h4 data-i18n="reorder_label">新页面顺序</h4><div class="ol" data-i18n="reorder_hint">用页码列表表示新顺序，支持倒序区间：</div><input type="text" id="newOrder" class="wid" data-i18n-placeholder="reorder_placeholder" placeholder="如 2,1,3 或 3-1,2">`,reorderPDFPages);

function ts(){const t=document.querySelector('input[name="st"]:checked').value;document.getElementById('rangeRow').style.display=t==='ranges'?'block':'none';document.getElementById('everyRow').style.display=t==='every'?'block':'none';}

function parsePageList(str,total){
  const result=new Set();
  for(const part of str.split(',')){
    const m=part.trim().match(/^(\d+)(?:-(\d+))?$/);
    if(!m)continue;
    const s=parseInt(m[1])-1;
    const e=m[2]?parseInt(m[2])-1:s;
    for(let i=s;i<=e&&i<total;i++)result.add(i);
  }
  return result;
}

async function mergePDFs(){
  if(files.length<2)throw new Error(I18N[currentLang].err_merge_min);
  setProgress(30);
  const merged=await PDFDocument.create();
  for(let i=0;i<files.length;i++){
    const buf=await files[i].arrayBuffer();
    const pdf=await PDFDocument.load(buf);
    const pages=await merged.copyPages(pdf,pdf.getPageIndices());
    pages.forEach(p=>merged.addPage(p));
    setProgress(30+(i/files.length)*60);
  }
  setProgress(95);
  const bytes=await merged.save();
  showResult(I18N[currentLang].succ_merged+files.length+I18N[currentLang].succ_files,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'merged.pdf');
}

async function splitPDF(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const pdf=await PDFDocument.load(buf);
  const total=pdf.getPageCount();
  const type=document.querySelector('input[name="st"]:checked').value;
  let ranges=[];
  if(type==='every'){
    const n=parseInt(document.getElementById('everyIn')?.value)||1;
    for(let i=0;i<total;i+=n)ranges.push([i,Math.min(i+n-1,total-1)]);
  }else{
    const inp=(document.getElementById('rangesIn')?.value||'').trim();
    if(!inp)throw new Error(I18N[currentLang].err_split_range);
    for(let p of inp.split(',')){
      const m=p.trim().match(/^(\d+)(?:-(\d+))?$/);
      if(!m)throw new Error(I18N[currentLang].err_split_format+p);
      ranges.push([parseInt(m[1])-1,m[2]?parseInt(m[2])-1:parseInt(m[1])-1]);
    }
  }
  setProgress(40);
  if(ranges.length===1){
    const[s,e]=ranges[0];
    const np=await PDFDocument.create();
    const ps=await np.copyPages(pdf,Array.from({length:e-s+1},(_,k)=>s+k));
    ps.forEach(p=>np.addPage(p));
    const b=await np.save();
    showResult(I18N[currentLang].succ_split_one,URL.createObjectURL(new Blob([b],{type:'application/pdf'})),'split.pdf');
  }else{
    const zip=new JSZip();
    for(let i=0;i<ranges.length;i++){
      const[s,e]=ranges[i];
      const np=await PDFDocument.create();
      const ps=await np.copyPages(pdf,Array.from({length:e-s+1},(_,k)=>s+k));
      ps.forEach(p=>np.addPage(p));
      zip.file('pages_'+(s+1)+'-'+(e+1)+'.pdf',await np.save());
      setProgress(40+(i/ranges.length)*50);
    }
    const content=await zip.generateAsync({type:'blob'});
    showResult(I18N[currentLang].succ_split_multi+ranges.length+I18N[currentLang].succ_split_zip,URL.createObjectURL(content),'split.zip');
  }
}

async function compressPDF(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(10);
  const levels={extreme:{scale:1.0,q:0.45},recommended:{scale:1.5,q:0.65},low:{scale:2.0,q:0.85}};
  const lv=levels[document.getElementById('qSel')?.value]||levels.recommended;
  const buf=await files[0].arrayBuffer();
  const doc=await pdfjsLib.getDocument({data:buf}).promise;
  const out=await PDFDocument.create();
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i);
    const base=page.getViewport({scale:1});
    const vp=page.getViewport({scale:lv.scale});
    const cv=document.createElement('canvas');
    cv.width=vp.width;cv.height=vp.height;
    await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
    const jpg=await out.embedJpg(cv.toDataURL('image/jpeg',lv.q));
    const pg=out.addPage([base.width,base.height]);
    pg.drawImage(jpg,{x:0,y:0,width:base.width,height:base.height});
    setProgress(10+(i/doc.numPages)*80);
  }
  const bytes=await out.save();
  const ratio=(bytes.length/files[0].size*100).toFixed(1);
  showResult(I18N[currentLang].succ_compress+fs2(bytes.length)+I18N[currentLang].succ_compress_orig+fs2(files[0].size)+I18N[currentLang].succ_compress_ratio+ratio+'%)',URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'compressed.pdf');
}

async function rotatePDF(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const pdf=await PDFDocument.load(buf);
  const deg=parseInt(document.getElementById('rotDeg')?.value||90);
  const pagesInput=(document.getElementById('rotPages')?.value||'').trim();
  const allPages=pdf.getPageIndices();
  const toRotate=pagesInput?parsePageList(pagesInput,allPages.length):allPages;
  setProgress(40);
  for(const idx of toRotate){
    const page=pdf.getPage(idx);
    const currentRotation=page.getRotation().angle;
    page.setRotation({angle:(currentRotation+deg)%360});
    setProgress(40+(idx/allPages.length)*50);
  }
  setProgress(95);
  const bytes=await pdf.save();
  showResult(I18N[currentLang].succ_rotate+toRotate.length+I18N[currentLang].succ_pages,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'rotated.pdf');
}

async function deletePDFPages(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  const pagesInput=(document.getElementById('delPages')?.value||'').trim();
  if(!pagesInput)throw new Error(I18N[currentLang].err_delete_input);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const pdf=await PDFDocument.load(buf);
  const total=pdf.getPageCount();
  const toDelete=new Set(parsePageList(pagesInput,total).map(i=>i));
  const newPdf=await PDFDocument.create();
  for(let i=0;i<total;i++){
    if(!toDelete.has(i)){
      const pages=await newPdf.copyPages(pdf,[i]);
      newPdf.addPage(pages[0]);
    }
    setProgress(20+(i/total)*60);
  }
  setProgress(95);
  const bytes=await newPdf.save();
  showResult(I18N[currentLang].succ_delete+toDelete.size+I18N[currentLang].succ_pages+I18N[currentLang].succ_remain+(total-toDelete.size)+I18N[currentLang].succ_pages,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'deleted.pdf');
}

async function pdfToImages(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const doc=await pdfjsLib.getDocument({data:buf}).promise;
  const fmt=(document.getElementById('imgFmt')?.value||'jpeg');
  const q=parseInt(document.getElementById('imgQ')?.value||90)/100;
  const zip=new JSZip();
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i);
    const vp=page.getViewport({scale:2});
    const cv=document.createElement('canvas');
    cv.width=vp.width;cv.height=vp.height;
    await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
    const ext=fmt==='jpeg'?'jpg':'png';
    zip.file('page_'+i+'.'+ext,cv.toDataURL('image/'+fmt,q).split(',')[1],{base64:true});
    setProgress(20+(i/doc.numPages)*70);
  }
  const content=await zip.generateAsync({type:'blob'});
  showResult(I18N[currentLang].succ_pdf2img+doc.numPages+I18N[currentLang].succ_converted_to_img,URL.createObjectURL(content),'images.zip');
}

async function imagesToPDF(){
  if(files.length<1)throw new Error(I18N[currentLang].err_compress_min);
  setProgress(20);
  const pdf=await PDFDocument.create();
  for(let i=0;i<files.length;i++){
    const f=files[i];
    const ext=f.name.split('.').pop().toLowerCase();
    let img;
    if(ext==='png'){img=await pdf.embedPng(await f.arrayBuffer());}
    else if(ext==='jpg'||ext==='jpeg'){img=await pdf.embedJpg(await f.arrayBuffer());}
    else{
      // WebP/other formats: re-encode to JPEG via canvas
      const simg=await loadImg(f);
      const cv=document.createElement('canvas');
      cv.width=simg.width;cv.height=simg.height;
      cv.getContext('2d').drawImage(simg,0,0);
      const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',0.92));
      img=await pdf.embedJpg(await blob.arrayBuffer());
    }
    const pg=pdf.addPage([img.width,img.height]);
    pg.drawImage(img,{x:0,y:0,width:img.width,height:img.height});
    setProgress(20+(i/files.length)*70);
  }
  setProgress(95);
  const bytes=await pdf.save();
  showResult(I18N[currentLang].succ_img2pdf+files.length+I18N[currentLang].succ_pages_in_pdf,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'images.pdf');
}

async function extractText(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const doc=await pdfjsLib.getDocument({data:buf}).promise;
  let text='';
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i);
    const content=await page.getTextContent();
    text+=content.items.map(it=>it.str).join(' ')+'\n\n---\n\n';
    setProgress(20+(i/doc.numPages)*70);
  }
  const blob=new Blob([text],{type:'text/plain'});
  showResult(I18N[currentLang].succ_extract+doc.numPages+I18N[currentLang].succ_text,URL.createObjectURL(blob),'extracted.txt');
}

async function unlockPDF(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const pwd=(document.getElementById('pdfPwd')?.value||'');
  const raw=await files[0].arrayBuffer();
  if(!pwd){
    try{
      const pdf=await PDFDocument.load(raw.slice(0),{ignoreEncryption:true});
      setProgress(90);
      const bytes=await pdf.save();
      showResult(I18N[currentLang].succ_unlock,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'unlocked.pdf');
      return;
    }catch(e){/* fall through to rasterize path */}
  }
  const doc=await pdfjsLib.getDocument({data:raw.slice(0),password:pwd}).promise;
  const out=await PDFDocument.create();
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i);
    const base=page.getViewport({scale:1});
    const vp=page.getViewport({scale:2});
    const cv=document.createElement('canvas');
    cv.width=vp.width;cv.height=vp.height;
    await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
    const jpg=await out.embedJpg(cv.toDataURL('image/jpeg',0.92));
    const pg=out.addPage([base.width,base.height]);
    pg.drawImage(jpg,{x:0,y:0,width:base.width,height:base.height});
    setProgress(20+(i/doc.numPages)*70);
  }
  const bytes=await out.save();
  showResult(I18N[currentLang].succ_unlock,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'unlocked.pdf');
}

async function watermarkPDF(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  setProgress(20);
  const text=(document.getElementById('wmText')?.value||'').trim();
  if(!text)throw new Error(I18N[currentLang].err_wm_text);
  const size=parseInt(document.getElementById('wmSize')?.value||48);
  const opacity=parseFloat(document.getElementById('wmOpacity')?.value||'0.25');
  const buf=await files[0].arrayBuffer();
  const pdf=await PDFDocument.load(buf);
  const font=await pdf.embedFont(PDFLib.StandardFonts.HelveticaBold);
  const pages=pdf.getPages();
  for(let i=0;i<pages.length;i++){
    const pg=pages[i];
    const tw=font.widthOfTextAtSize(text,size);
    const {width,height}=pg.getSize();
    pg.drawText(text,{x:(width-tw)/2,y:height/2,size:size,font:font,opacity:opacity,rotate:PDFLib.degrees(45),color:PDFLib.rgb(0.6,0.6,0.6)});
    setProgress(20+(i/pages.length)*70);
  }
  setProgress(95);
  const bytes=await pdf.save();
  showResult(I18N[currentLang].succ_watermark+pages.length+I18N[currentLang].succ_pages,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'watermarked.pdf');
}

async function reorderPDFPages(){
  if(files.length!==1)throw new Error(I18N[currentLang].err_split_one);
  const orderInput=(document.getElementById('newOrder')?.value||'').trim();
  if(!orderInput)throw new Error(I18N[currentLang].err_reorder_input);
  setProgress(20);
  const buf=await files[0].arrayBuffer();
  const pdf=await PDFDocument.load(buf);
  const total=pdf.getPageCount();
  const order=[];
  for(const tok of orderInput.split(',')){
    const m=tok.trim().match(/^(\d+)(?:-(\d+))?$/);
    if(!m)throw new Error(I18N[currentLang].err_split_format+tok);
    const a=parseInt(m[1]),b=m[2]?parseInt(m[2]):a;
    if(a>total||b>total||a<1||b<1)throw new Error(I18N[currentLang].err_reorder_range+total);
    if(a<=b)for(let p=a;p<=b;p++)order.push(p-1);
    else for(let p=a;p>=b;p--)order.push(p-1);
  }
  if(order.length!==total)throw new Error(I18N[currentLang].err_reorder_count+total+I18N[currentLang].err_reorder_got+order.length);
  setProgress(50);
  const out=await PDFDocument.create();
  const copied=await out.copyPages(pdf,order);
  copied.forEach(p=>out.addPage(p));
  setProgress(90);
  const bytes=await out.save();
  showResult(I18N[currentLang].succ_reorder,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),'reordered.pdf');
}
