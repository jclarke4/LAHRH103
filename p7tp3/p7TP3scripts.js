
/* 
 ================================================
 PVII Tab Panel Magic 3 scripts
 Copyright (c) 2014-2016 Project Seven Development
 www.projectseven.com
 Version: 3.2.5 -build 15
 ================================================
 
 */
// define the image swap file naming convention

// rollover image for any image in the normal state
var p7TP3over = '_over';

// image for any trigger that has an open panel -no rollover
var p7TP3open = '_down';

var p7TP3pp = {
	pauseText: 'Pause',
	playText: 'Play'
};
var p7TP3ctl = [], p7TP3i = false, p7TP3a = false, p7TP3adv = [];
function P7_TP3set(){
	var h, sh = '', hd, ie = P7_TP3getIEver();
	if (!document.getElementById) {
		return;
	}
	sh += 'body {overflow-y: scroll;}\n';
	if (ie > 0 && ie < 5.5) {
		sh += '.p7TP3cwrapper, .p7TP3cwrapper div {overflow: visible; height: 1%;}\n';
		sh += '.p7TP3tabs {display: none;}\n';
	} else {
		sh += '.p7TP3tabs_viewport {overflow:hidden;}\n';
		sh += '.p7TP3tabs_wrapper {position:relative;left:0px;}\n';
		sh += '.p7TP3_panel {width:100%;position:absolute;overflow:hidden;visibility:hidden;z-index:200;}\n';
		sh += '.p7TP3_vp {position:relative;overflow:hidden;padding:0;margin:0;}\n';
		sh += '.p7TP3_slide_panel_v {position:relative;}\n';
		sh += '.p7TP3_slide_panel_h {float:left;}\n';
		sh += '.p7TP3_slide_wrapper {position:relative;}\n';
		sh += '.p7TP3tabs_wrapper {text-align:left;}\n';
		sh += '.p7TP3tabs_wrapper.align-center {text-align:center;}\n';
		sh += '.p7TP3tabs_wrapper.align-right {text-align:right;}\n';
		sh += '.p7TP3tabs_wrapper ul {display:inline-block;vertical-align:bottom;}\n';
		sh += 'div.arrows_on a:link {z-index:400}\n';
	}
	if (ie > 5 && ie < 7) {
		sh += '.p7TP3tabs_viewport {float:left;}\n';
	}
	hd = document.head || document.getElementsByTagName('head')[0];
	h = document.createElement('style');
	h.type = 'text/css';
	if (h.styleSheet) {
		h.styleSheet.cssText = sh;
	} else {
		h.appendChild(document.createTextNode(sh));
	}
	hd.appendChild(h);
}

P7_TP3set();
function P7_opTP3(){
	if (!document.getElementById) {
		return;
	}
	p7TP3ctl[p7TP3ctl.length] = arguments;
}

function P7_TP3addLoad(){
	var ie = P7_TP3getIEver();
	if (!document.getElementById || (ie > 0 && ie < 5.5)) {
		return;
	}
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_initTP3, false);
		window.addEventListener("load", P7_initTP3, false);
		window.addEventListener("unload", P7_TP3rf, false);
		window.addEventListener("resize", P7_TP3rsz, false);
	} else if (document.addEventListener) {
		document.addEventListener("load", P7_initTP3, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_tp3 defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_tp3").onreadystatechange = function(){
			if (this.readyState == "complete") {
				if (p7TP3ctl.length > 0) {
					P7_initTP3();
				}
			}
		};
		window.attachEvent("onload", P7_initTP3);
		window.attachEvent("onresize", P7_TP3rsz);
	} else if (typeof window.onload == 'function') {
		var p7vloadit = onload;
		window.onload = function(){
			p7vloadit();
			P7_initTP3();
		};
	} else {
		window.onload = P7_initTP3;
	}
}

P7_TP3addLoad();
function P7_TP3rf(){
	return;
}

