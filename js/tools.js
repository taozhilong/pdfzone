// tools.js — 工具注册表(T)、选项面板(buildOptions)、全部工具实现
// 依赖:页面先加载 pdf-lib / pdf.js / jszip / qrcode-generator / gif.js,
//       并先于 js/i18n.js 加载(applyLang 引用本文件的 ct / T)
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const{PDFDocument}=PDFLib;
let ct=null,files=[];

const T={
  merge:{title:{zh:'合并 PDF',en:'Merge PDF'},desc:{zh:'将多个 PDF 文件合并为一个',en:'Combine multiple PDF files into one'},hint:{zh:'选择多个 PDF 文件',en:'Select multiple PDF files'},accept:'.pdf',multi:true,icon:'📑',needsFiles:true},
  split:{title:{zh:'拆分 PDF',en:'Split PDF'},desc:{zh:'按指定页数或范围将 PDF 拆分成多个',en:'Split PDF into multiple files by page range'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'✂️',needsFiles:true},
  compress:{title:{zh:'压缩 PDF',en:'Compress PDF'},desc:{zh:'减小 PDF 文件大小',en:'Reduce PDF file size'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'📦',needsFiles:true},
  rotate:{title:{zh:'旋转 PDF',en:'Rotate PDF'},desc:{zh:'旋转 PDF 页面角度（90°/180°/270°）',en:'Rotate PDF pages (90°/180°/270°)'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🔄',needsFiles:true},
  deletePages:{title:{zh:'删除页面',en:'Delete Pages'},desc:{zh:'从 PDF 中删除指定页面',en:'Remove specific pages from PDF'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🗑️',needsFiles:true},
  pdfToImage:{title:{zh:'PDF 转图片',en:'PDF to Images'},desc:{zh:'将 PDF 每一页转换为 JPG 图片',en:'Convert each PDF page to JPG image'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🖼️',needsFiles:true},
  imageToPdf:{title:{zh:'图片转 PDF',en:'Images to PDF'},desc:{zh:'将 JPG/PNG 图片合并为一个 PDF',en:'Combine JPG/PNG images into one PDF'},hint:{zh:'选择多张图片',en:'Select multiple images'},accept:'image/*',multi:true,icon:'📄',needsFiles:true},
  extractText:{title:{zh:'提取文字',en:'Extract Text'},desc:{zh:'从 PDF 中提取所有文本内容',en:'Extract all text content from PDF'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'📝',needsFiles:true},
  unlockPdf:{title:{zh:'PDF 解锁',en:'Unlock PDF'},desc:{zh:'去除 PDF 密码保护（需提供密码）',en:'Remove PDF password protection (password required)'},hint:{zh:'选择1个受保护的 PDF',en:'Select 1 protected PDF'},accept:'.pdf',multi:false,icon:'🔓',needsFiles:true},
  imgCompress:{title:{zh:'图片压缩',en:'Compress Images'},desc:{zh:'压缩 JPG/PNG 图片体积',en:'Compress JPG/PNG image size'},hint:{zh:'选择 JPG/PNG 图片',en:'Select JPG/PNG images'},accept:'image/jpeg,image/png',multi:true,icon:'🗜️',needsFiles:true},
  imgResize:{title:{zh:'调整图片大小',en:'Resize Images'},desc:{zh:'修改图片尺寸和分辨率',en:'Change image dimensions and resolution'},hint:{zh:'选择 JPG/PNG 图片',en:'Select JPG/PNG images'},accept:'image/*',multi:false,icon:'📐',needsFiles:true},
  imgConvert:{title:{zh:'图片格式转换',en:'Convert Image Format'},desc:{zh:'JPG/PNG/WebP 互转',en:'Convert between JPG/PNG/WebP'},hint:{zh:'选择图片',en:'Select images'},accept:'image/*',multi:true,icon:'🔄',needsFiles:true},
  gifMaker:{title:{zh:'GIF 制作',en:'Make GIF'},desc:{zh:'将多张图片合成为 GIF 动图',en:'Combine images into animated GIF'},hint:{zh:'选择多张图片（建议同尺寸）',en:'Select multiple images (same size recommended)'},accept:'image/*',multi:true,icon:'🎞️',needsFiles:true},
  qrCode:{title:{zh:'二维码生成',en:'QR Code Generator'},desc:{zh:'输入文字或链接，生成二维码图片',en:'Generate QR code from text/URL'},hint:{zh:'',en:''},accept:'',multi:false,icon:'📱',needsFiles:false},
  base64:{title:{zh:'Base64 编解码',en:'Base64 Encode/Decode'},desc:{zh:'文本与 Base64 字符串互转',en:'Convert between text and Base64'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔣',needsFiles:false},
  urlEncode:{title:{zh:'URL 编解码',en:'URL Encode/Decode'},desc:{zh:'URL 特殊字符编码与解码',en:'URL special character encoding and decoding'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔗',needsFiles:false},
  colorConvert:{title:{zh:'颜色转换',en:'Color Converter'},desc:{zh:'HEX / RGB / HSL 颜色值互转',en:'Convert between HEX / RGB / HSL'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🎨',needsFiles:false},
  watermark:{title:{zh:'PDF 加水印',en:'Add Watermark'},desc:{zh:'给每页添加斜向文字水印',en:'Add diagonal text watermark to every page'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'💧',needsFiles:true},
  reorderPages:{title:{zh:'页面重排',en:'Reorder Pages'},desc:{zh:'按自定义顺序重排 PDF 页面',en:'Reorder PDF pages in custom order'},hint:{zh:'选择1个 PDF 文件',en:'Select 1 PDF file'},accept:'.pdf',multi:false,icon:'🔀',needsFiles:true},
  jsonFormat:{title:{zh:'JSON 格式化',en:'JSON Formatter'},desc:{zh:'格式化/压缩/校验 JSON',en:'Format / minify / validate JSON'},hint:{zh:'',en:''},accept:'',multi:false,icon:'{ }',needsFiles:false},
  hashGen:{title:{zh:'Hash 生成',en:'Hash Generator'},desc:{zh:'生成 SHA-1 / SHA-256 / SHA-512',en:'Generate SHA-1 / SHA-256 / SHA-512'},hint:{zh:'',en:''},accept:'',multi:false,icon:'#️⃣',needsFiles:false},
  timestamp:{title:{zh:'时间戳转换',en:'Timestamp Converter'},desc:{zh:'Unix 时间戳与日期互转',en:'Convert Unix timestamp and datetime'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🕐',needsFiles:false},
  passwordGen:{title:{zh:'密码生成',en:'Password Generator'},desc:{zh:'随机生成强密码',en:'Generate random strong passwords'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔑',needsFiles:false},
  uuidGen:{title:{zh:'UUID 生成',en:'UUID Generator'},desc:{zh:'批量生成 UUID v4',en:'Generate UUID v4 in batch'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🆔',needsFiles:false},
  textDiff:{title:{zh:'内容比对',en:'Text Diff'},desc:{zh:'逐行比较两段文本的差异',en:'Compare two texts line by line'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔍',needsFiles:false},
  wordCount:{title:{zh:'字数统计',en:'Word Count'},desc:{zh:'字符/单词/行数统计',en:'Count characters, words and lines'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔢',needsFiles:false},
  caseConvert:{title:{zh:'命名转换',en:'Case Converter'},desc:{zh:'camelCase / snake_case 等互转',en:'Convert between naming conventions'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔤',needsFiles:false},
  baseConvert:{title:{zh:'进制转换',en:'Base Converter'},desc:{zh:'二/八/十/十六进制互转',en:'Convert between BIN/OCT/DEC/HEX'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔟',needsFiles:false},
  urlParams:{title:{zh:'URL 参数解析',en:'URL Params Parser'},desc:{zh:'查询串拆成参数表格和 JSON',en:'Parse query string into table and JSON'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🧩',needsFiles:false},
  textClean:{title:{zh:'去重排序',en:'Dedupe & Sort'},desc:{zh:'文本行去重/排序/去空行',en:'Dedupe, sort, trim text lines'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🧹',needsFiles:false}
};

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
  const p=document.getElementById('op');let h='';
  switch(ct){
    case 'split':
      h=`<h4 data-i18n="split_method">拆分方式</h4>
        <div class="or"><input type="radio" name="st" value="ranges" id="r1" checked onchange="ts()"><label for="r1" data-i18n="split_by_range">按范围</label><input type="radio" name="st" value="every" id="r2" onchange="ts()"><label for="r2" data-i18n="split_every_n">每 N 页</label></div>
        <div id="rangeRow"><div class="ol" data-i18n="split_range_label">页码范围（如 1-3, 4-6）：</div><input type="text" id="rangesIn" class="wid" data-i18n-placeholder="split_range_placeholder" placeholder="1-3, 4-6, 7-10"></div>
        <div id="everyRow" style="display:none"><div class="ol" data-i18n="split_every_label">每几页一份：</div><input type="number" id="everyIn" value="1" min="1" style="width:80px"></div>`;
      break;
    case 'compress':h=`<h4 data-i18n="compress_quality">压缩质量</h4><div class="or"><select id="qSel" class="wid"><option value="extreme" data-i18n="compress_extreme">极限压缩（文件最小）</option><option value="recommended" selected data-i18n="compress_recommended">推荐（平衡）</option><option value="low" data-i18n="compress_low">低压缩（质量最高）</option></select></div>`;break;
    case 'rotate':
      h=`<h4 data-i18n="rotate_angle">旋转角度</h4>
        <div class="or"><select id="rotDeg" class="wid"><option value="90" data-i18n="rotate_90">90° 顺时针</option><option value="180" data-i18n="rotate_180">180°</option><option value="270" data-i18n="rotate_270">270° 逆时针</option></select></div>
        <div class="ol" style="margin-top:8px" data-i18n="rotate_pages_label">选择页面（留空=全部）：</div>
        <input type="text" id="rotPages" class="wid" data-i18n-placeholder="rotate_pages_placeholder" placeholder="如 1,3,5 或留空">`;break;
    case 'deletePages':h=`<h4 data-i18n="delete_pages_title">删除页面</h4><div class="ol" data-i18n="delete_pages_label">输入要删除的页码（如 2,4,5-7）：</div><input type="text" id="delPages" class="wid" data-i18n-placeholder="delete_pages_placeholder" placeholder="2,4,5-7">`;break;
    case 'unlockPdf':h=`<h4 data-i18n="unlock_label">PDF 密码（如已加密）：</h4><input type="password" id="pdfPwd" class="wid" data-i18n-placeholder="unlock_placeholder" placeholder="留空表示仅解除所有者限制">`;break;
    case 'watermark':
      h=`<h4 data-i18n="wm_settings">水印设置</h4>
        <div class="ol" data-i18n="wm_text_label">水印文字（仅英文/数字）：</div>
        <input type="text" id="wmText" class="wid" value="CONFIDENTIAL" maxlength="50">
        <div class="or" style="margin-top:8px"><label data-i18n="wm_size_label">字号：</label><input type="number" id="wmSize" value="48" min="10" max="200" style="width:70px">
        <label style="margin-left:16px" data-i18n="wm_opacity_label">不透明度：</label>
        <select id="wmOpacity"><option value="0.1" data-i18n="wm_op_light">浅 (10%)</option><option value="0.25" selected data-i18n="wm_op_medium">中 (25%)</option><option value="0.5" data-i18n="wm_op_dark">深 (50%)</option></select></div>`;break;
    case 'reorderPages':h=`<h4 data-i18n="reorder_label">新页面顺序</h4><div class="ol" data-i18n="reorder_hint">用页码列表表示新顺序，支持倒序区间：</div><input type="text" id="newOrder" class="wid" data-i18n-placeholder="reorder_placeholder" placeholder="如 2,1,3 或 3-1,2">`;break;
    case 'jsonFormat':
      h=`<div class="jsonwrap">
        <div class="jsoncol"><h4 data-i18n="json_input_label">输入 JSON</h4>
          <textarea id="jsonInput" data-i18n-placeholder="json_placeholder" placeholder='粘贴 JSON 文本，或从日志里复制的转义串'></textarea></div>
        <div class="jsoncol"><h4 data-i18n="json_output_label">输出结果</h4>
          <textarea id="jsonOut" readonly placeholder=""></textarea></div>
      </div>
        <div class="or" style="margin-top:8px"><label data-i18n="json_indent_label">缩进：</label>
          <select id="jsonIndent"><option value="2" selected>2</option><option value="4">4</option><option value="\t">Tab</option></select></div>
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-p" onclick="jsonPretty()" style="width:auto;flex:1" data-i18n="json_pretty">格式化</button>
          <button class="btn btn-s" onclick="jsonMinify()" style="width:auto;flex:1" data-i18n="json_minify" title="去掉所有空格和换行，压成一行">压缩（一行）</button>
          <button class="btn btn-s" onclick="jsonValidate()" style="width:auto;flex:1" data-i18n="json_validate">校验</button>
          <button class="btn btn-s" onclick="jsonEscape()" style="width:auto;flex:1" data-i18n="json_escape">转义</button>
          <button class="btn btn-s" onclick="jsonUnescape()" style="width:auto;flex:1" data-i18n="json_unescape">去转义</button>
        </div>
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-s" onclick="jsonCopy()" style="width:auto;flex:1" data-i18n="json_copy">复制结果</button>
          <button class="btn btn-s" onclick="jsonClear()" style="width:auto;flex:1" data-i18n="json_clear">清空</button>
        </div>`;break;
    case 'hashGen':
      h=`<h4 data-i18n="hash_input_label">输入文本</h4>
        <textarea id="hashInput" class="wid" rows="3" data-i18n-placeholder="hash_placeholder" placeholder="输入要计算哈希的文本" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="or" style="margin-top:8px"><label data-i18n="hash_algo_label">算法：</label>
        <select id="hashAlgo"><option value="SHA-1">SHA-1</option><option value="SHA-256" selected>SHA-256</option><option value="SHA-512">SHA-512</option></select>
        <button class="btn btn-p" onclick="calcHash()" style="width:auto" data-i18n="hash_calc">计算</button></div>`;break;
    case 'timestamp':
      h=`<h4 data-i18n="ts_input_label">时间戳或日期</h4>
        <input type="text" id="tsInput" class="wid" data-i18n-placeholder="ts_placeholder" placeholder="如 1790000000、1790000000000 或 2026-01-01 12:00:00">
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="tsConvert()" style="width:auto;flex:1" data-i18n="ts_convert">转换</button><button class="btn btn-s" onclick="tsNow()" style="width:auto;flex:1" data-i18n="ts_now">取当前时间戳</button></div>`;break;
    case 'passwordGen':
      h=`<h4 data-i18n="pwd_settings">密码选项</h4>
        <div class="or"><label data-i18n="pwd_len_label">长度：</label><input type="number" id="pwdLen" value="16" min="4" max="128" style="width:70px"></div>
        <div class="or"><label><input type="checkbox" id="pwdUpper" checked> A-Z</label><label><input type="checkbox" id="pwdLower" checked> a-z</label><label><input type="checkbox" id="pwdDigit" checked> 0-9</label><label><input type="checkbox" id="pwdSymbol" checked> !@#$%^&*</label></div>
        <button class="btn btn-p" onclick="genPassword()" style="margin-top:8px" data-i18n="pwd_generate">生成密码</button>`;break;
    case 'uuidGen':
      h=`<h4 data-i18n="uuid_settings">UUID 选项</h4>
        <div class="or"><label data-i18n="uuid_count_label">数量：</label><input type="number" id="uuidCount" value="5" min="1" max="100" style="width:70px">
        <label><input type="checkbox" id="uuidUpper"> <span data-i18n="uuid_upper">大写</span></label></div>
        <button class="btn btn-p" onclick="genUuids()" style="margin-top:8px" data-i18n="uuid_generate">生成 UUID</button>`;break;
    case 'textDiff':
      h=`<div class="jsonwrap">
        <div class="jsoncol"><h4 data-i18n="diff_left_label">文本 A（原）</h4>
          <textarea id="diffA" data-i18n-placeholder="diff_a_placeholder" placeholder="粘贴原文本"></textarea></div>
        <div class="jsoncol"><h4 data-i18n="diff_right_label">文本 B（新）</h4>
          <textarea id="diffB" data-i18n-placeholder="diff_b_placeholder" placeholder="粘贴新文本"></textarea></div>
      </div>
        <button class="btn btn-p" onclick="diffTexts()" style="margin-top:8px" data-i18n="diff_compare">比对差异</button>`;break;
    case 'wordCount':
      h=`<h4 data-i18n="wc_input_label">输入文本</h4>
        <textarea id="wcInput" class="wid" rows="8" placeholder="" oninput="wcUpdate()" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="op" style="margin-top:10px;font-size:14px" id="wcResult"></div>`;break;
    case 'caseConvert':
      h=`<h4 data-i18n="case_input_label">输入标识符/文本</h4>
        <input type="text" id="caseInput" class="wid" data-i18n-placeholder="case_placeholder" placeholder="如 userName / user_name / user-name" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px">
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-s" onclick="caseTo('camel')" style="width:auto;flex:1" data-i18n="case_camel">驼峰式</button>
          <button class="btn btn-s" onclick="caseTo('pascal')" style="width:auto;flex:1" data-i18n="case_pascal">大驼峰</button>
          <button class="btn btn-s" onclick="caseTo('snake')" style="width:auto;flex:1" data-i18n="case_snake">下划线</button>
        </div>
        <div class="btng">
          <button class="btn btn-s" onclick="caseTo('kebab')" style="width:auto;flex:1" data-i18n="case_kebab">短横线</button>
          <button class="btn btn-s" onclick="caseTo('const')" style="width:auto;flex:1" data-i18n="case_const">常量式</button>
          <button class="btn btn-s" onclick="caseTo('title')" style="width:auto;flex:1" data-i18n="case_title">标题式</button>
        </div>`;break;
    case 'baseConvert':
      h=`<h4 data-i18n="base_input_label">输入数值</h4>
        <div class="or" style="margin-top:6px">
          <select id="baseFrom"><option value="10" selected data-i18n="base_dec">十进制</option><option value="2" data-i18n="base_bin">二进制</option><option value="8" data-i18n="base_oct">八进制</option><option value="16" data-i18n="base_hex">十六进制</option></select>
          <input type="text" id="baseInput" class="wid" data-i18n-placeholder="base_placeholder" placeholder="如 255 或 FF" style="flex:1">
          <button class="btn btn-p" onclick="baseConvert()" style="width:auto" data-i18n="base_convert">转换</button>
        </div>`;break;
    case 'urlParams':
      h=`<h4 data-i18n="up_input_label">输入 URL 或查询串</h4>
        <input type="text" id="upInput" class="wid" data-i18n-placeholder="up_placeholder" placeholder="https://a.com/p?x=1&y=hello%20world 或 x=1&y=2" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px">
        <button class="btn btn-p" onclick="parseUrlParams()" style="margin-top:8px" data-i18n="up_parse">解析</button>`;break;
    case 'textClean':
      h=`<h4 data-i18n="tc_input_label">输入文本（每行一项）</h4>
        <textarea id="tcInput" rows="6" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace;width:100%;box-sizing:border-box"></textarea>
        <div class="or" style="margin-top:8px"><label><input type="checkbox" id="tcDedupe" checked> <span data-i18n="tc_dedupe">去重</span></label>
        <label><input type="checkbox" id="tcTrim" checked> <span data-i18n="tc_trim">去首尾空格</span></label>
        <label><input type="checkbox" id="tcNoEmpty" checked> <span data-i18n="tc_noempty">去空行</span></label></div>
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-p" onclick="textCleanRun('none')" style="width:auto;flex:1" data-i18n="tc_apply">仅清理</button>
          <button class="btn btn-s" onclick="textCleanRun('asc')" style="width:auto;flex:1" data-i18n="tc_sort_asc">排序 A→Z</button>
          <button class="btn btn-s" onclick="textCleanRun('desc')" style="width:auto;flex:1" data-i18n="tc_sort_desc">排序 Z→A</button>
          <button class="btn btn-s" onclick="textCleanRun('shuffle')" style="width:auto;flex:1" data-i18n="tc_shuffle">打乱</button>
        </div>`;break;
    case 'pdfToImage':h=`<h4 data-i18n="pdf2img_format">输出格式</h4><div class="or"><select id="imgFmt" style="width:50%"><option value="jpeg">JPG</option><option value="png">PNG</option></select><label data-i18n="pdf2img_quality">质量：</label><input type="number" id="imgQ" value="90" min="10" max="100" style="width:50px"><span>%</span></div>`;break;
    case 'imgCompress':
      h=`<h4 data-i18n="imgcomp_quality">压缩质量</h4>
        <div class="ol" data-i18n="imgcomp_target">目标质量：</div>
        <div class="or"><input type="range" id="compQ" min="10" max="100" value="80" style="width:70%" oninput="document.getElementById('compQLabel').textContent=this.value+'%'"><span id="compQLabel" style="font-size:13px;width:28%;text-align:right">80%</span></div>
        <div class="ol" style="margin-top:8px" data-i18n="imgcomp_format">输出格式：</div>
        <div class="or"><select id="outFmt" class="wid"><option value="jpeg" selected data-i18n="imgcomp_jpg_small">JPG（体积小）</option><option value="png" data-i18n="imgcomp_png_quality">PNG（质量高）</option></select></div>`;break;
    case 'imgResize':
      h=`<h4 data-i18n="imgresize_size">调整尺寸</h4>
        <div class="or"><label data-i18n="imgresize_width">宽度：</label><input type="number" id="newW" data-i18n-placeholder="imgresize_w_placeholder" placeholder="像素" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span><label style="margin-left:16px" data-i18n="imgresize_height">高度：</label><input type="number" id="newH" data-i18n-placeholder="imgresize_h_placeholder" placeholder="自动" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span></div>
        <div class="or"><label><input type="checkbox" id="keepRatio" checked onchange="document.getElementById('newH').disabled=this.checked" data-i18n="imgresize_keep_ratio">保持宽高比</label></div>`;break;
    case 'imgConvert':h=`<h4 data-i18n="imgconv_format">输出格式</h4><div class="or"><select id="convFmt" class="wid"><option value="jpeg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option></select></div>`;break;
    case 'gifMaker':
      h=`<h4 data-i18n="gif_settings">GIF 设置</h4>
        <div class="or"><label data-i18n="gif_delay">帧间隔：</label><input type="number" id="gifDelay" value="500" min="50" max="2000" style="width:70px"><span style="color:var(--tl);font-size:13px">ms</span><label style="margin-left:16px" data-i18n="gif_width">宽：</label><input type="number" id="gifW" value="400" min="50" max="1000" style="width:70px"><span style="color:var(--tl);font-size:13px">px</span></div>`;break;
    case 'qrCode':
      h=`<h4 data-i18n="qr_input">输入内容</h4><textarea id="qrInput" class="wid" rows="3" data-i18n-placeholder="qr_placeholder" placeholder="输入文字或网址，如 https://example.com" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="ol" style="margin-top:8px" data-i18n="qr_size_label">二维码大小：</div>
        <div class="or"><input type="range" id="qrSize" min="100" max="500" value="250" style="width:70%" oninput="document.getElementById('qrSizeLabel').textContent=this.value+'px'"><span id="qrSizeLabel" style="font-size:13px;width:28%;text-align:right">250px</span></div>
        <button class="btn btn-p" onclick="generateQR()" style="margin-top:8px" data-i18n="qr_generate">生成二维码</button>`;break;
    case 'base64':
      h=`<h4 data-i18n="b64_input">输入文本</h4><textarea id="b64Input" class="wid" rows="3" data-i18n-placeholder="b64_placeholder" placeholder="输入要编码或解码的文本" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="base64Enc()" style="width:auto;flex:1" data-i18n="b64_encode">编码 →</button><button class="btn btn-s" onclick="base64Dec()" style="width:auto;flex:1" data-i18n="b64_decode">← 解码</button></div>`;break;
    case 'urlEncode':
      h=`<h4 data-i18n="url_input">输入 URL</h4><textarea id="urlInput" class="wid" rows="3" data-i18n-placeholder="url_placeholder" placeholder="输入要编码或解码的 URL" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="urlEnc()" style="width:auto;flex:1" data-i18n="url_encode">编码 →</button><button class="btn btn-s" onclick="urlDec()" style="width:auto;flex:1" data-i18n="url_decode">← 解码</button></div>`;break;
    case 'colorConvert':
      h=`<h4 data-i18n="color_input">输入颜色值</h4><input type="text" id="colorIn" class="wid" data-i18n-placeholder="color_placeholder" placeholder="输入颜色值，如 #2563eb 或 rgb(37,99,235)" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px">
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="convertColor()" style="width:auto;flex:1" data-i18n="color_convert">转换</button></div>
        <div id="colorResult" style="margin-top:10px;display:none">
          <div style="width:60px;height:60px;border-radius:8px;border:1px solid var(--b);margin-bottom:8px" id="colorPreview"></div>
          <div style="font-size:13px;color:var(--tl);white-space:pre-wrap" id="colorOutput"></div>
        </div>`;break;
  }
  p.innerHTML=h;
}

function ts(){const t=document.querySelector('input[name="st"]:checked').value;document.getElementById('rangeRow').style.display=t==='ranges'?'block':'none';document.getElementById('everyRow').style.display=t==='every'?'block':'none';}

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

// Color converter
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

// QR Code using qrcode-generator (real, scannable QR)
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

// JSON formatter (input left / output right)
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
  const m=/position (\d+)/.exec(e.message||'');
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

// Hash generator (Web Crypto)
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

// Timestamp converter
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

// Password generator
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

// UUID generator
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

// Word count (live) — 纯文本输出
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

// Case converter
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

// Base converter
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

// URL params parser
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

// Text dedupe & sort
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

// Process tool
async function processTool(){
  hideError();hideResult();hideTextOutput();
  const btn=document.getElementById('pbBtn');
  btn.disabled=true;btn.textContent=I18N[currentLang].processing;
  setProgress(10);
  try{
    switch(ct){
      case 'merge':await mergePDFs();break;
      case 'split':await splitPDF();break;
      case 'compress':await compressPDF();break;
      case 'rotate':await rotatePDF();break;
      case 'deletePages':await deletePDFPages();break;
      case 'pdfToImage':await pdfToImages();break;
      case 'imageToPdf':await imagesToPDF();break;
      case 'extractText':await extractText();break;
      case 'unlockPdf':await unlockPDF();break;
      case 'imgCompress':await compressImages();break;
      case 'imgResize':await resizeImages();break;
      case 'imgConvert':await convertImages();break;
      case 'gifMaker':await makeGif();break;
      case 'watermark':await watermarkPDF();break;
      case 'reorderPages':await reorderPDFPages();break;
    }
  }catch(e){showError(I18N[currentLang].err_process_failed+e.message);console.error(e);}
  finally{btn.disabled=false;btn.textContent=I18N[currentLang].btn_start;resetProgress();}
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

function loadImg(file){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=reject;
    img.src=URL.createObjectURL(file);
  });
}
