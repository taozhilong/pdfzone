// dev-tools.js — 开发者类工具:注册(选项面板模板)
// 选项模板集中在一个 switch 工厂里,由 core.js 的 buildOptions 调用
function devOptions(){
  switch(ct){
    case 'qrCode':
      return `<h4 data-i18n="qr_input">输入内容</h4><textarea id="qrInput" class="wid" rows="3" data-i18n-placeholder="qr_placeholder" placeholder="输入文字或网址，如 https://example.com" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="ol" style="margin-top:8px" data-i18n="qr_size_label">二维码大小：</div>
        <div class="or"><input type="range" id="qrSize" min="100" max="500" value="250" style="width:70%" oninput="document.getElementById('qrSizeLabel').textContent=this.value+'px'"><span id="qrSizeLabel" style="font-size:13px;width:28%;text-align:right">250px</span></div>
        <button class="btn btn-p" onclick="generateQR()" style="margin-top:8px" data-i18n="qr_generate">生成二维码</button>`;
    case 'base64':
      return `<h4 data-i18n="b64_input">输入文本</h4><textarea id="b64Input" class="wid" rows="3" data-i18n-placeholder="b64_placeholder" placeholder="输入要编码或解码的文本" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="base64Enc()" style="width:auto;flex:1" data-i18n="b64_encode">编码 →</button><button class="btn btn-s" onclick="base64Dec()" style="width:auto;flex:1" data-i18n="b64_decode">← 解码</button></div>`;
    case 'urlEncode':
      return `<h4 data-i18n="url_input">输入 URL</h4><textarea id="urlInput" class="wid" rows="3" data-i18n-placeholder="url_placeholder" placeholder="输入要编码或解码的 URL" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="urlEnc()" style="width:auto;flex:1" data-i18n="url_encode">编码 →</button><button class="btn btn-s" onclick="urlDec()" style="width:auto;flex:1" data-i18n="url_decode">← 解码</button></div>`;
    case 'colorConvert':
      return `<h4 data-i18n="color_input">输入颜色值</h4><input type="text" id="colorIn" class="wid" data-i18n-placeholder="color_placeholder" placeholder="输入颜色值，如 #2563eb 或 rgb(37,99,235)" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px">
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="convertColor()" style="width:auto;flex:1" data-i18n="color_convert">转换</button></div>
        <div id="colorResult" style="margin-top:10px;display:none">
          <div style="width:60px;height:60px;border-radius:8px;border:1px solid var(--b);margin-bottom:8px" id="colorPreview"></div>
          <div style="font-size:13px;color:var(--tl);white-space:pre-wrap" id="colorOutput"></div>
        </div>`;
    case 'jsonFormat':
      return `<div class="jsonwrap">
        <div class="jsoncol"><h4 data-i18n="json_input_label">输入 JSON</h4>
          <textarea id="jsonInput" data-i18n-placeholder="json_placeholder" placeholder='粘贴 JSON 文本，或从日志里复制的转义串'></textarea></div>
        <div class="jsoncol"><h4 data-i18n="json_output_label">输出结果</h4>
          <textarea id="jsonOut" readonly placeholder=""></textarea></div>
      </div>
        <div class="or" style="margin-top:8px"><label data-i18n="json_indent_label">缩进：</label>
          <select id="jsonIndent"><option value="2" selected>2</option><option value="4">4</option><option value="\\t">Tab</option></select></div>
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
        </div>`;
    case 'hashGen':
      return `<h4 data-i18n="hash_input_label">输入文本</h4>
        <textarea id="hashInput" class="wid" rows="3" data-i18n-placeholder="hash_placeholder" placeholder="输入要计算哈希的文本" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="or" style="margin-top:8px"><label data-i18n="hash_algo_label">算法：</label>
        <select id="hashAlgo"><option value="SHA-1">SHA-1</option><option value="SHA-256" selected>SHA-256</option><option value="SHA-512">SHA-512</option></select>
        <button class="btn btn-p" onclick="calcHash()" style="width:auto" data-i18n="hash_calc">计算</button></div>`;
    case 'timestamp':
      return `<h4 data-i18n="ts_input_label">时间戳或日期</h4>
        <input type="text" id="tsInput" class="wid" data-i18n-placeholder="ts_placeholder" placeholder="如 1790000000、1790000000000 或 2026-01-01 12:00:00">
        <div class="btng" style="margin-top:8px"><button class="btn btn-p" onclick="tsConvert()" style="width:auto;flex:1" data-i18n="ts_convert">转换</button><button class="btn btn-s" onclick="tsNow()" style="width:auto;flex:1" data-i18n="ts_now">取当前时间戳</button></div>`;
    case 'passwordGen':
      return `<h4 data-i18n="pwd_settings">密码选项</h4>
        <div class="or"><label data-i18n="pwd_len_label">长度：</label><input type="number" id="pwdLen" value="16" min="4" max="128" style="width:70px"></div>
        <div class="or"><label><input type="checkbox" id="pwdUpper" checked> A-Z</label><label><input type="checkbox" id="pwdLower" checked> a-z</label><label><input type="checkbox" id="pwdDigit" checked> 0-9</label><label><input type="checkbox" id="pwdSymbol" checked> !@#$%^&*</label></div>
        <button class="btn btn-p" onclick="genPassword()" style="margin-top:8px" data-i18n="pwd_generate">生成密码</button>`;
    case 'uuidGen':
      return `<h4 data-i18n="uuid_settings">UUID 选项</h4>
        <div class="or"><label data-i18n="uuid_count_label">数量：</label><input type="number" id="uuidCount" value="5" min="1" max="100" style="width:70px">
        <label><input type="checkbox" id="uuidUpper"> <span data-i18n="uuid_upper">大写</span></label></div>
        <button class="btn btn-p" onclick="genUuids()" style="margin-top:8px" data-i18n="uuid_generate">生成 UUID</button>`;
    case 'textDiff':
      return `<div class="jsonwrap">
        <div class="jsoncol"><h4 data-i18n="diff_left_label">文本 A（原）</h4>
          <textarea id="diffA" data-i18n-placeholder="diff_a_placeholder" placeholder="粘贴原文本"></textarea></div>
        <div class="jsoncol"><h4 data-i18n="diff_right_label">文本 B（新）</h4>
          <textarea id="diffB" data-i18n-placeholder="diff_b_placeholder" placeholder="粘贴新文本"></textarea></div>
      </div>
        <button class="btn btn-p" onclick="diffTexts()" style="margin-top:8px" data-i18n="diff_compare">比对差异</button>`;
    case 'wordCount':
      return `<h4 data-i18n="wc_input_label">输入文本</h4>
        <textarea id="wcInput" class="wid" rows="8" placeholder="" oninput="wcUpdate()" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:inherit"></textarea>
        <div class="op" style="margin-top:10px;font-size:14px" id="wcResult"></div>`;
    case 'caseConvert':
      return `<h4 data-i18n="case_input_label">输入标识符/文本</h4>
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
        </div>`;
    case 'baseConvert':
      return `<h4 data-i18n="base_input_label">输入数值</h4>
        <div class="or" style="margin-top:6px">
          <select id="baseFrom"><option value="10" selected data-i18n="base_dec">十进制</option><option value="2" data-i18n="base_bin">二进制</option><option value="8" data-i18n="base_oct">八进制</option><option value="16" data-i18n="base_hex">十六进制</option></select>
          <input type="text" id="baseInput" class="wid" data-i18n-placeholder="base_placeholder" placeholder="如 255 或 FF" style="flex:1">
          <button class="btn btn-p" onclick="baseConvert()" style="width:auto" data-i18n="base_convert">转换</button>
        </div>`;
    case 'urlParams':
      return `<h4 data-i18n="up_input_label">输入 URL 或查询串</h4>
        <input type="text" id="upInput" class="wid" data-i18n-placeholder="up_placeholder" placeholder="https://a.com/p?x=1&y=hello%20world 或 x=1&y=2" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px">
        <button class="btn btn-p" onclick="parseUrlParams()" style="margin-top:8px" data-i18n="up_parse">解析</button>`;
    case 'textClean':
      return `<h4 data-i18n="tc_input_label">输入文本（每行一项）</h4>
        <textarea id="tcInput" rows="6" style="padding:8px;border:1px solid var(--b);border-radius:8px;font-size:13px;resize:vertical;font-family:monospace;width:100%;box-sizing:border-box"></textarea>
        <div class="or" style="margin-top:8px"><label><input type="checkbox" id="tcDedupe" checked> <span data-i18n="tc_dedupe">去重</span></label>
        <label><input type="checkbox" id="tcTrim" checked> <span data-i18n="tc_trim">去首尾空格</span></label>
        <label><input type="checkbox" id="tcNoEmpty" checked> <span data-i18n="tc_noempty">去空行</span></label></div>
        <div class="btng" style="margin-top:8px">
          <button class="btn btn-p" onclick="textCleanRun('none')" style="width:auto;flex:1" data-i18n="tc_apply">仅清理</button>
          <button class="btn btn-s" onclick="textCleanRun('asc')" style="width:auto;flex:1" data-i18n="tc_sort_asc">排序 A→Z</button>
          <button class="btn btn-s" onclick="textCleanRun('desc')" style="width:auto;flex:1" data-i18n="tc_sort_desc">排序 Z→A</button>
          <button class="btn btn-s" onclick="textCleanRun('shuffle')" style="width:auto;flex:1" data-i18n="tc_shuffle">打乱</button>
        </div>`;
  }
  return '';
}