function P7_initTP3(){
	var i, j, jj, k, x, tB, tD, tA, tW, tV, tU, tP, tC, el, p, cV, ob, lD, iM, tSL, tSR, sr, fnA, fnB, swp, s1, s2, s3, sP, tch;
	if (p7TP3i) {
		return;
	}
	p7TP3i = true;
	document.p7TP3preload = [];
	tch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (navigator.msMaxTouchPoints || navigator.maxTouchPoints));
	for (j = p7TP3ctl.length - 1; j > -1; j--) {
		tB = document.getElementById(p7TP3ctl[j][0]);
		if (tB) {
			tB.p7opt = p7TP3ctl[j];
			P7_TP3tblfix(tB);
			cV = document.getElementById(tB.id.replace('_', 'cvp_'));
			tB.tp3Tabs = [];
			tB.tp3Panels = [];
			tB.tp3CurrentPanel = -1;
			tB.tp3TrigScroll = false;
			if (tB.p7opt[5] == 1) {
				if (tB.p7opt[3] > 2) {
					tB.p7opt[3] = 1;
				}
			}
			if (tch && tB.p7opt[3] > 0) {
				tB.p7opt[3] = 2;
				P7_TP3remClass(tB, 'v-slide');
			}
			if (tB.p7opt[3] == 1) {
				cV.style.height = '0px';
			}
			if (tB.p7opt[3] == 1 || tB.p7opt[3] == 2) {
				tB.tp3Slider = true;
				sP = document.getElementById(tB.id.replace('_', 'pw_'));
				sP.style.left = '0px';
				sP.style.top = '0px';
				sP.tp3VP = cV.id;
				sP.tp3Div = tB.id;
				for (i = 0; i < sP.childNodes.length; i++) {
					if (sP.childNodes[i].nodeType == 1) {
						if (tB.p7opt[3] == 1) {
							sP.childNodes[i].className = 'p7TP3_slide_panel_v';
						} else {
							sP.childNodes[i].style.width = cV.offsetWidth + 'px';
							sP.childNodes[i].className = 'p7TP3_slide_panel_h';
						}
						lD = sP.childNodes[i];
					}
				}
				if (tB.p7opt[3] == 2) {
					sP.tp3LastChild = lD;
					P7_TP3resetWidth(sP, sP.tp3LastChild);
				}
			}
			tV = document.getElementById(tB.id.replace('_', 'tvp_'));
			tW = document.getElementById(tB.id.replace('_', 'tgw_'));
			tD = document.getElementById(tB.id.replace('_', 'tabs_'));
			tU = tD.getElementsByTagName('UL')[0];
			tA = tU.getElementsByTagName('A');
			for (i = 0; i < tA.length; i++) {
				tB.tp3Tabs[i] = tA[i];
				tB.tp3Panels[i] = null;
				tA[i].tp3Div = tB.id;
				tA[i].tp3PanelNum = i + 1;
				tA[i].tp3Panel = false;
				tA[i].tp3State = 'closed';
				iM = tA[i].getElementsByTagName("IMG");
				if (iM && iM[0]) {
					sr = iM[0].getAttribute("src");
					swp = tB.p7opt[7];
					iM[0].tp3Swap = swp;
					x = sr.lastIndexOf(".");
					fnA = sr.substring(0, x);
					fnB = '.' + sr.substring(x + 1);
					s1 = fnA + p7TP3over + fnB;
					s2 = fnA + p7TP3open + fnB;
					if (swp == 1) {
						iM[0].p7imgswap = [sr, s1, s1, s1];
						P7_TP3preloader(s1);
					} else if (swp == 2) {
						iM[0].p7imgswap = [sr, s1, s2, s2];
						P7_TP3preloader(s1, s2);
					} else {
						iM[0].p7imgswap = [sr, sr, sr, sr];
					}
					iM[0].p7state = 'closed';
					iM[0].mark = false;
					iM[0].rollover = tB.p7opt[8];
					if (swp > 0) {
						tA[i].hasImg = true;
						iM[0].onmouseover = function(){
							P7_TP3imovr(this);
						};
						iM[0].onmouseout = function(){
							P7_TP3imout(this);
						};
						tA[i].onfocus = function(){
							P7_TP3imovr(this.getElementsByTagName('IMG')[0]);
						};
						tA[i].onblur = function(){
							P7_TP3imout(this.getElementsByTagName('IMG')[0]);
						};
					}
				}
				tA[i].onclick = function(){
					return P7_TP3click(this);
				};
				if (tB.p7opt[5] == 1) {
					tA[i].onmouseover = function(){
						var tB = document.getElementById(this.tp3Div);
						if (tB.tp3MouseTimer) {
							clearTimeout(tB.tp3MouseTimer);
						}
						tB.tp3MouseTimer = setTimeout("P7_TP3trig('" + this.id + "')", 150);
					};
				}
				tP = document.getElementById(tA[i].id.replace('tab', 'w'));
				if (tP) {
					tP.tp3Div = tB.id;
					tP.tp3PanelNum = i + 1;
					tP.tp3VP = tB.id.replace('_', 'cvp_');
					tA[i].tp3Panel = tP.id;
					tB.tp3Panels[i] = tP;
					tP.tp3State = 'closed';
					if (tB.p7opt[5] == 1) {
						tP.onmouseover = function(){
							var tB = document.getElementById(this.tp3Div);
							if (tB.tp3MouseTimer) {
								clearTimeout(tB.tp3MouseTimer);
							}
						};
					}
				}
			}
			tB.tp3ControlPanels = [];
			tD.tp3CurCtrlPanelNum = -1;
			jj = 0;
			for (i = 0; i < tB.tp3Panels.length; i++) {
				if (tB.tp3Panels[i]) {
					tB.tp3ControlPanels[jj] = tB.tp3Panels[i];
					tB.tp3Panels[i].tp3ControlNum = jj;
					jj++;
				}
			}
			if ((tB.p7opt.length > 14 && tB.p7opt[14] > 0) || (tB.p7opt.length < 15 && tB.p7opt[1] !== 0)) {
				tB.tp3TrigScroll = true;
				P7_TP3setClass(cV.parentNode, 'arrows_on');
				tW.style.left = '0px';
				P7_TP3resetWidth(tW, tA[tA.length - 1].parentNode);
				tSL = document.getElementById(tB.id.replace('_', 'tleft_'));
				if (tSL) {
					P7_TP3setClass(tSL, 'off');
					tSL.tp3Div = tB.id;
					if (tB.p7opt.length > 14 && tB.p7opt[14] == 2) {
						tSL.onclick = function(){
							return P7_TP3trigScrollPanel(this.tp3Div, 'left');
						};
					} else {
						tSL.onclick = function(){
							return P7_TP3trigScroll(this.tp3Div, 'left');
						};
					}
				}
				tSR = document.getElementById(tB.id.replace('_', 'tright_'));
				if (tSR) {
					tSR.tp3Div = tB.id;
					if (tB.p7opt.length > 14 && tB.p7opt[14] == 2) {
						tSR.onclick = function(){
							return P7_TP3trigScrollPanel(this.tp3Div, 'right');
						};
					} else {
						tSR.onclick = function(){
							return P7_TP3trigScroll(this.tp3Div, 'right');
						};
					}
				}
				P7_TP3trigScroll(tB.id, 'left');
			}
			tB.tp3PanelNums = tB.tp3Panels.length;
			tB.tp3ShowMode = 'pause';
			tB.tp3NumPlays = 1;
			tB.tp3Direction = 'right';
			tB.tp3Paginator = false;
			tB.tp3Paginators = [];
			tC = document.getElementById(tB.id.replace('_', 'paginator_'));
			if (tC) {
				tB.tp3Paginator = true;
				tA = tC.getElementsByTagName('A');
				if (tA) {
					jj = 0;
					for (k = 0; k < tA.length; k++) {
						if (!tA[k].id && !/pgpp|pgbk/.test(tA[k].id)) {
							jj++;
							tA[k].tp3Div = tB.id;
							tA[k].tp3PanelNum = jj;
							tB.tp3Paginators[jj] = tA[k];
							tA[k].onclick = function(){
								return P7_TP3control(this.tp3Div, this.tp3PanelNum);
							};
						}
					}
				}
			}
			tB.tp3Controls = [10];
			tB.tp3Controls[0] = P7_TP3setCC(tB.id, 'bp_', 'prev');
			tB.tp3Controls[1] = P7_TP3setCC(tB.id, 'bn_', 'next');
			tB.tp3Controls[2] = P7_TP3setCC(tB.id, 'rf_', 'first');
			tB.tp3Controls[3] = P7_TP3setCC(tB.id, 'rp_', 'prev');
			tB.tp3Controls[5] = P7_TP3setCC(tB.id, 'rn_', 'next');
			tB.tp3Controls[6] = P7_TP3setCC(tB.id, 'rl_', 'last');
			el = document.getElementById(tB.id.replace('_', 'rpp_'));
			if (el) {
				el.p7state = 'pause';
				el.tp3Div = tB.id;
				tB.tp3Controls[4] = el;
				el.onclick = function(){
					var ac = (this.p7state == 'play') ? 'pause' : 'play';
					P7_TP3control(this.tp3Div, ac);
					return false;
				};
				el.tp3SetButtonState = function(st){
					var tx;
					if (st == 'play') {
						tx = p7TP3pp.pauseText;
						P7_TP3remClass(this, 'play');
					} else {
						tx = p7TP3pp.playText;
						P7_TP3setClass(this, 'play');
					}
					this.innerHTML = tx;
				};
			}
			if (tch) {
				el = document.getElementById(tB.id.replace('_', 'cvp_'));
				el.tp3Div = tB.id;
				P7_TP3bindSwipe(el, function(dir){
					var tD = document.getElementById(this.tp3Div);
					if (tD.p7opt[3] == 1) {
						if (dir == 'down') {
							P7_TP3control(this.tp3Div, 'next');
						} else if (dir == 'up') {
							P7_TP3control(this.tp3Div, 'prev');
						}
					} else {
						if (dir == 'left') {
							P7_TP3control(this.tp3Div, 'next');
						} else if (dir == 'right') {
							P7_TP3control(this.tp3Div, 'prev');
						}
					}
				});
				el = document.getElementById(tB.id.replace('_', 'tvp_'));
				if (el) {
					el.tp3Div = tB.id;
					P7_TP3bindSwipe(el, function(dir){
						if (dir == 'left') {
							P7_TP3trigScrollPanel(this.tp3Div, 'right');
						} else if (dir == 'right') {
							P7_TP3trigScrollPanel(this.tp3Div, 'left');
						}
					});
				}
			}
			p = tB.p7opt[6];
			if (p == -1) {
				p = Math.floor(Math.random() * tB.tp3Tabs.length + 1);
			}
			p--;
			if (p >= 0 && p <= tB.tp3Tabs.length) {
				P7_TP3open(tB.tp3Tabs[p], 1);
			}
			if (tB.p7opt[9] == 1) {
				P7_TP3currentMark(tB);
			}
			P7_TP3url(tB.id);
			P7_TP3pause(tB.id);
			if (tB.p7opt[15] == 1) {
				tB.tp3ShowMode = 'play';
				if (tB.tp3Controls[4]) {
					tB.tp3Controls[4].p7state = 'play';
					tB.tp3Controls[4].tp3SetButtonState('play');
				}
				if (tB.tp3Controls[7]) {
					tB.tp3Controls[7].p7state = 'play';
					tB.tp3Controls[7].tp3SetButtonState('play');
				}
				if (tB.tp3ShowTimer) {
					clearTimeout(tB.tp3ShowTimer);
				}
				tB.tp3ShowTimer = setTimeout("P7_TP3control('" + tB.id + "','next',2)", tB.p7opt[16]);
			}
		}
	}
	P7_TP3rsz();
	p7TP3a = true;
}

