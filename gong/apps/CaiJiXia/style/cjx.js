var CaiJiXiaApi = "//www.caijixia.cn";
typeof(cjxvar) == "undefined" && $(function() {
    if (typeof($["dialog"]) == "undefined") {
        $("body")["html"]("")
    };
    if (request("ac") == "setting" || request("ac") == "advcjx") {
        $["get"]("../Plugins/run.php?action=cjx&r=kw&" + Math["random"](), function(b) {
            if (opfhxoiuz(b) == false) {
                $("#nk")["show"]()
            } else {
                var a = encodeURIComponent(window["location"]["hostname"]);
                $["getJSON"](CaiJiXiaApi + "/?m=caijixia&a=check&dn=" + a + "&callback=?", function(c) {
                    if (c == true) {
                        $("#tk")["show"]()
                    }
                })
            }
        })
    };
    if (request("ac") == "setting" || request("ac") == "task") {
        if (!rgafdwehik("start_help")) {
            showhelp();
            dhgiufv("start_help", "1", 3600 * 24 * 30)
        }
    };
    if (request("ac") == "task") {
		$(".autocaiji")["addClass"]("turn");
		$(".autocaiji").show();
        $(".autocaiji .turn")["addClass"]("on");
        loadcjxlog(0);
        isawaycj = 0;
        $("#cjxprogress")["click"](function() {
            isawaycj++;
            if (isawaycj >= 5000) {
                $(this)["addClass"]("isawaycj")
            }
        })
    };
    if (request("ac") == "advanced" || request("ac") == "seo" || request("ac") == "search") {
       
        $("#tk")["show"]()
         
    };
    $("#form1")["submit"](function() {
        $("body")["prepend"]("<div class='cjxloading'> 正在保存，请稍后.. </div>");
        $["post"]("?ac=savesetting", $(this)["serialize"](), function(b) {
            if (b == "success") {
                $["dialog"]({
                    content: '<img src="apps/CaiJiXia/style/ico_true.png" align="absmiddle" />数据保存成功',
                    title: null,
                    time: 1000
                });
                $(".cjxloading")["remove"]()
            }
        });
        return false
    });

    $(".autocaiji .turn")["click"](function() {
        var e = this;
        if ($(e)["hasClass"]("on")) {
            $(e)["removeClass"]("on");
            
        } else {
            $(e)["addClass"]("on");
        }
    });
});
function loadcjxlog(e) {
    if (e == 0) {
        $["getJSON"]("?ac=cjxlog&" + Math["random"](), function(f) {
            __cjxlogDATA = f;
            loadcjxlogpage(0)
        })
    } else {
        loadcjxlogpage(e)
    }
}

function loadcjxlogpage(e) {
    if (__cjxlogDATA["num"] > 0) {
        var j = e * 20;
        var g = j + 20;
        var k = "<ul>";
        $["each"](__cjxlogDATA["data"], function(h, l) {
            if (h >= j && h < g) {
                l["msg"] = l["msg"]["replace"](/^[a-z]*\:\:/, "");
                k += "<li><span class='logtime'>" + l["addtime"] + "</span><span class='logmsg'>" + l["msg"] + "</span><span class='lognote'>" + l["note"] + "</span></li>"
            }
        });
        k += "</ul><div class='page'>";
        for (var h = 0; h < __cjxlogDATA["num"] / 20; h++) {
            currentClass = h == e ? "class='current'" : "";
            k += "<a href='###' onclick='loadcjxlog(" + h + ")' " + currentClass + ">" + (h + 1)["toString"]() + "</a>"
        };
        k += "</div>";
        $(".cjxlogbox")["html"](k)
    } else {
        $(".cjxlogbox")["html"]("暂无采集记录")
    }
}

function showhelp() {
    $["dialog"]({
        title: "新手帮助向导",
        content: "http://www.caijixia.net/demo/start.html",
        width: "840px",
        height: "95%",
        lock: true,
        closefn: function() {
            $["dialog"]({
                content: '<div style="padding:10px;"><font color=red>下次重新观看在 [基本设置] 右上角的帮助向导打开</font></div>',
                time: 3000,
                width: "300px"
            })
        }
    })
}

function avc(a, b) {
    if ($("#stainput")["attr"]("data") == 0) {
        $(b)["html"]("<font color=red>停止采集</font>")
    } else {
        $(b)["html"]("立即采集")
    };
    statask(a, 1)
}

