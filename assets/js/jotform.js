function FrameBuilder(formId, appendTo, initialHeight, iframeCode, title) {
    this.formId = formId;
    this.initialHeight = initialHeight;
    this.iframeCode = iframeCode;
    this.frame = null;
    this.timeInterval = 200;
    this.appendTo = appendTo || false;
    this.formSubmitted = 0;
    this.init = function() { this.createFrame();
        this.addFrameContent(this.iframeCode); };
    this.createFrame = function() {
        var tmp_is_ie = !!window.ActiveXObject;
        var htmlCode = "<" + "iframe title=\"" + title.replace(/[\\"']/g, '\\$&').replace(/&amp;/g, '&') + "\" onload=\"window.parent.scrollTo(0,0)\" src=\"\" allowtransparency=\"true\" name=\"" + this.formId + "\" id=\"" + this.formId + "\" style=\"width:100%; overflow: hidden; height:" + this.initialHeight + "px; border:none;\" scrolling=\"no\"></if" + "rame>";
        if (this.appendTo === false) { document.write(htmlCode); } else {
            var tmp = document.createElement('div');
            tmp.innerHTML = htmlCode;
            var a = this.appendTo;
            document.getElementById(a).appendChild(tmp.firstChild); }
        this.frame = document.getElementById(this.formId);
        if (tmp_is_ie === true) {
            try {
                var iframe = this.frame;
                var doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow.document || iframe.document);
                doc.open();
                doc.write(""); } catch (err) { this.frame.src = "javascript:void((function(){document.open();document.domain=\'" + this.getBaseDomain() + "\';document.close();})())"; }
        }
        this.addEvent(this.frame, 'load', this.bindMethod(this.setTimer, this));
        var self = this;
        if (window.chrome !== undefined) { this.frame.onload = function() {
                try {
                    var doc = this.contentWindow.document;
                    var _jotform = this.contentWindow.JotForm;
                    if (doc !== undefined) {
                        var form = doc.getElementById("" + self.formId);
                        self.addEvent(form, "submit", function() {
                            if (_jotform.validateAll()) { self.formSubmitted = 1; } }); } } catch (e) {} } }
    };
    this.addEvent = function(obj, type, fn) {
        if (obj.attachEvent) { obj["e" + type + fn] = fn;
            obj[type + fn] = function() { obj["e" + type + fn](window.event); };
            obj.attachEvent("on" + type, obj[type + fn]); } else { obj.addEventListener(type, fn, false); }
    };
    this.addFrameContent = function(string) {
        string = string.replace(new RegExp('src\\=\\"[^"]*captcha.php\"><\/scr' + 'ipt>', 'gim'), 'src="http://api.recaptcha.net/js/recaptcha_ajax.js"></scr' + 'ipt><' + 'div id="recaptcha_div"><' + '/div>' + '<' + 'style>#recaptcha_logo{ display:none;} #recaptcha_tagline{display:none;} #recaptcha_table{border:none !important;} .recaptchatable .recaptcha_image_cell, #recaptcha_table{ background-color:transparent !important; } <' + '/style>' + '<' + 'script defer="defer"> window.onload = function(){ Recaptcha.create("6Ld9UAgAAAAAAMon8zjt30tEZiGQZ4IIuWXLt1ky", "recaptcha_div", {theme: "clean",tabindex: 0,callback: function (){' + 'if (document.getElementById("uword")) { document.getElementById("uword").parentNode.removeChild(document.getElementById("uword")); } if (window["validate"] !== undefined) { if (document.getElementById("recaptcha_response_field")){ document.getElementById("recaptcha_response_field").onblur = function(){ validate(document.getElementById("recaptcha_response_field"), "Required"); } } } if (document.getElementById("recaptcha_response_field")){ document.getElementsByName("recaptcha_challenge_field")[0].setAttribute("name", "anum"); } if (document.getElementById("recaptcha_response_field")){ document.getElementsByName("recaptcha_response_field")[0].setAttribute("name", "qCap"); }}})' + ' }<' + '/script>');
        string = string.replace(/(type="text\/javascript">)\s+(validate\(\"[^"]*"\);)/, '$1 jTime = setInterval(function(){if("validate" in window){$2clearTimeout(jTime);}}, 1000);');
        if (string.match('#sublabel_litemode')) { string = string.replace('class="form-all"', 'class="form-all" style="margin-top:0;"'); }
        var iframe = this.frame;
        var doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow.document || iframe.document);
        doc.open();
        doc.write(string);
        setTimeout(function() { doc.close();
            try {
                if ('JotFormFrameLoaded' in window) { JotFormFrameLoaded(); } } catch (e) { console.log("error on frame loading", e); } }, 200);
    };
    this.setTimer = function() {
        var self = this;
        this.interval = setTimeout(function() { self.changeHeight(); }, this.timeInterval); };
    this.getBaseDomain = function() {
        var thn = window.location.hostname;
        var cc = 0;
        var buff = "";
        for (var i = 0; i < thn.length; i++) {
            var chr = thn.charAt(i);
            if (chr == ".") { cc++; }
            if (cc == 0) { buff += chr; }
        }
        if (cc == 2) { thn = thn.replace(buff + ".", ""); }
        return thn;
    }
    this.changeHeight = function() {
        var actualHeight = this.getBodyHeight();
        var currentHeight = this.getViewPortHeight();
        if (actualHeight === undefined) { this.frame.style.height = this.frameHeight;
            if (!this.frame.style.minHeight) { this.frame.style.minHeight = "300px"; } } else if (Math.abs(actualHeight - currentHeight) > 18) { this.frame.style.height = (actualHeight) + "px"; }
        this.setTimer();
    };
    this.bindMethod = function(method, scope) {
        return function() { method.apply(scope, arguments); }; };
    this.frameHeight = 0;
    this.getBodyHeight = function() {
        if (this.formSubmitted === 1) {
            return; }
        var height;
        var scrollHeight;
        var offsetHeight;
        try {
            if (this.frame.contentWindow.document.height) {
                height = this.frame.contentWindow.document.height;
                if (this.frame.contentWindow.document.body.scrollHeight) { height = scrollHeight = this.frame.contentWindow.document.body.scrollHeight; }
                if (this.frame.contentWindow.document.body.offsetHeight) { height = offsetHeight = this.frame.contentWindow.document.body.offsetHeight; }
            } else if (this.frame.contentWindow.document.body) {
                var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                if (this.frame.contentWindow.document.body.scrollHeight) { height = scrollHeight = this.frame.contentWindow.document.body.scrollHeight; }
                if (isChrome) { height = scrollHeight = this.frame.contentWindow.document.height; }
                if (this.frame.contentWindow.document.body.offsetHeight) { height = offsetHeight = this.frame.contentWindow.document.body.offsetHeight; }
                if (scrollHeight && offsetHeight) { height = Math.max(scrollHeight, offsetHeight); }
            }
        } catch (e) {}
        this.frameHeight = height;
        return height;
    };
    this.getViewPortHeight = function() {
        if (this.formSubmitted === 1) {
            return; }
        var height = 0;
        try {
            if (this.frame.contentWindow.window.innerHeight) { height = this.frame.contentWindow.window.innerHeight - 18; } else if ((this.frame.contentWindow.document.documentElement) && (this.frame.contentWindow.document.documentElement.clientHeight)) { height = this.frame.contentWindow.document.documentElement.clientHeight; } else if ((this.frame.contentWindow.document.body) && (this.frame.contentWindow.document.body.clientHeight)) { height = this.frame.contentWindow.document.body.clientHeight; }
        } catch (e) {}
        return height;
    };
    this.init();
}
FrameBuilder.get = [];
var i41870198045862 = new FrameBuilder("41870198045862", false, "", "<!DOCTYPE HTML PUBLIC \"-\/\/W3C\/\/DTD HTML 4.01\/\/EN\" \"http:\/\/www.w3.org\/TR\/html4\/strict.dtd\">\n<html class=\"supernova\"><head>\n<meta http-equiv=\"Content-Type\" content=\"text\/html; charset=utf-8\" \/>\n<link rel=\"alternate\" type=\"application\/json+oembed\" href=\"https:\/\/www.jotform.com\/oembed\/?format=json&amp;url=http%3A%2F%2Fwww.jotform.com%2Fform%2F41870198045862\" title=\"oEmbed Form\"><link rel=\"alternate\" type=\"text\/xml+oembed\" href=\"https:\/\/www.jotform.com\/oembed\/?format=xml&amp;url=http%3A%2F%2Fwww.jotform.com%2Fform%2F41870198045862\" title=\"oEmbed Form\">\n<meta property=\"og:title\" content=\"Contact\" >\n<meta property=\"og:url\" content=\"http:\/\/www.jotform.co\/form\/41870198045862\" >\n<meta property=\"og:description\" content=\"Please click the link to complete this form.\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0\" \/>\n<meta name=\"HandheldFriendly\" content=\"true\" \/>\n<title>Contact<\/title>\n<link href=\"https:\/\/cdn.jotfor.ms\/static\/formCss.css?3.3.344\" rel=\"stylesheet\" type=\"text\/css\" \/>\n<link type=\"text\/css\" media=\"print\" rel=\"stylesheet\" href=\"https:\/\/cdn.jotfor.ms\/css\/printForm.css?3.3.344\" \/>\n<link type=\"text\/css\" rel=\"stylesheet\" href=\"https:\/\/cdn.jotfor.ms\/css\/styles\/nova.css?3.3.344\" \/>\n<link type=\"text\/css\" rel=\"stylesheet\" href=\"https:\/\/cdn.jotfor.ms\/themes\/CSS\/566a91c2977cdfcd478b4567.css?\"\/>\n<style type=\"text\/css\">\n    .form-label-left{\n        width:200px !important;\n    }\n    .form-line{\n        padding-top:12px;\n        padding-bottom:12px;\n    }\n    .form-label-right{\n        width:200px !important;\n    }\n    body, html{\n        margin:0;\n        padding:0;\n        background:#fff;\n    }\n\n    .form-all{\n        margin:0px auto;\n        padding-top:20px;\n        width:590px;\n        color:#555 !important;\n        font-family:\"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", Verdana, sans-serif;\n        font-size:14px;\n    }\n    .form-radio-item label, .form-checkbox-item label, .form-grading-label, .form-header{\n        color: #515151;\n    }\n\n<\/style>\n\n<style type=\"text\/css\" id=\"form-designer-style\">\n    \/* Injected CSS Code *\/\n\/*PREFERENCES STYLE*\/\n    .form-all {\n      font-family: Lucida Grande, sans-serif;\n    }\n    .form-all .qq-upload-button,\n    .form-all .form-submit-button,\n    .form-all .form-submit-reset,\n    .form-all .form-submit-print {\n      font-family: Lucida Grande, sans-serif;\n    }\n    .form-all .form-pagebreak-back-container,\n    .form-all .form-pagebreak-next-container {\n      font-family: Lucida Grande, sans-serif;\n    }\n    .form-header-group {\n      font-family: Lucida Grande, sans-serif;\n    }\n    .form-label {\n      font-family: Lucida Grande, sans-serif;\n    }\n  \n    .form-label.form-label-auto {\n      \n    display: block;\n    float: none;\n    text-align: left;\n    width: 100%;\n  \n    }\n  \n    .form-line {\n      margin-top: 12px 36px 12px 36px px;\n      margin-bottom: 12px 36px 12px 36px px;\n    }\n  \n    .form-all {\n      width: 590px;\n    }\n  \n    .form-label-left,\n    .form-label-right {\n      width: 200px\n    }\n  \n    .form-all {\n      font-size: 14px\n    }\n    .form-all .qq-upload-button,\n    .form-all .qq-upload-button,\n    .form-all .form-submit-button,\n    .form-all .form-submit-reset,\n    .form-all .form-submit-print {\n      font-size: 14px\n    }\n    .form-all .form-pagebreak-back-container,\n    .form-all .form-pagebreak-next-container {\n      font-size: 14px\n    }\n  \n    .supernova .form-all, .form-all {\n      background-color: #fff;\n      border: 1px solid transparent;\n    }\n  \n    .form-all {\n      color: #555;\n    }\n    .form-header-group .form-header {\n      color: #555;\n    }\n    .form-header-group .form-subHeader {\n      color: #555;\n    }\n    .form-label-top,\n    .form-label-left,\n    .form-label-right,\n    .form-html,\n    .form-checkbox-item label,\n    .form-radio-item label {\n      color: #555;\n    }\n    .form-sub-label {\n      color: #6f6f6f;\n    }\n  \n    .supernova {\n      background-color: undefined;\n    }\n    .supernova body {\n      background: transparent;\n    }\n  \n    .form-textbox,\n    .form-textarea,\n    .form-radio-other-input,\n    .form-checkbox-other-input,\n    .form-captcha input,\n    .form-spinner input {\n      background-color: undefined;\n    }\n  \n    .supernova {\n      background-image: none;\n    }\n    #stage {\n      background-image: none;\n    }\n  \n    .form-all {\n      background-image: none;\n    }\n  \n  .ie-8 .form-all:before { display: none; }\n  .ie-8 {\n    margin-top: auto;\n    margin-top: initial;\n  }\n  \/*PREFERENCES STYLE*\/\/*__INSPECT_SEPERATOR__*\/\n    \/* Injected CSS Code *\/\n<\/style>\n\n<link type=\"text\/css\" rel=\"stylesheet\" href=\"https:\/\/cdn.jotfor.ms\/css\/styles\/buttons\/form-submit-button-simple_white.css?3.3.344\"\/>\n<script src=\"https:\/\/cdn.jotfor.ms\/static\/prototype.forms.js\" type=\"text\/javascript\"><\/script>\n<script src=\"https:\/\/cdn.jotfor.ms\/static\/jotform.forms.js?3.3.344\" type=\"text\/javascript\"><\/script>\n<script type=\"text\/javascript\">\n var jsTime = setInterval(function(){try{\n   JotForm.jsForm = true;\n\n   JotForm.init(function(){\n      setTimeout(function() {\n          $('input_16').hint('ex: myname@example.com');\n       }, 20);\n      JotForm.highlightInputs = false;\n   });\n\n   clearInterval(jsTime);\n }catch(e){}}, 1000);\n\n   JotForm.prepareCalculationsOnTheFly([null,null,null,null,null,null,null,null,null,null,null,null,null,null,{\"name\":\"submit\",\"qid\":\"14\",\"text\":\"Send\",\"type\":\"control_button\"},{\"name\":\"name\",\"qid\":\"15\",\"text\":\"Name\",\"type\":\"control_fullname\"},{\"name\":\"email\",\"qid\":\"16\",\"text\":\"E-mail \",\"type\":\"control_email\"},{\"name\":\"yourMessage\",\"qid\":\"17\",\"text\":\"Your Message\",\"type\":\"control_textarea\"}]);<\/script>\n<\/head>\n<body>\n<form class=\"jotform-form\" action=\"https:\/\/submit.jotform.co\/submit\/41870198045862\/\" method=\"post\" name=\"form_41870198045862\" id=\"41870198045862\" accept-charset=\"utf-8\">\n  <input type=\"hidden\" name=\"formID\" value=\"41870198045862\" \/>\n  <div class=\"form-all\">\n    <ul class=\"form-section page-section\">\n      <li class=\"form-line jf-required\" data-type=\"control_fullname\" id=\"id_15\">\n        <label class=\"form-label form-label-top form-label-auto\" id=\"label_15\" for=\"input_15\">\n          Name\n          <span class=\"form-required\">\n            *\n          <\/span>\n        <\/label>\n        <div id=\"cid_15\" class=\"form-input-wide jf-required\">\n          <div data-wrapper-react=\"true\">\n            <span class=\"form-sub-label-container\" style=\"vertical-align:top;\">\n              <input type=\"text\" id=\"first_15\" name=\"q15_name[first]\" class=\"form-textbox validate[required]\" size=\"10\" value=\"\" data-component=\"first\" required=\"\" \/>\n              <label class=\"form-sub-label\" for=\"first_15\" id=\"sublabel_first\" style=\"min-height:13px;\"> First Name <\/label>\n            <\/span>\n            <span class=\"form-sub-label-container\" style=\"vertical-align:top;\">\n              <input type=\"text\" id=\"last_15\" name=\"q15_name[last]\" class=\"form-textbox validate[required]\" size=\"15\" value=\"\" data-component=\"last\" required=\"\" \/>\n              <label class=\"form-sub-label\" for=\"last_15\" id=\"sublabel_last\" style=\"min-height:13px;\"> Last Name <\/label>\n            <\/span>\n          <\/div>\n        <\/div>\n      <\/li>\n      <li class=\"form-line jf-required\" data-type=\"control_email\" id=\"id_16\">\n        <label class=\"form-label form-label-top form-label-auto\" id=\"label_16\" for=\"input_16\">\n          E-mail\n          <span class=\"form-required\">\n            *\n          <\/span>\n        <\/label>\n        <div id=\"cid_16\" class=\"form-input-wide jf-required\">\n          <input type=\"email\" id=\"input_16\" name=\"q16_email\" class=\"form-textbox validate[required, Email]\" size=\"32\" value=\"\" placeholder=\"ex: myname@example.com\" data-component=\"email\" required=\"\" \/>\n        <\/div>\n      <\/li>\n      <li class=\"form-line jf-required\" data-type=\"control_textarea\" id=\"id_17\">\n        <label class=\"form-label form-label-top form-label-auto\" id=\"label_17\" for=\"input_17\">\n          Your Message\n          <span class=\"form-required\">\n            *\n          <\/span>\n        <\/label>\n        <div id=\"cid_17\" class=\"form-input-wide jf-required\">\n          <textarea id=\"input_17\" class=\"form-textarea validate[required]\" name=\"q17_yourMessage\" cols=\"40\" rows=\"9\" data-component=\"textarea\" required=\"\"><\/textarea>\n        <\/div>\n      <\/li>\n      <li class=\"form-line\" data-type=\"control_button\" id=\"id_14\">\n        <div id=\"cid_14\" class=\"form-input-wide\">\n          <div style=\"text-align:center;\" class=\"form-buttons-wrapper\">\n            <button id=\"input_14\" type=\"submit\" class=\"form-submit-button form-submit-button-simple_white\" data-component=\"button\">\n              Send\n            <\/button>\n          <\/div>\n        <\/div>\n      <\/li>\n      <li style=\"display:none\">\n        Should be Empty:\n        <input type=\"text\" name=\"website\" value=\"\" \/>\n      <\/li>\n    <\/ul>\n  <\/div>\n  <input type=\"hidden\" id=\"simple_spc\" name=\"simple_spc\" value=\"41870198045862\" \/>\n  <script type=\"text\/javascript\">\n  document.getElementById(\"si\" + \"mple\" + \"_spc\").value = \"41870198045862-41870198045862\";\n  <\/script>\n<\/form><\/body>\n<\/html>\n", "padillla.github.io");
(function() {
    window.handleIFrameMessage = function(e) {
        var args = e.data.split(":");
        var iframe = document.getElementById("41870198045862");
        if (!iframe) {
            return };
        switch (args[0]) {
            case "scrollIntoView":
                if (!("nojump" in FrameBuilder.get)) { iframe.scrollIntoView(); }
                break;
            case "setHeight":
                iframe.style.height = args[1] + "px";
                break;
            case "collapseErrorPage":
                if (iframe.clientHeight > window.innerHeight) { iframe.style.height = window.innerHeight + "px"; }
                break;
            case "reloadPage":
                if (iframe) { location.reload(); }
                break;
            case "removeIframeOnloadAttr":
                iframe.removeAttribute("onload");
                break;
        }
    };
    if (window.addEventListener) { window.addEventListener("message", handleIFrameMessage, false); } else if (window.attachEvent) { window.attachEvent("onmessage", handleIFrameMessage); }
})();