function P7_TP3trigScrollPanel(d, dr){
	var tB, tV, tW, min, max, mxL, dur, stp, lp, dy = 10;
	tB = document.getElementById(d);
	tV = document.getElementById(tB.id.replace('_', 'tvp_'));
	tW = document.getElementById(tB.id.replace('_', 'tgw_'));
	min = 0;
	mxL = tB.tp3Tabs[tB.tp3Tabs.length - 1].parentNode;
	max = mxL.offsetLeft + mxL.offsetWidth - tV.offsetWidth;
	if (dr == 'right') {
		lp = tW.offsetLeft - tV.offsetWidth;
	} else {
		lp = tW.offsetLeft + tV.offsetWidth;
	}
	tB.tp3LastScrollDir = dr;
	lp = (lp <= (max * -1)) ? max * -1 : lp;
	lp = (lp > 0) ? 0 : lp;
	P7_TP3setArrowStates(tB.id, lp, min, max);
	tB.tp3LastScrollTab = tB.tp3CurrentPanel;
	if (tB.tp3TrigScroll && p7TP3a && tB.p7opt[3] > 0) {
		tW.tp3Delay = dy;
		tW.tp3Time = 0;
		tW.tp3Begin = parseInt(tW.style.left, 10);
		tW.tp3Finish = lp;
		dur = tB.p7opt[1];
		stp = dur / dy;
		tW.tp3Duration = stp;
		if (!tW.tp3ScrollGliderRunning) {
			tW.tp3ScrollGliderRunning = true;
			tW.tp3ScrollGlider = setInterval("P7_TP3scrollGlider('" + tW.id + "')", tW.tp3Delay);
		}
	} else {
		if (tB.tp3TrigScroll) {
			tW.style.left = lp + 'px';
		}
	}
	return false;
}

function P7_TP3trigScroll(d, dr){
	var i, k, tB, tV, tW, tL, tg, c = 0, rr, vr, ps = 'left';
	tB = document.getElementById(d);
	if (tB) {
		tV = document.getElementById(tB.id.replace('_', 'tvp_'));
		tW = document.getElementById(tB.id.replace('_', 'tgw_'));
		P7_TP3resetScroll(tW.parentNode);
		P7_TP3resetWidth(tW, tB.tp3Tabs[tB.tp3Tabs.length - 1].parentNode);
		if (dr == 'right') {
			tg = (tW.offsetLeft * -1) + tV.offsetWidth;
			for (i = 0; i < tB.tp3Tabs.length; i++) {
				tL = tB.tp3Tabs[i].parentNode;
				if ((tL.offsetLeft + tL.offsetWidth) >= tg) {
					c = i;
					if (tL.offsetWidth >= tV.offsetWidth) {
						if (i == tB.tp3Tabs.length - 1) {
							ps = 'right';
						} else if (tL.offsetLeft == (tW.offsetLeft * -1)) {
							c++;
						}
					}
					break;
				}
			}
		} else {
			tg = tW.offsetLeft * -1;
			for (i = 0; i < tB.tp3Tabs.length; i++) {
				tL = tB.tp3Tabs[i].parentNode;
				if (tL.offsetWidth >= tV.offsetWidth) {
					rr = tL.offsetLeft + tL.offsetWidth;
					vr = tg + tV.offsetWidth;
					if (tL.offsetLeft >= tg || rr >= vr) {
						c = i - 1;
						ps = 'right';
						if (i === 0) {
							ps = 'left';
						}
						break;
					}
				} else {
					if (tL.offsetLeft >= tg) {
						if (tB.tp3Tabs[i].offsetWidth >= tV.offsetWidth) {
						}
						c = i - 1;
						ps = 'right';
						break;
					}
				}
			}
		}
		c = (c < 0) ? 0 : c;
		c++;
		P7_TP3moveToTab(tB.id, c, ps);
	}
	return false;
}

function P7_TP3moveToTab(d, n, ag, rs){
	var i, tB, tV, tW, tL, tA, lp, min, max, mxL, dur, stp, dy = 10;
	tB = document.getElementById(d);
	tV = document.getElementById(tB.id.replace('_', 'tvp_'));
	tW = document.getElementById(tB.id.replace('_', 'tgw_'));
	P7_TP3resetScroll(tW.parentNode);
	P7_TP3resetWidth(tW, tB.tp3Tabs[tB.tp3Tabs.length - 1].parentNode);
	tA = tB.tp3Tabs[n - 1];
	tL = tA.parentNode;
	min = 0;
	mxL = tB.tp3Tabs[tB.tp3Tabs.length - 1].parentNode;
	max = mxL.offsetLeft + mxL.offsetWidth - tV.offsetWidth;
	tB.tp3LastScrollTab = n;
	tB.tp3LastScrollDir = ag;
	if (ag == 'right') {
		lp = tL.offsetLeft + tL.offsetWidth - tV.offsetWidth;
	} else {
		lp = tL.offsetLeft;
	}
	lp = (lp >= max) ? max : lp;
	lp = lp * -1;
	lp = (lp > 0) ? 0 : lp;
	P7_TP3setArrowStates(tB.id, lp, min, max);
	if (!rs && tB.tp3TrigScroll && p7TP3a && tB.p7opt[3] > 0) {
		tW.tp3Delay = dy;
		tW.tp3Time = 0;
		tW.tp3Begin = parseInt(tW.style.left, 10);
		tW.tp3Finish = lp;
		dur = tB.p7opt[1];
		stp = dur / dy;
		tW.tp3Duration = stp;
		if (!tW.tp3ScrollGliderRunning) {
			tW.tp3ScrollGliderRunning = true;
			tW.tp3ScrollGlider = setInterval("P7_TP3scrollGlider('" + tW.id + "')", tW.tp3Delay);
		}
	} else {
		if (tB.tp3TrigScroll) {
			tW.style.left = lp + 'px';
		}
	}
}

function P7_TP3click(a){
	var wH, m = false;
	if (!a.tp3Panel) {
		wH = window.location.href;
		if (a.href != wH && a.href != wH + '#') {
			if (a.href.toLowerCase().indexOf('javascript:') == -1) {
				m = true;
				return m;
			}
		}
	}
	P7_TP3open(a);
	return m;
}