function cjr(c) {
    if ($("#stainput")["attr"]("data") == 0) {
        return
    };
    if (typeof(cjx_w) == "undefined") {
        cjx_w = 1
    };
    $["ajax"]({
        type: "GET",
        url: c + "&r=" + Math["random"](),
        timeout: 15000,
        cache: false,
        success: function(d) {
            loadcjxlog(0);
            if (d["indexOf"]("finish::") !== -1) {
                d = d["replace"](/^[a-z]*\:\:/, "");
                $("#go")["html"](d);
                $("#now")["css"]("width", "100%");
                cjs();
                return
            };
            if (d["indexOf"]("#@__") !== -1) {
                $("#go")["html"]("<font color=red>系统发生错误</font>");
                $("#now")["css"]("width", "100%");
                cjs();
                return
            };
            d = d["replace"](/^[a-z]*\:\:/, "");
            $("#go")["html"](d);
            $("#now")["css"]("width", cjx_w["toString"]()/1000 + "%");
            cjx_w++;
            if (cjx_w > 100000) {
                if (isawaycj >= 5000) {
                    cjx_w = 1
                } else {
                    cjs();
                    return
                }
            };
            setTimeout(function() {
                cjr(c)
            }, 100)
        },
        error: function() {
            $("#go")["html"]("采集进行中...");
            $("#now")["css"]("width", cjx_w["toString"]()/1000 + "%");
            cjx_w++;
            if (cjx_w > 100000) {
                if (isawaycj >= 5000) {
                    cjx_w = 1
                } else {
                    cjs();
                    return
                }
            };
            cjr(c)
        }
    })
};
function cjs() {
    $("#stainput")["attr"]("data", 0);
    $("#stainput")["html"]("采集");
    $(".avcbtn")["html"]("立即采集");
    setTimeout(function() {
        $("#cjxprogress")["fadeOut"](2000, function() {
            cjx_w = 1;
            $("#now")["css"]("width", "0.001%");
            $["dialog"]({
                content: "测试采集结束，如果没采集到，请检查采集规则是否正确。",
                width: 400,
                title: null,
                time: 3000
            })
        })
    })
}

function request(g) {
    var i = new RegExp("(^|&)" + g + "=([^&]*)(&|$)", "i");
    var h = window["location"]["search"]["substr"](1)["match"](i);
    if (h != null) {
        return unescape(h[2])
    };
    return null
}

function statask(n, m) {
    if ($("#stainput")["attr"]("data") == 0) {
        $("#stainput")["attr"]("data", 1);
        $("#stainput")["html"]("<font color=red>停止采集</font>");
        $["get"]("../Plugins/run.php?action=cjx&r=kw&" + Math["random"](), function(b) {
            if (opfhxoiuz(b) == false) {
                if (m == 1) {
                    baseurl = "../Plugins/run.php?action=robot&donow=1&isadm=1&avc=1&id=" + n
                } else {
                    baseurl = "../Plugins/run.php?action=robot&donow=1&isadm=1&typeid=" + n
                }
            } else {
                if (m == 1) {
                    baseurl = "../Plugins/run.php?action=robot&avc=1&kw_g=1&kw_make=1&kw_slink=1&kw_seobody=1&kw_tforbid=1&kw_confu=1&kw_rant=1&donow=1&isadm=1&id=" + n
                } else {
                    baseurl = "../Plugins/run.php?action=robot&kw_g=1&kw_make=1&kw_slink=1&kw_seobody=1&kw_tforbid=1&kw_confu=1&kw_rant=1&donow=1&isadm=1&typeid=" + n
                }
            };
            $("#cjxprogress")["removeClass"]("isawaycj")["show"]();
            isawaycj = 0;
            $("#go")["html"]("");
            cjr(baseurl)
        })
    } else {
        cjs()
    }
}

function Showdialog(j, k) {
    if (k == 1) {
        alert("该栏目为关闭状态，无法修改关键词");
        return false
    };
    $("body")["prepend"]("<div class='cjxloading'> 正在加载，请稍后.. </div>");
    $["get"]("../Plugins/run.php?action=cjx&r=kw&" + Math["random"](), function(l) {
        $["get"]("?ac=gettask&typeid=" + j + "&t=" + Math["random"](), function(b) {
            $["dialog"]({
                title: "设置采集任务",
                content: b,
                width: "800px"
            });
            var c = opfhxoiuz(l);
            if (c == false) {
                $(".free")["html"]("<font color=red>(免费用户只能添加一个采集项目)</font>");
                $(".wxaddbtn")["after"]("<div style='color:red;'>免费版暂不支持微信采集功能</div>")["remove"]()
            } else {
                if (c == "t0") {
                    $(".free")["html"]("<font color=red>(高级用户可以添加20个采集项目，每行一个)</font>")
                }
            };
            $(".cjxloading")["remove"]()
        })
    })
}