defTool('qrCode',{title:{zh:'二维码生成',en:'QR Code Generator'},desc:{zh:'输入文字或链接，生成二维码图片',en:'Generate QR code from text/URL'},hint:{zh:'',en:''},accept:'',multi:false,icon:'📱',needsFiles:false},devOptions);
defTool('base64',{title:{zh:'Base64 编解码',en:'Base64 Encode/Decode'},desc:{zh:'文本与 Base64 字符串互转',en:'Convert between text and Base64'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔣',needsFiles:false},devOptions);
defTool('urlEncode',{title:{zh:'URL 编解码',en:'URL Encode/Decode'},desc:{zh:'URL 特殊字符编码与解码',en:'URL special character encoding and decoding'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔗',needsFiles:false},devOptions);
defTool('colorConvert',{title:{zh:'颜色转换',en:'Color Converter'},desc:{zh:'HEX / RGB / HSL 颜色值互转',en:'Convert between HEX / RGB / HSL'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🎨',needsFiles:false},devOptions);
defTool('jsonFormat',{title:{zh:'JSON 格式化',en:'JSON Formatter'},desc:{zh:'格式化/压缩/校验 JSON',en:'Format / minify / validate JSON'},hint:{zh:'',en:''},accept:'',multi:false,icon:'{ }',needsFiles:false},devOptions);
defTool('hashGen',{title:{zh:'Hash 生成',en:'Hash Generator'},desc:{zh:'生成 SHA-1 / SHA-256 / SHA-512',en:'Generate SHA-1 / SHA-256 / SHA-512'},hint:{zh:'',en:''},accept:'',multi:false,icon:'#️⃣',needsFiles:false},devOptions);
defTool('timestamp',{title:{zh:'时间戳转换',en:'Timestamp Converter'},desc:{zh:'Unix 时间戳与日期互转',en:'Convert Unix timestamp and datetime'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🕐',needsFiles:false},devOptions);
defTool('passwordGen',{title:{zh:'密码生成',en:'Password Generator'},desc:{zh:'随机生成强密码',en:'Generate random strong passwords'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔑',needsFiles:false},devOptions);
defTool('uuidGen',{title:{zh:'UUID 生成',en:'UUID Generator'},desc:{zh:'批量生成 UUID v4',en:'Generate UUID v4 in batch'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🆔',needsFiles:false},devOptions);
defTool('textDiff',{title:{zh:'内容比对',en:'Text Diff'},desc:{zh:'逐行比较两段文本的差异',en:'Compare two texts line by line'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔍',needsFiles:false},devOptions);
defTool('wordCount',{title:{zh:'字数统计',en:'Word Count'},desc:{zh:'字符/单词/行数统计',en:'Count characters, words and lines'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔢',needsFiles:false},devOptions);
defTool('caseConvert',{title:{zh:'命名转换',en:'Case Converter'},desc:{zh:'camelCase / snake_case 等互转',en:'Convert between naming conventions'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔤',needsFiles:false},devOptions);
defTool('baseConvert',{title:{zh:'进制转换',en:'Base Converter'},desc:{zh:'二/八/十/十六进制互转',en:'Convert between BIN/OCT/DEC/HEX'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🔟',needsFiles:false},devOptions);
defTool('urlParams',{title:{zh:'URL 参数解析',en:'URL Params Parser'},desc:{zh:'查询串拆成参数表格和 JSON',en:'Parse query string into table and JSON'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🧩',needsFiles:false},devOptions);
defTool('textClean',{title:{zh:'去重排序',en:'Dedupe & Sort'},desc:{zh:'文本行去重/排序/去空行',en:'Dedupe, sort, trim text lines'},hint:{zh:'',en:''},accept:'',multi:false,icon:'🧹',needsFiles:false},devOptions);