function P7_TP3trig(d){
	var i, a;
	a = document.getElementById(d);
	if (a) {
		P7_TP3open(a);
	}
}

function P7_TP3openPanel(d, n){
	var x = n - 1, tB = document.getElementById(d);
	if (tB && tB.tp3Tabs) {
		if (x > -1 && x < tB.tp3Tabs.length) {
			P7_TP3open(tB.tp3Tabs[x]);
		}
	}
}

function P7_TP3open(a, au){
	var i, tB, tW, tV, pT, pW, sW, iM, pP, cP, op, oV, dur, stp, mv, dy = 20;
	if (a.tp3State == 'open') {
		return;
	}
	tB = document.getElementById(a.tp3Div);
	if (tB.tp3ShowTimer) {
		clearTimeout(tB.tp3ShowTimer);
	}
	if (tB.p7opt[21] == 1 && !au) {
		P7_TP3pause(tB.id);
	}
	tB.tp3PrevPanel = tB.tp3CurrentPanel;
	if (tB.tp3PrevPanel > 0) {
		pP = tB.tp3Panels[tB.tp3PrevPanel - 1];
		pT = tB.tp3Tabs[tB.tp3PrevPanel - 1];
		if (pT) {
			pT.tp3State = 'closed';
			P7_TP3remClass(pT, 'open');
			P7_TP3remClass(pT.parentNode, 'open');
			if (pT.hasImg) {
				iM = pT.getElementsByTagName("IMG")[0];
				iM.p7state = 'closed';
				if (iM.mark) {
					iM.src = iM.p7imgswap[3];
				} else {
					iM.src = iM.p7imgswap[0];
				}
			}
		}
	}
	tB.tp3CurrentPanel = a.tp3PanelNum;
	tB.tp3CurrentPanelId = null;
	op = tB.p7opt[3];
	if (!p7TP3a) {
		op = 0;
	}
	P7_TP3setClass(a, 'open');
	P7_TP3setClass(a.parentNode, 'open');
	a.tp3State = 'open';
	if (a.hasImg) {
		iM = a.getElementsByTagName("IMG")[0];
		iM.p7state = 'open';
		iM.src = iM.p7imgswap[2];
	}
	P7_TP3setControlStates(tB.id);
	mv = (tB.tp3TrigScroll && tB.tp3LastScrollDir) ? true : false;
	if (tB.p7opt.length > 14 && tB.p7opt[14] == 2) {
		tB.tp3LastScrollTab = a.tp3PanelNum;
		if (mv) {
			mv = (au == 1) ? true : false;
		}
	}
	if (mv) {
		P7_TP3moveToTab(tB.id, a.tp3PanelNum, tB.tp3LastScrollDir, true);
	}
	if (!a.tp3Panel) {
		if (op < 1 || op > 2) {
			P7_TP3close(tB.id, tB.tp3PrevPanel);
			return;
		}
	}
	tW = document.getElementById(a.tp3Panel);
	tB.tp3CurrentPanelId = (tW) ? tW.id : null;
	if (tW) {
		tB.tp3CurCtrlPanelNum = tW.tp3ControlNum;
	}
	tV = document.getElementById(tB.id.replace('_', 'cvp_'));
	tV.tp3Div = tB.id;
	if (!tB.tp3Slider) {
		tW.style.width = tV.offsetWidth + 'px';
		tV.style.width = tV.offsetWidth + 'px';
		if (pP) {
			pP.style.width = tV.offsetWidth + 'px';
			tV.style.height = tV.offsetHeight + 'px';
			pP.style.position = 'absolute';
			pP.style.zIndex = 210;
		}
	}
	cP = document.getElementById(tW.id.replace('w', 'c'));
	P7_TP3setClass(cP, 'current-panel');
	if (pP) {
		cP = document.getElementById(pP.id.replace('w', 'c'));
		P7_TP3remClass(cP, 'current-panel');
	}
	if (op == 1 || op == 2) {
		sW = document.getElementById(tB.id.replace('_', 'pw_'));
		if (sW.tp3PanelResizeRunning) {
			clearInterval(sW.tp3PanelResizer);
			sW.tp3PanelResizeRunning = false;
		}
		sW.tp3Time = 0;
		sW.tp3Delay = dy;
		tV.tp3VPbegin = tV.offsetHeight;
		tV.tp3VPfinish = (tW) ? tW.offsetHeight : 0;
		tV.tp3VPtime = 0;
		if (op == 1) {
			sW.tp3Lbegin = 0;
			sW.tp3Lfinish = 0;
			sW.tp3Tbegin = parseInt(sW.style.top, 10);
			sW.tp3Tfinish = (tW) ? tW.offsetTop * -1 : sW.tp3Tbegin;
		} else {
			sW.tp3Lbegin = parseInt(sW.style.left, 10);
			sW.tp3Lfinish = (tW) ? tW.offsetLeft * -1 : 0;
			sW.tp3Tbegin = 0;
			sW.tp3Tfinish = 0;
		}
		dur = tB.p7opt[4];
		stp = dur / dy;
		sW.tp3Duration = stp;
		if (!sW.tp3PanelSliderRunning) {
			sW.tp3PanelSliderRunning = true;
			sW.tp3PanelSlider = setInterval("P7_TP3panelSlider('" + sW.id + "')", sW.tp3Delay);
		}
	} else if (op == 3) {
		tW.style.width = tV.offsetWidth + 'px';
		tW.style.height = 'auto';
		tW.style.position = 'absolute';
		tW.style.visibility = 'visible';
		tW.tp3Anim = op;
		tW.tp3Delay = dy;
		tW.tp3FOPdelay = 20;
		tV.tp3VPbegin = tV.offsetHeight;
		tV.tp3VPfinish = tW.offsetHeight;
		tV.tp3VPtime = 0;
		tW.tp3VPfirst = false;
		tW.tp3VPlast = true;
		tW.style.width = tV.offsetWidth + 'px';
		if (pP) {
			pP.style.zIndex = 260;
			pP.tp3FOPbegin = 99;
			pP.tp3FOPfinish = 1;
			pP.tp3FOPtime = 0;
			pP.tp3FOPdelay = tW.tp3FOPdelay;
			dur = tB.p7opt[4];
			stp = dur / pP.tp3FOPdelay;
			pP.tp3FOPduration = stp;
			if (tW.offsetHeight < pP.offsetHeight) {
				tW.tp3VPfirst = true;
				tW.tp3VPlast = false;
			}
			if (pP.filters) {
				pP.style.filter = 'alpha(opacity=' + pP.tp3FOPbegin + ')';
			} else {
				pP.style.opacity = pP.tp3FOPbegin / 100;
			}
		}
		tW.style.zIndex = 250;
		tW.tp3FOPbegin = 1;
		tW.tp3FOPfinish = 99;
		tW.tp3FOPtime = 0;
		dur = tB.p7opt[4];
		stp = dur / tW.tp3FOPdelay;
		tW.tp3FOPduration = stp;
		if (tW.filters) {
			tW.style.filter = 'alpha(opacity=' + tW.tp3FOPbegin + ')';
		} else {
			tW.style.opacity = tW.tp3FOPbegin / 100;
		}
		dur = tB.p7opt[4];
		stp = dur / dy;
		tW.tp3Duration = stp;
		tV.tp3VPduration = parseInt((tW.tp3Duration / 2), 10);
		tW.style.left = '0px';
		tW.style.top = '0px';
		tW.style.height = 'auto';
		tW.style.visibility = 'visible';
		tB.tp3AnimRunning = true;
		if (!tW.tp3PanelFaderRunning) {
			tW.tp3PrevPanel = (pP) ? pP.id : null;
			tW.tp3PanelFaderRunning = true;
			tW.tp3PanelFader = setInterval("P7_TP3panelCrossFader('" + tW.id + "')", tW.tp3FOPdelay);
		}
	} else {
		if (tB.tp3Slider) {
			sW = document.getElementById(tB.id.replace('_', 'pw_'));
			if (tB.p7opt[3] == 1) {
				sW.style.top = (tW.offsetTop * -1) + 'px';
			} else if (tB.p7opt[3] == 2) {
				sW.style.left = (tW.offsetLeft * -1) + 'px';
			}
			tV.style.height = tW.offsetHeight + 'px';
			if (!sW.tp3PanelResizeRunning) {
				sW.tp3PanelResizeRunning = true;
				sW.tp3PanelResizer = setInterval("P7_TP3panelResize('" + sW.id + "')", 30);
			}
		} else {
			tW.style.visibility = 'hidden';
			tW.style.height = 'auto';
			tW.style.zIndex = 250;
			tW.style.left = '0px';
			tW.style.position = 'relative';
			tW.style.width = 'auto';
			tW.style.visibility = 'visible';
			tV.style.height = 'auto';
			tV.style.width = 'auto';
			P7_TP3close(tB.id, tB.tp3PrevPanel);
		}
	}
	if (tB.tp3ShowMode == 'play') {
		tB.tp3ShowTimer = setTimeout("P7_TP3control('" + tB.id + "','next',2)", tB.p7opt[17]);
	}
}