function check() {
    $("body")["prepend"]("<div class='cjxloading'> 正在保存，请稍后.. </div>");
    var a = $("form[name='addform']");
    $["get"]("../Plugins/run.php?action=cjx&r=kw&" + Math["random"](), function(b) {
        var c = opfhxoiuz(b);
        if (c == false) {
            $("input[name='m']")["val"](1)
        } else {
            if (c == "t0") {
                $("input[name='m']")["val"](20)
            } else {
                $("input[name='m']")["val"](500)
            }
        };
        $["post"]("?ac=saveword", a["serialize"](), function(b) {
            $["dialog"]({
                content: "保存成功，正在重新加载..",
                title: null,
                time: 1000
            });
            setTimeout(function() {
                window["location"]["reload"]()
            }, 1000);
            $(".cjxloading")["remove"]()
        })
    });
    return false
}


function rgafdwehik(c) {
    if (document["cookie"]["length"] > 0) {
        c_start = document["cookie"]["indexOf"](c + "=");
        if (c_start != -1) {
            c_start = c_start + c["length"] + 1;
            c_end = document["cookie"]["indexOf"](";", c_start);
            if (c_end == -1) {
                c_end = document["cookie"]["length"]
            };
            return unescape(document["cookie"]["substring"](c_start, c_end))
        }
    };
    return null
}

function dhgiufv(c, f, e) {
    var d = new Date();
    d["setDate"](d["getDate"]() + e);
    document["cookie"] = c + "=" + escape(f) + ((e == null) ? "" : ";expires=" + d["toGMTString"]())
}

function opfhxoiuz(v) {
    return true;
}

function hex(g) {
    var k = "0123456789ABCDEF";
    h = "";
    for (j = 0; j <= 3; j++) {
        h += k["charAt"]((g >> (j * 8 + 4)) & 0x0F) + k["charAt"]((g >> (j * 8)) & 0x0F)
    };
    return h
}

function add(a, b) {
    return ((a & 0x7FFFFFFF) + (b & 0x7FFFFFFF)) ^ (a & 0x80000000) ^ (b & 0x80000000)
}

function R1(w, z, C, D, G, E, F) {
    q = add(add(w, (z & C) | (~z & D)), add(G, F));
    return add((q << E) | ((q >> (32 - E)) & (Math["pow"](2, E) - 1)), z)
}

function R2(w, z, C, D, G, E, F) {
    q = add(add(w, (z & D) | (C & ~D)), add(G, F));
    return add((q << E) | ((q >> (32 - E)) & (Math["pow"](2, E) - 1)), z)
}

function R3(w, z, C, D, G, E, F) {
    q = add(add(w, z ^ C ^ D), add(G, F));
    return add((q << E) | ((q >> (32 - E)) & (Math["pow"](2, E) - 1)), z)
}