function P7_TP3close(d, pn){
	var tB, tT, tC, iM, sW;
	if (pn > 0) {
		tB = document.getElementById(d);
		if (tB) {
			pn--;
			if (pn < tB.tp3Tabs.length) {
				tT = tB.tp3Tabs[pn];
				tT.tp3State = 'closed';
				P7_TP3remClass(tT, 'open');
				P7_TP3remClass(tT.parentNode, 'open');
				if (tT.hasImg) {
					iM = tT.getElementsByTagName("IMG")[0];
					iM.p7state = 'closed';
					if (iM.mark) {
						iM.src = iM.p7imgswap[3];
					} else {
						iM.src = iM.p7imgswap[0];
					}
				}
				if (tT.tp3Panel) {
					tC = document.getElementById(tT.tp3Panel);
					tC.style.position = 'absolute';
					tC.style.visibility = 'hidden';
					tC.style.left = '-3000px';
					tC.style.zIndex = 200;
				}
			}
		}
	}
}

function P7_TP3scrollGlider(d){
	var tD, nl;
	tD = document.getElementById(d);
	tD.tp3Time++;
	nl = P7_TP3InOutQuad(tD.tp3Time, tD.tp3Begin, tD.tp3Finish - tD.tp3Begin, tD.tp3Duration);
	tD.style.left = nl + 'px';
	if (tD.tp3Time >= tD.tp3Duration) {
		clearInterval(tD.tp3ScrollGlider);
		tD.tp3ScrollGliderRunning = false;
	}
}

function P7_TP3panelSlider(d){
	var tD, vP, vph, nl, nt;
	tD = document.getElementById(d);
	vP = document.getElementById(tD.tp3VP);
	tD.tp3Time++;
	if (vP.tp3VPbegin != vP.tp3VPfinish) {
		vph = P7_TP3InOutQuad(tD.tp3Time, vP.tp3VPbegin, vP.tp3VPfinish - vP.tp3VPbegin, tD.tp3Duration);
		vP.style.height = vph + 'px';
	}
	if (tD.tp3Lbegin != tD.tp3Lfinish) {
		nl = P7_TP3InOutQuad(tD.tp3Time, tD.tp3Lbegin, tD.tp3Lfinish - tD.tp3Lbegin, tD.tp3Duration);
		tD.style.left = nl + 'px';
	}
	if (tD.tp3Tbegin != tD.tp3Tfinish) {
		nt = P7_TP3InOutQuad(tD.tp3Time, tD.tp3Tbegin, tD.tp3Tfinish - tD.tp3Tbegin, tD.tp3Duration);
		tD.style.top = nt + 'px';
	}
	if (tD.tp3Time >= tD.tp3Duration) {
		clearInterval(tD.tp3PanelSlider);
		tD.tp3PanelSliderRunning = false;
		if (!tD.tp3PanelResizeRunning) {
			tD.tp3PanelResizer = setInterval("P7_TP3panelResize('" + tD.id + "')", 30);
			tD.tp3PanelResizeRunning = true;
		}
	}
}

function P7_TP3panelResize(d){
	var wP, vP, tB, cP;
	wP = document.getElementById(d);
	if (!wP.tp3PanelSliderRunning) {
		vP = document.getElementById(wP.tp3VP);
		tB = document.getElementById(vP.tp3Div);
		cP = document.getElementById(tB.tp3CurrentPanelId);
		if (cP) {
			if (cP.offsetHeight != vP.offsetHeight) {
				vP.style.height = cP.offsetHeight + 'px';
			}
		}
	} else {
		clearInterval(wP.tp3PanelResizer);
		wP.tp3PanelResizeRunning = false;
	}
}

function P7_TP3panelCrossFader(dIn){
	var cP, pP, vP, vph, tB, p;
	cP = document.getElementById(dIn);
	pP = document.getElementById(cP.tp3PrevPanel);
	vP = document.getElementById(cP.tp3VP);
	if (cP.tp3VPfirst) {
		vP.tp3VPtime++;
		vph = P7_TP3InOutQuad(vP.tp3VPtime, vP.tp3VPbegin, vP.tp3VPfinish - vP.tp3VPbegin, vP.tp3VPduration);
		vP.style.height = vph + 'px';
		if (vP.tp3VPtime >= vP.tp3VPduration) {
			cP.tp3VPfirst = false;
			vP.tp3VPbegin = vP.tp3VPfinish;
		}
	} else if (cP.tp3FOPtime <= cP.tp3FOPduration) {
		cP.tp3FOPtime++;
		p = P7_TP3InOutQuad(cP.tp3FOPtime, cP.tp3FOPbegin, cP.tp3FOPfinish - cP.tp3FOPbegin, cP.tp3FOPduration);
		if (cP.filters) {
			cP.style.filter = 'alpha(opacity=' + p + ')';
		} else {
			cP.style.opacity = p / 100;
		}
		if (pP) {
			pP.tp3FOPtime++;
			p = P7_TP3InOutQuad(pP.tp3FOPtime, pP.tp3FOPbegin, pP.tp3FOPfinish - pP.tp3FOPbegin, pP.tp3FOPduration);
			if (pP.filters) {
				pP.style.filter = 'alpha(opacity=' + p + ')';
			} else {
				pP.style.opacity = p / 100;
			}
		}
	} else if (cP.tp3VPlast && (cP.tp3FOPtime >= cP.tp3FOPduration)) {
		vP.tp3VPtime++;
		vph = P7_TP3InOutQuad(vP.tp3VPtime, vP.tp3VPbegin, vP.tp3VPfinish - vP.tp3VPbegin, vP.tp3VPduration);
		vP.style.height = vph + 'px';
		if (vP.tp3VPtime >= vP.tp3VPduration) {
			cP.tp3VPlast = false;
			vP.tp3VPbegin = vP.tp3VPfinish;
		}
	}
	if (!cP.tp3first && !cP.tp3VPlast && (cP.tp3FOPtime >= cP.tp3FOPduration)) {
		clearInterval(cP.tp3PanelFader);
		cP.tp3PanelFaderRunning = false;
		tB = document.getElementById(cP.tp3Div);
		cP.style.position = 'relative';
		cP.style.height = 'auto';
		cP.style.width = 'auto';
		tB.tp3AnimRunning = false;
		if (pP) {
			P7_TP3close(tB.id, pP.tp3PanelNum);
			if (pP.filters) {
				pP.style.filter = '';
			} else {
				pP.style.opacity = 1;
			}
		}
		if (cP.filters) {
			cP.style.filter = '';
		} else {
			cP.style.opacity = 1;
		}
		vP.style.height = 'auto';
		vP.style.width = 'auto';
	}
}

function P7_TP3InOutQuad(t, b, c, d){
	if ((t /= d / 2) < 1) {
		return c / 2 * t * t + b;
	} else {
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	}
}

function P7_TP3rsz(){
	var i, j, tB, wP, vP, cP;
	for (j = p7TP3ctl.length - 1; j > -1; j--) {
		tB = document.getElementById(p7TP3ctl[j][0]);
		if (tB) {
			if (tB.tp3TrigScroll && tB.tp3LastScrollDir) {
				P7_TP3moveToTab(tB.id, tB.tp3LastScrollTab, tB.tp3LastScrollDir, true);
			}
			if (tB.tp3Slider) {
				wP = document.getElementById(tB.id.replace('_', 'pw_'));
				vP = document.getElementById(tB.id.replace('_', 'cvp_'));
				cP = document.getElementById(tB.tp3CurrentPanelId);
				if (!wP.tp3PanelSliderRunning) {
					if (tB.p7opt[3] == 1) {
						if (cP) {
							vP.style.height = cP.offsetHeight + 'px';
							wP.style.top = (cP.offsetTop * -1) + 'px';
							setTimeout("P7_TP3rsz2('" + vP.id + "','" + wP.id + "','" + cP.id + "')", 20);
						}
					} else {
						for (i = 0; i < wP.childNodes.length; i++) {
							if (wP.childNodes[i].nodeType == 1) {
								wP.childNodes[i].style.width = vP.offsetWidth + 'px';
							}
						}
						if (wP.tp3LastChild) {
							P7_TP3resetWidth(wP, wP.tp3LastChild);
						}
						if (cP) {
							vP.style.height = cP.offsetHeight + 'px';
							wP.style.left = (cP.offsetLeft * -1) + 'px';
						}
					}
				}
			}
		}
	}
}

function P7_TP3rsz2(v, w, c){
	var vP, wP, cP;
	vP = document.getElementById(v);
	wP = document.getElementById(w);
	cP = document.getElementById(c);
	if (cP && cP.offsetHeight) {
		vP.style.height = cP.offsetHeight + 'px';
		wP.style.top = (cP.offsetTop * -1) + 'px';
	}
}

function P7_TP3preloader(){
	var i, x;
	for (i = 0; i < arguments.length; i++) {
		x = document.p7TP3preload.length;
		document.p7TP3preload[x] = new Image();
		document.p7TP3preload[x].src = arguments[i];
	}
}

function P7_TP3imovr(im){
	var m = false, r = im.rollover;
	if (im.mark) {
		m = (r > 1) ? true : false;
	} else if (im.p7state == 'open') {
		m = (r == 1 || r == 3) ? true : false;
	} else {
		m = true;
	}
	if (m) {
		im.src = im.p7imgswap[1];
	}
}

function P7_TP3imout(im){
	var r = im.rollover;
	if (im.mark) {
		if (im.p7state == 'open') {
			im.src = im.p7imgswap[2];
		} else {
			im.src = im.p7imgswap[3];
		}
	} else if (im.p7state == 'open') {
		if (r == 1 || r == 3) {
			im.src = im.p7imgswap[2];
		}
	} else {
		im.src = im.p7imgswap[0];
	}
}

function P7_TP3ctrl(dv, ac){
	return P7_TP3control(dv, ac);
}

function P7_TP3control(dv, ac, bp){
	var i, tD, cs, ts, op, sn, eI, eC, eD, tm = 0, pauseOnAction = false, rs = false, m = false;
	tD = document.getElementById(dv);
	if (tD && tD.tp3Panels) {
		if (tD.tp3ShowTimer) {
			clearTimeout(tD.tp3ShowTimer);
		}
		if (tD.p7opt[21] == 1) {
			pauseOnAction = true;
		}
		cs = tD.tp3CurCtrlPanelNum;
		ts = tD.tp3ControlPanels.length - 1;
		op = tD.p7opt;
		if (ac == 'pause') {
			P7_TP3pause(dv);
			return m;
		}
		if (!bp && pauseOnAction) {
			P7_TP3pause(dv);
		}
		if (ac == 'play') {
			tD.tp3ShowMode = 'play';
			if (tD.tp3Controls[4]) {
				tD.tp3Controls[4].p7state = 'play';
				tD.tp3Controls[4].tp3SetButtonState('play');
			}
			if (tD.tp3Controls[7]) {
				tD.tp3Controls[7].p7state = 'play';
				tD.tp3Controls[7].tp3SetButtonState('play');
			}
			ac = 'next';
		}
		if (ac == 'first') {
			sn = 0;
		} else if (ac == 'prev') {
			sn = cs - 1;
			if (sn < 0) {
				sn = ts;
			}
		} else if (ac == 'next') {
			sn = cs + 1;
			if (tD.tp3ShowMode == 'play') {
				if (tD.tp3Direction == 'left') {
					sn = cs - 1;
				}
				if (sn > ts) {
					tD.tp3NumPlays++;
					if (tD.p7opt[19] > 0 && tD.tp3NumPlays > tD.p7opt[19]) {
						tD.tp3NumPlays = 1;
						sn = (tD.p7opt[20] == 1) ? 0 : tD.tp3ControlPanels.length - 1;
						tD.tp3Direction = 'right';
						P7_TP3pause(tD.id);
					} else {
						if (tD.p7opt[18] === 0) {
							sn = cs - 1;
							tD.tp3Direction = 'left';
						} else {
							sn = 0;
						}
					}
				}
				if (sn < 0) {
					tD.numPlays++;
					tD.tp3Direction = 'right';
					if (tD.p7opt[19] > 0 && tD.numPlays > tD.p7opt[19]) {
						tD.tp3NumPlays = 1;
						sn = (tD.p7opt[13] == 1) ? 0 : tD.tp3ControlPanels.length - 1;
						P7_TP3pause(tD.id);
					} else {
						sn = cs + 1;
					}
				}
			} else {
				if (sn > ts) {
					sn = 0;
				}
			}
		} else if (ac == 'last') {
			sn = ts;
		} else {
			sn = ac - 1;
		}
		sn = (sn < 0) ? 0 : sn;
		sn = (sn > tD.tp3ControlPanels.length - 1) ? tD.tp3ControlPanels.length - 1 : sn;
		if (sn == tD.tp3CurCtrlPanelNum && bp != 1) {
			return m;
		}
		sn = tD.tp3ControlPanels[sn].tp3PanelNum;
		P7_TP3open(tD.tp3Tabs[sn - 1], 1);
	}
	return false;
}