function R4(w, z, C, D, G, E, F) {
    q = add(add(w, C ^ (z | ~D)), add(G, F));
    return add((q << E) | ((q >> (32 - E)) & (Math["pow"](2, E) - 1)), z)
};
function nu(){
	return true;
}
function dfssejoijh(f) {
    var e = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var e = e + "[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    wLen = (((f["length"] + 8) >> 6) + 1) << 4;
    var g = new Array(wLen);
    j = 4;
    for (i = 0;
        (i * 4) < f["length"]; i++) {
        g[i] = 0;
        for (j = 0;
            (j < 4) && ((j + i * 4) < f["length"]); j++) {
            g[i] += (e["indexOf"](f["charAt"]((i * 4) + j)) + 32) << (j * 8)
        }
    };
    if (j == 4) {
        g[i++] = 0x80
    } else {
        g[i - 1] += 0x80 << (j * 8)
    };
    for (; i < wLen; i++) {
        g[i] = 0
    };
    g[wLen - 2] = f["length"] * 8;
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;
    for (i = 0; i < wLen; i += 16) {
        aO = a;
        bO = b;
        cO = c;
        dO = d;
        a = R1(a, b, c, d, g[i + 0], 7, 0xd76aa478);
        d = R1(d, a, b, c, g[i + 1], 12, 0xe8c7b756);
        c = R1(c, d, a, b, g[i + 2], 17, 0x242070db);
        b = R1(b, c, d, a, g[i + 3], 22, 0xc1bdceee);
        a = R1(a, b, c, d, g[i + 4], 7, 0xf57c0faf);
        d = R1(d, a, b, c, g[i + 5], 12, 0x4787c62a);
        c = R1(c, d, a, b, g[i + 6], 17, 0xa8304613);
        b = R1(b, c, d, a, g[i + 7], 22, 0xfd469501);
        a = R1(a, b, c, d, g[i + 8], 7, 0x698098d8);
        d = R1(d, a, b, c, g[i + 9], 12, 0x8b44f7af);
        c = R1(c, d, a, b, g[i + 10], 17, 0xffff5bb1);
        b = R1(b, c, d, a, g[i + 11], 22, 0x895cd7be);
        a = R1(a, b, c, d, g[i + 12], 7, 0x6b901122);
        d = R1(d, a, b, c, g[i + 13], 12, 0xfd987193);
        c = R1(c, d, a, b, g[i + 14], 17, 0xa679438e);
        b = R1(b, c, d, a, g[i + 15], 22, 0x49b40821);
        a = R2(a, b, c, d, g[i + 1], 5, 0xf61e2562);
        d = R2(d, a, b, c, g[i + 6], 9, 0xc040b340);
        c = R2(c, d, a, b, g[i + 11], 14, 0x265e5a51);
        b = R2(b, c, d, a, g[i + 0], 20, 0xe9b6c7aa);
        a = R2(a, b, c, d, g[i + 5], 5, 0xd62f105d);
        d = R2(d, a, b, c, g[i + 10], 9, 0x2441453);
        c = R2(c, d, a, b, g[i + 15], 14, 0xd8a1e681);
        b = R2(b, c, d, a, g[i + 4], 20, 0xe7d3fbc8);
        a = R2(a, b, c, d, g[i + 9], 5, 0x21e1cde6);
        d = R2(d, a, b, c, g[i + 14], 9, 0xc33707d6);
        c = R2(c, d, a, b, g[i + 3], 14, 0xf4d50d87);
        b = R2(b, c, d, a, g[i + 8], 20, 0x455a14ed);
        a = R2(a, b, c, d, g[i + 13], 5, 0xa9e3e905);
        d = R2(d, a, b, c, g[i + 2], 9, 0xfcefa3f8);
        c = R2(c, d, a, b, g[i + 7], 14, 0x676f02d9);
        b = R2(b, c, d, a, g[i + 12], 20, 0x8d2a4c8a);
        a = R3(a, b, c, d, g[i + 5], 4, 0xfffa3942);
        d = R3(d, a, b, c, g[i + 8], 11, 0x8771f681);
        c = R3(c, d, a, b, g[i + 11], 16, 0x6d9d6122);
        b = R3(b, c, d, a, g[i + 14], 23, 0xfde5380c);
        a = R3(a, b, c, d, g[i + 1], 4, 0xa4beea44);
        d = R3(d, a, b, c, g[i + 4], 11, 0x4bdecfa9);
        c = R3(c, d, a, b, g[i + 7], 16, 0xf6bb4b60);
        b = R3(b, c, d, a, g[i + 10], 23, 0xbebfbc70);
        a = R3(a, b, c, d, g[i + 13], 4, 0x289b7ec6);
        d = R3(d, a, b, c, g[i + 0], 11, 0xeaa127fa);
        c = R3(c, d, a, b, g[i + 3], 16, 0xd4ef3085);
        b = R3(b, c, d, a, g[i + 6], 23, 0x4881d05);
        a = R3(a, b, c, d, g[i + 9], 4, 0xd9d4d039);
        d = R3(d, a, b, c, g[i + 12], 11, 0xe6db99e5);
        c = R3(c, d, a, b, g[i + 15], 16, 0x1fa27cf8);
        b = R3(b, c, d, a, g[i + 2], 23, 0xc4ac5665);
        a = R4(a, b, c, d, g[i + 0], 6, 0xf4292244);
        d = R4(d, a, b, c, g[i + 7], 10, 0x432aff97);
        c = R4(c, d, a, b, g[i + 14], 15, 0xab9423a7);
        b = R4(b, c, d, a, g[i + 5], 21, 0xfc93a039);
        a = R4(a, b, c, d, g[i + 12], 6, 0x655b59c3);
        d = R4(d, a, b, c, g[i + 3], 10, 0x8f0ccc92);
        c = R4(c, d, a, b, g[i + 10], 15, 0xffeff47d);
        b = R4(b, c, d, a, g[i + 1], 21, 0x85845dd1);
        a = R4(a, b, c, d, g[i + 8], 6, 0x6fa87e4f);
        d = R4(d, a, b, c, g[i + 15], 10, 0xfe2ce6e0);
        c = R4(c, d, a, b, g[i + 6], 15, 0xa3014314);
        b = R4(b, c, d, a, g[i + 13], 21, 0x4e0811a1);
        a = R4(a, b, c, d, g[i + 4], 6, 0xf7537e82);
        d = R4(d, a, b, c, g[i + 11], 10, 0xbd3af235);
        c = R4(c, d, a, b, g[i + 2], 15, 0x2ad7d2bb);
        b = R4(b, c, d, a, g[i + 9], 21, 0xeb86d391);
        a = add(a, aO);
        b = add(b, bO);
        c = add(c, cO);
        d = add(d, dO)
    };
    return hex(a) + hex(b) + hex(c) + hex(d)
}
var cjxvar = {
    version: "2.9.1"
}