function P7_TP3setControlStates(dv){
	var i, tD, sn, cl = 'off';
	tD = document.getElementById(dv);
	sn = tD.tp3CurrentPanel;
	if (sn <= 1) {
		P7_TP3setClass(tD.tp3Controls[0], cl);
		P7_TP3setClass(tD.tp3Controls[2], cl);
	} else {
		P7_TP3remClass(tD.tp3Controls[0], cl);
		P7_TP3remClass(tD.tp3Controls[2], cl);
	}
	if (sn >= tD.tp3PanelNums) {
		P7_TP3setClass(tD.tp3Controls[1], cl);
		P7_TP3setClass(tD.tp3Controls[6], cl);
	} else {
		P7_TP3remClass(tD.tp3Controls[1], cl);
		P7_TP3setClass(tD.tp3Controls[6], cl);
	}
	if (tD.tp3Paginator) {
		for (i = 1; i < tD.tp3Paginators.length; i++) {
			if (i == sn) {
				P7_TP3setClass(tD.tp3Paginators[i], 'down');
			} else {
				P7_TP3remClass(tD.tp3Paginators[i], 'down');
			}
		}
	}
}

function P7_TP3pause(d){
	var cD, tD = document.getElementById(d);
	if (tD) {
		tD.tp3ShowMode = 'pause';
		if (tD.tp3ShowTimer) {
			clearTimeout(tD.tp3ShowTimer);
		}
		if (tD.tp3Controls[4]) {
			tD.tp3Controls[4].p7state = 'pause';
			tD.tp3Controls[4].tp3SetButtonState('pause');
		}
		if (tD.tp3Controls[7]) {
			tD.tp3Controls[7].p7state = 'pause';
			tD.tp3Controls[7].tp3SetButtonState('pause');
		}
	}
}

var p7TP3tch = {
	el: null,
	fCnt: 0,
	startX: 0,
	startY: 0,
	curX: 0,
	curY: 0
};
function P7_TP3tchStart(evt){
	if (evt.touches.length == 1) {
		p7TP3tch.fCnt = evt.touches.length;
		p7TP3tch.startX = evt.touches[0].pageX;
		p7TP3tch.startY = evt.touches[0].pageY;
		if (!p7TP3tch.el) {
			p7TP3tch.el = this;
		}
	} else if (evt.pointerType) {
		p7TP3tch.fCnt = 1;
		p7TP3tch.startX = evt.clientX;
		p7TP3tch.startY = evt.clientY;
		if (!p7TP3tch.el) {
			p7TP3tch.el = this;
		}
	} else {
		P7_TP3tchCancel(evt);
	}
}

function P7_TP3tchMove(evt){
	var x;
	if (p7TP3tch.startX !== 0) {
		if (evt.touches.length == 1) {
			x = Math.abs(evt.touches[0].pageX - p7TP3tch.startX);
			if (x > 4) {
				evt.stopPropagation();
				evt.preventDefault();
				p7TP3tch.curX = evt.touches[0].pageX;
				p7TP3tch.curY = evt.touches[0].pageY;
			} else {
				P7_TP3tchCancel(evt);
			}
			if (x >= 72) {
				P7_TP3tchEnd(evt);
			}
		} else if (evt.pointerType) {
			x = Math.abs(evt.clientX - p7TP3tch.startX);
			if (x > 4 || navigator.maxTouchPoints || navigator.msMaxTouchPoints) {
				evt.stopPropagation();
				evt.preventDefault();
				p7TP3tch.curX = evt.clientX;
				p7TP3tch.curY = evt.clientY;
			} else {
				P7_TP3tchCancel(evt);
			}
			if (x >= 72) {
				P7_TP3tchEnd(evt);
			}
		} else {
			P7_TP3tchCancel(evt);
		}
	} else {
		P7_TP3tchCancel(evt);
	}
}

function P7_TP3tchEnd(evt){
	var swl, swa, swd, x, y, z, r;
	if (p7TP3tch.fCnt == 1 && p7TP3tch.curX !== 0) {
		evt.preventDefault();
		swl = Math.round(Math.sqrt(Math.pow(p7TP3tch.curX - p7TP3tch.startX, 2) + Math.pow(p7TP3tch.curY - p7TP3tch.startY, 2)));
		if (swl >= 72) {
			x = p7TP3tch.startX - p7TP3tch.curX;
			y = p7TP3tch.curY - p7TP3tch.startY;
			r = Math.atan2(y, x);
			swa = Math.round(r * 180 / Math.PI);
			if (swa < 0) {
				swa = 360 - Math.abs(swa);
			}
			if ((swa <= 45) && (swa >= 0)) {
				swd = 'left';
			} else if ((swa <= 360) && (swa >= 315)) {
				swd = 'left';
			} else if ((swa >= 135) && (swa <= 225)) {
				swd = 'right';
			} else if ((swa > 45) && (swa < 135)) {
				swd = 'down';
			} else {
				swd = 'up';
			}
			p7TP3tch.el.onSwiped(swd);
			P7_TP3tchCancel(evt);
		} else {
			P7_TP3tchCancel(evt);
		}
	} else {
		P7_TP3tchCancel(evt);
	}
}

function P7_TP3tchCancel(evt){
	p7TP3tch.fCnt = 0;
	p7TP3tch.startX = 0;
	p7TP3tch.startY = 0;
	p7TP3tch.curX = 0;
	p7TP3tch.curY = 0;
	p7TP3tch.el = null;
}

function P7_TP3bindSwipe(ob, fn){
	if (ob.addEventListener) {
		ob.onSwiped = fn;
		if ('ontouchstart' in window) {
			ob.addEventListener('touchstart', P7_TP3tchStart, false);
			ob.addEventListener('touchend', P7_TP3tchEnd, false);
			ob.addEventListener('touchmove', P7_TP3tchMove, false);
			ob.addEventListener('touchcancel', P7_TP3tchCancel, false);
		} else {
			if (navigator.maxTouchPoints) {
				ob.addEventListener('pointerdown', P7_TP3tchStart, false);
				ob.addEventListener('pointerup', P7_TP3tchEnd, false);
				ob.addEventListener('pointermove', P7_TP3tchMove, false);
				ob.setAttribute('style', 'touch-action: pan-y pinch-zoom;');
			} else if (navigator.msMaxTouchPoints) {
				ob.addEventListener('MSPointerDown', P7_TP3tchStart, false);
				ob.addEventListener('MSPointerUp', P7_TP3tchEnd, false);
				ob.addEventListener('MSPointerMove', P7_TP3tchMove, false);
				ob.setAttribute('style', '-ms-touch-action: pan-y pinch-zoom;');
			}
		}
	}
}

function P7_TP3mark(){
	p7TP3adv[p7TP3adv.length] = arguments;
}

function P7_TP3currentMark(el){
	var j, i, x, wH, cm = false, mt = ['', 1, '', ''], op, r1, k, kk, tA, aU, pp, tr, aT, aP, d, pn, im;
	wH = window.location.href;
	if (el.p7opt[10] != 1) {
		wH = wH.replace(window.location.search, '');
	}
	if (wH.charAt(wH.length - 1) == '#') {
		wH = wH.substring(0, wH.length - 1);
	}
	for (k = 0; k < p7TP3adv.length; k++) {
		if (p7TP3adv[k][0] && p7TP3adv[k][0] == el.id) {
			mt = p7TP3adv[k];
			cm = true;
			break;
		}
	}
	op = mt[1];
	if (op < 1) {
		return;
	}
	r1 = /index\.[\S]*/i;
	k = -1;
	kk = -1;
	tA = [];
	d = document.getElementById(el.id.replace("_", "tvp_"));
	if (d) {
		aT = d.getElementsByTagName('A');
		if (aT && aT.length > 0) {
			for (i = 0; i < aT.length; i++) {
				tA[tA.length] = aT[i];
			}
		}
	}
	d = document.getElementById(el.id.replace("_", "cvp_"));
	if (d) {
		aP = d.getElementsByTagName('A');
		if (aP && aP.length > 0) {
			for (i = 0; i < aP.length; i++) {
				tA[tA.length] = aP[i];
			}
		}
	}
	for (j = 0; j < tA.length; j++) {
		aU = tA[j].href.replace(r1, '');
		if (op > 0) {
			if (tA[j].href == wH || aU == wH) {
				k = j;
				kk = -1;
			}
		}
		if (op == 2) {
			if (tA[j].firstChild) {
				if (tA[j].firstChild.nodeValue == mt[2]) {
					kk = j;
				}
			}
		}
		if (op == 3 && tA[j].href.indexOf(mt[2]) > -1) {
			kk = j;
		}
		if (op == 4) {
			for (x = 2; x < mt.length; x += 2) {
				if (wH.indexOf(mt[x]) > -1) {
					if (tA[j].firstChild && tA[j].firstChild.nodeValue) {
						if (tA[j].firstChild.nodeValue == mt[x + 1]) {
							kk = j;
						}
					}
				}
			}
		}
	}
	k = (kk > k) ? kk : k;
	if (k > -1) {
		if (tA[k].tp3PanelNum) {
			tr = tA[k];
		} else {
			P7_TP3setClass(tA[k], 'current_mark');
			pp = tA[k].parentNode;
			while (pp) {
				if (pp.tp3Div && pp.tp3Div == el.id) {
					tr = el.tp3Tabs[pp.tp3PanelNum - 1];
					break;
				}
				pp = pp.parentNode;
			}
		}
		if (tr) {
			P7_TP3setClass(tr, 'current_mark');
			P7_TP3setClass(tr.parentNode, 'current_mark');
			P7_TP3open(tr, 1);
		}
	}
}

function P7_TP3url(dv){
	var i, h, s, x, d = 'tp3', pn, n = dv.replace("p7TP3_", ""), tr;
	if (document.getElementById) {
		h = document.location.search;
		if (h) {
			h = h.replace('?', '');
			s = h.split(/[=&]/g);
			if (s && s.length) {
				for (i = 0; i < s.length; i += 2) {
					if (s[i] == d) {
						x = s[i + 1];
						if (n != x.charAt(0)) {
							x = false;
						}
						if (x) {
							pn = 'p7TP3tab' + x;
							tr = document.getElementById(pn);
							if (tr) {
								P7_TP3open(tr, 1);
							}
						}
					}
				}
			}
		}
		h = document.location.hash;
		if (h) {
			x = h.substring(1, h.length);
			if (n != x.charAt(3)) {
				x = false;
			}
			if (x && x.indexOf(d) === 0) {
				pn = 'p7TP3tab' + x.substring(3);
				tr = document.getElementById(pn);
				if (tr) {
					P7_TP3open(tr, 1);
				}
			}
		}
	}
}

function P7_TP3setCC(dd, rp, ac){
	var d, tC;
	d = dd.replace('_', rp);
	tC = document.getElementById(d);
	if (tC) {
		tC.onclick = function(){
			return P7_TP3control(dd, ac);
		};
	}
	return tC;
}

function P7_TP3resetScroll(ob){
	if (ob.scrollLeft !== 0) {
		ob.scrollLeft = 0;
	}
	if (ob.scrollTop !== 0) {
		ob.scrollTop = 0;
	}
}

function P7_TP3resetWidth(dd, li){
	var b, w;
	dd.style.width = (li.parentNode.childNodes.length * 3000) + 'px';
	b = li.parentNode.getBoundingClientRect();
	w = b.right - b.left + 1;
	dd.style.minWidth = w + 'px';
	dd.style.width = 'auto';
}

function P7_TP3setArrowStates(d, lp, mn, mx){
	var aL, aR;
	aL = document.getElementById(d.replace('_', 'tleft_'));
	aR = document.getElementById(d.replace('_', 'tright_'));
	if (lp >= mn) {
		P7_TP3setClass(aL, 'off');
	} else {
		P7_TP3remClass(aL, 'off');
	}
	if (lp <= (mx * -1)) {
		P7_TP3setClass(aR, 'off');
	} else {
		P7_TP3remClass(aR, 'off');
	}
}

function P7_TP3setClass(ob, cl){
	if (ob) {
		var cc, nc, r = /\s+/g;
		cc = ob.className;
		nc = cl;
		if (cc && cc.length > 0) {
			if (cc.indexOf(cl) == -1) {
				nc = cc + ' ' + cl;
			} else {
				nc = cc;
			}
		}
		nc = nc.replace(r, ' ');
		ob.className = nc;
	}
}

function P7_TP3remClass(ob, cl){
	if (ob) {
		var cc, nc;
		cc = ob.className;
		if (cc && cc.indexOf(cl > -1)) {
			nc = cc.replace(cl, '');
			nc = nc.replace(/\s+/g, ' ');
			nc = nc.replace(/\s$/, '');
			nc = nc.replace(/^\s/, '');
			ob.className = nc;
		}
	}
}

function P7_TP3tblfix(ob){
	var pp, sc, vp, tB, h, hh, ie, m = false;
	ie = P7_TP3getIEver();
	pp = ob.parentNode;
	while (pp) {
		if (pp.nodeName) {
			if (pp.nodeName == 'TD' || pp.nodeName == 'TABLE') {
				m = true;
				break;
			}
			if (pp.nodeName == 'BODY') {
				break;
			}
		}
		pp = pp.parentNode;
	}
	if (m || (ie > 4 && ie < 7)) {
		h = ob.offsetWidth;
		ob.style.width = h + 'px';
		hh = ob.offsetWidth;
		ob.style.width = (h + (h - hh)) + 'px';
		sc = document.getElementById(ob.id.replace('_', 'tvp_'));
		if (sc) {
			sc.style.width = sc.offsetWidth + 'px';
		}
		if (ob.p7opt && ob.p7opt[3] == 2) {
			vp = document.getElementById(ob.id.replace('_', 'cvp_'));
			if (vp) {
				vp.style.width = vp.offsetWidth + 'px';
			}
		}
	}
}

function P7_TP3getIEver(){
	var j, v = -1, nv, m = false;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
	}
	return v;
}
