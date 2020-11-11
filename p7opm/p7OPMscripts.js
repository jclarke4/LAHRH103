
/* 
 ================================================
 PVII Omni-Panel Magic scripts
 Copyright (c) 2016 Project Seven Development
 www.projectseven.com
 Version: 1.1.7 -build 20
 ================================================
 
 */
var p7OPM = {
	ctl: [],
	status: false,
	once: false,
	ie: false,
	prf: 'none',
	clk: false,
	defAnim: 1,
	defDuration: 600,
	tchEl: null,
	startX: 0,
	startY: 0,
	curX: 0,
	curY: 0,
	swipeDuration: 400,
	animDelay: (1000 / 60)
};
function P7_OPMset(){
	var h, hd, sh = '';
	if (!document.getElementById) {
		return;
	}
	p7OPM.ie = P7_OPMgetIEver();
	sh += '.opm-panel {position:absolute;left:-9000px;top:-9000px;overflow:hidden;visibility:hidden;width:100%;}\n';
	sh += '.opm-panel-wrapper {position:relative;overflow:hidden;}\n';
	sh += '.opm-panel-layout {position: relative;width: 100%;height: auto;}\n';
	if (navigator.maxTouchPoints) {
		sh += '.opm-panel-wrapper, .opm-panel-layout, .opm-panel {touch-action: pan-y pinch-zoom;}\n';
	} else if (navigator.msMaxTouchPoints) {
		sh += '.opm-panel-wrapper, .opm-panel-layout, .opm-panel {ms-touch-action: pan-y pinch-zoom;}\n';
	}
	if (p7OPM.ie > 5 && p7OPM.ie < 9) {
	}
	if (sh !== '') {
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
	p7OPM.prf = P7_OPMgetCSSPre();
}

P7_OPMset();
function P7_OPMbb(){
}

function P7_OPMaddLoad(){
	if (!document.getElementById) {
		return;
	}
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_OPMinit, false);
		window.addEventListener("load", P7_OPMinit, false);
		window.addEventListener("unload", P7_OPMbb, false);
		window.addEventListener("resize", P7_OPMrsz, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_opm defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_opm").onreadystatechange = function(){
			if (this.readyState == "complete") {
				if (p7OPM.ctl.length > 0) {
					P7_OPMinit();
				}
			}
		};
		window.attachEvent("onload", P7_OPMinit);
		window.attachEvent("onunload", P7_OPMbb);
		window.attachEvent("onresize", P7_OPMrsz);
	}
}

P7_OPMaddLoad();
function P7_OPMop(){
	if (!document.getElementById) {
		return;
	}
	p7OPM.ctl[p7OPM.ctl.length] = arguments;
}

function P7_OPMinit(){
	var i, k, el, tB, tW, pW, tA, tP, dv, w, frms, kj, m;
	if (p7OPM.ctl.length < 1) {
		return;
	}
	if (p7OPM.once) {
		return;
	}
	p7OPM.once = true;
	for (k = 0; k < p7OPM.ctl.length; k++) {
		tB = document.getElementById(p7OPM.ctl[k][0]);
		if (tB) {
			tB.p7opt = p7OPM.ctl[k];
			P7_OPMremClass(tB, 'opm-noscript');
			tB.opmTabs = [];
			tB.opmPanels = [];
			tB.opmPrevPanelNum = 0;
			tB.opmPrevPanel = null;
			tB.opmCurPanelNum = 0;
			tB.opmCurPanel = null;
			tB.opmBreakPoint = 0;
			tB.opmControls = [];
			tB.opmNumPlays = 1;
			tB.opmShowMode = 'pause';
			pW = document.getElementById(tB.id.replace('_', 'pw_'));
			tB.opmPanelWrapper = pW;
			pW.opmDiv = tB.id;
			tW = document.getElementById(tB.id.replace('_', 'tw_'));
			tB.opmTabWrap = tW;
			tW.opmDiv = tB.id;
			el = document.getElementById(tB.id.replace('_', 'ww_'));
			el.opmDiv = tB.id;
			if (tB.p7opt[13] == 1) {
				P7_OPMassignSwipe(pW);
			}
			el = document.getElementById(tB.id.replace('_', 'tb_'));
			tB.opmTabDiv = el;
			if (tB.p7opt[4] == 2) {
				tW.style.width = tB.p7opt[5] + tB.p7opt[6];
			}
			el = tW.getElementsByTagName('UL')[0];
			tA = el.getElementsByTagName('A');
			for (i = 0; i < tA.length; i++) {
				tB.opmTabs[i] = tA[i];
				tB.opmPanels[i] = null;
				tA[i].opmDiv = tB.id;
				tA[i].opmPanelNum = i + 1;
				tA[i].opmPanel = false;
				tA[i].opmState = 'closed';
				tB.opmBreakPoint += tA[i].parentNode.offsetWidth;
				P7_OPMaddEvent(tA[i], 'click', function(evt){
					evt = (evt) ? evt : event;
					if (!P7_OPMclick(this)) {
						evt.preventDefault();
					}
				});
				dv = document.createElement('div');
				dv.className = 'opm-accordion-trig';
				el = tA[i].cloneNode(true);
				el.id = tA[i].id.replace('tg_', 'ta_');
				tA[i].opmAcTrig = el;
				el.opmTrig = tA[i];
				dv.appendChild(el);
				tP = document.getElementById(tA[i].id.replace('tg_', 'pn_'));
				if (tP) {
					tP.opmDiv = tB.id;
					tP.opmPanelNum = i + 1;
					tA[i].opmPanel = tP;
					tB.opmPanels[i] = tP;
					tP.opmState = 'closed';
					tP.parentNode.insertBefore(dv, tP);
					frms = tP.getElementsByTagName('IFRAME');
					if (frms && frms.length) {
						tP.opmFrames = [];
						for (kj = 0; kj < frms.length; kj++) {
							if (/video-wrapper/.test(frms[kj].parentNode.className)) {
								tP.opmFrames[kj] = frms[kj];
								frms[kj].opmSrc = frms[kj].src;
								frms[kj].src = '';
							}
						}
					}
				} else {
				}
				P7_OPMaddEvent(el, 'click', function(evt){
					evt = (evt) ? evt : event;
					if (!P7_OPMclick(this.opmTrig)) {
						evt.preventDefault();
					}
				});
			}
			tB.opmControls[0] = P7_OPMsetCC(tB.id, 'bp_', 'prev');
			tB.opmControls[1] = P7_OPMsetCC(tB.id, 'bn_', 'next');
			tB.opmControls[3] = P7_OPMsetCC(tB.id, 'rp_', 'prev');
			tB.opmControls[5] = P7_OPMsetCC(tB.id, 'rn_', 'next');
			el = document.getElementById(tB.id.replace('_', 'rpp_'));
			if (el) {
				el.p7state = 'pause';
				el.opmDiv = tB.id;
				tB.opmControls[4] = el;
				el.onclick = function(){
					var ac = (this.p7state == 'play') ? 'pause' : 'play';
					P7_OPMcontrol(this.opmDiv, ac);
					return false;
				};
				el.opmSetButtonState = function(st){
					if (st == 'play') {
						P7_OPMsetClass(this, 'pause-icon');
					} else {
						P7_OPMremClass(this, 'pause-icon');
					}
				};
			}
			tB.opmPaginators = [];
			el = document.getElementById(tB.id.replace('_', 'pg_'));
			if (el) {
				tA = el.getElementsByTagName('A');
				if (tA) {
					for (i = 0; i < tA.length; i++) {
						if (tA[i].id && tA[i].id.indexOf('p7OPMpg') === 0 && tA[i].id.indexOf('p7OPMpgpp_') == -1) {
							tA[i].opmDiv = tB.id;
							tA[i].opmPanelNum = P7_OPMparsePN(tA[i].id);
							tB.opmPaginators[tB.opmPaginators.length] = tA[i];
							tA[i].onclick = function(){
								return P7_OPMpaginator(this);
							};
						}
					}
				}
			}
			el = document.getElementById(tB.id.replace('_', 'pgpp_'));
			if (el) {
				el.p7state = 'pause';
				el.opmDiv = tB.id;
				tB.opmControls[7] = el;
				el.onclick = function(){
					var ac = (this.p7state == 'play') ? 'pause' : 'play';
					P7_OPMcontrol(this.opmDiv, ac);
					return false;
				};
				el.opmSetButtonState = function(st){
					if (st == 'play') {
						P7_OPMsetClass(this, 'pause-icon');
					} else {
						P7_OPMremClass(this, 'pause-icon');
					}
				};
			}
			tB.opmPanelNums = tB.opmPanels.length;
			tB.opmShowMode = 'pause';
			tB.opmNumPlays = 1;
			tB.opmDefPanel = tB.p7opt[1];
			P7_OPMurl(tB.id);
			if (tB.p7opt[7] == 1) {
				tB.opmShowMode = 'play';
				tB.opmShowResume = false;
				if (tB.opmControls[4]) {
					tB.opmControls[4].p7state = 'play';
					tB.opmControls[4].opmSetButtonState('play');
				}
				if (tB.opmControls[7]) {
					tB.opmControls[7].p7state = 'play';
					tB.opmControls[7].opmSetButtonState('play');
				}
			}
			if (tB.opmDefPanel > 0) {
				m = true;
				if (tB.p7opt[14] == 1 && P7_OPMgetMode(tB) == 'accordion') {
					m = false;
				}
				if (m) {
					P7_OPMopen(tB.id, tB.opmDefPanel, 1);
				}
			}
			P7_OPMresizer(tB);
		}
	}
}

function P7_OPMclick(a){
	var tB, m = false;
	tB = document.getElementById(a.opmDiv);
	tB.opmDirection = null;
	P7_OPMopen(a.opmDiv, a.opmPanelNum);
	return m;
}

function P7_OPMctrl(dv, ac){
	return P7_OPMcontrol(dv, ac);
}

function P7_OPMcontrol(dv, ac, bp, tch){
	var i, a, tB, cs, ts, op, sn, tm = 0, rs = false, m = false;
	tB = document.getElementById(dv);
	if (tB && tB.opmTabs) {
		if (tB.opmShowTimer) {
			clearTimeout(tB.opmShowTimer);
		}
		cs = tB.opmCurPanelNum;
		ts = tB.opmPanelNums;
		if (ac == 'pause') {
			P7_OPMpause(dv);
			return m;
		}
		if (!bp && tB.p7opt[11] == 1) {
			P7_OPMpause(dv);
			tB.opmShowResume = false;
		}
		if (ac == 'play') {
			tB.opmShowMode = 'play';
			tB.opmShowResume = false;
			if (tB.opmControls[4]) {
				tB.opmControls[4].p7state = 'play';
				tB.opmControls[4].opmSetButtonState('play');
			}
			if (tB.opmControls[7]) {
				tB.opmControls[7].p7state = 'play';
				tB.opmControls[7].opmSetButtonState('play');
			}
			ac = 'next';
			rs = true;
		}
		if (ac == 'first') {
			tB.opmDirection = 'left';
			sn = 1;
		} else if (ac == 'prev') {
			tB.opmDirection = 'left';
			sn = cs - 1;
			if (sn < 1) {
				sn = ts;
			}
		} else if (ac == 'next') {
			sn = cs + 1;
			tB.opmDirection = 'right';
			if (tB.opmShowMode == 'play') {
				if (sn > ts) {
					tB.opmNumPlays++;
					if (tB.p7opt[9] > 0 && tB.opmNumPlays > tB.p7opt[9]) {
						tB.opmNumPlays = 0;
						sn = (tB.p7opt[10] == 1) ? 1 : tB.opmPanelNums;
						P7_OPMpause(tB.id);
					} else {
						sn = 1;
					}
				}
			} else {
				if (sn > ts) {
					sn = 1;
				}
			}
		} else if (ac == 'last') {
			tB.opmDirection = 'right';
			sn = ts;
		} else {
			tB.opmDirection = 'right';
			sn = ac;
		}
		sn = (sn < 1) ? 1 : sn;
		sn = (sn > tB.opmPanelNums) ? tB.opmPanelNums : sn;
		if (sn == tB.opmCurrentPanelNum && bp != 1) {
			return m;
		}
		a = tB.opmTabs[sn - 1];
		if (rs) {
			tm = 100;
			setTimeout(function(){
				P7_OPMopen(tB.id, sn, bp, tch);
			}, tm);
		} else {
			P7_OPMopen(tB.id, sn, bp, tch);
		}
	}
	return false;
}

function P7_OPMpause(d){
	var cD, tB = document.getElementById(d);
	if (tB) {
		tB.opmShowMode = 'pause';
		if (tB.opmShowTimer) {
			clearTimeout(tB.opmShowTimer);
		}
		if (tB.opmControls[4]) {
			tB.opmControls[4].p7state = 'pause';
			tB.opmControls[4].opmSetButtonState('pause');
		}
		if (tB.opmControls[7]) {
			tB.opmControls[7].p7state = 'pause';
			tB.opmControls[7].opmSetButtonState('pause');
		}
	}
}

function P7_OPMpaginator(a){
	P7_OPMcontrol(a.opmDiv, a.opmPanelNum);
	return false;
}

function P7_OPMsetPaginators(d){
	var i, tB, tA;
	tB = document.getElementById(d);
	tA = tB.opmPaginators;
	for (i = 0; i < tA.length; i++) {
		if (tA[i]) {
			P7_OPMremClass(tA[i], 'down');
			if (tA[i].opmPanelNum == tB.opmCurPanelNum) {
				P7_OPMsetClass(tA[i], 'down');
			}
		}
	}
}

function P7_OPMopen(dv, sn, bp, tch){
	var x, a, tB, pW, cP, wW, tW, md, an, dur, ph, nh, mh, tm, cls;
	bp = (bp) ? bp : null;
	tB = document.getElementById(dv);
	md = P7_OPMgetMode(tB);
	if (!tB.opmTabs[sn - 1]) {
		return false;
	}
	a = tB.opmTabs[sn - 1];
	if (a.opmState == 'opened' && md != 'accordion') {
		return;
	}
	tB.opmPrevPanelNum = tB.opmCurPanelNum;
	tB.opmPrevPanel = tB.opmCurPanel;
	if (a.opmState == 'opened') {
		tB.opmCurPanelNum = 0;
		tB.opmCurPanel = null;
		cls = true;
	} else {
		a.opmState = 'opened';
		P7_OPMsetClass(a, 'open');
		P7_OPMsetClass(a.parentNode, 'open');
		P7_OPMsetClass(a.opmAcTrig, 'open');
		tB.opmCurPanelNum = a.opmPanelNum;
		tB.opmCurPanel = a.opmPanel;
		cls = false;
	}
	P7_OPMsetPaginators(tB.id);
	an = tB.p7opt[2];
	dur = tB.p7opt[3];
	if (bp == 1) {
		an = 0;
	}
	if (tch) {
		an = 2;
	}
	pW = document.getElementById(tB.id.replace('_', 'pw_'));
	wW = document.getElementById(tB.id.replace('_', 'ww_'));
	tW = document.getElementById(tB.id.replace('_', 'tb_'));
	mh = 0;
	if (md == 'vtabs') {
		mh = P7_OPMgetDim(tW, 'height');
	}
	cP = a.opmPanel;
	if (md != 'accordion') {
		ph = P7_OPMgetDim(wW, 'height');
		ph = (ph < mh) ? mh : ph;
		if (an > 0) {
			wW.style.height = ph + 'px';
		}
		if (a.opmPanel && !cls) {
			nh = P7_OPMgetDim(cP, 'height');
		} else {
			nh = 0;
		}
		nh = (nh < mh) ? mh : nh;
		tB.opmVPHeightTarget = nh;
		if (an > 0) {
			P7_OPManimate(wW, 'height', 'px', ph, nh, dur, 'quad', function(){
				this.style.height = 'auto';
			});
		}
	}
	if (tB.opmPrevPanelNum && tB.opmPrevPanelNum > 0) {
		if (md != 'accordion') {
			tB.opmPrevPanel.style.position = 'absolute';
		}
		P7_OPMclose(tB.id, tB.opmPrevPanelNum, bp, tch);
	}
	if (cls) {
		return;
	}
	if (a.opmPanel) {
		P7_OPMsetClass(cP, 'current-panel');
		if (cP.opmFrames) {
			P7_OPMframes(cP, 'on');
		}
		if (md == 'accordion' && an > 0) {
			cP.style.height = 'auto';
			nh = P7_OPMgetDim(cP, 'height');
			cP.style.height = '0px';
			cP.style.height = '0px';
			cP.style.left = '0px';
			cP.style.top = '0px';
			cP.style.position = 'relative';
			cP.style.visibility = 'visible';
			cP.offsetWidth = cP.offsetWidth;
			cP.style[p7OPM.prf + 'transition'] = 'height ' + dur + 'ms ease';
			cP.style.height = nh + 'px';
			if (cP.opmAnimC) {
				clearTimeout(cP.opmAnimC);
			}
			cP.opmAnimC = setTimeout(function(){
				P7_OPMfinOpen(tB, cP, wW);
			}, dur);
		} else {
			if (an == 1) {
				cP.style.opacity = 0;
				cP.style.visibility = 'visible';
				cP.offsetWidth = cP.offsetWidth;
				cP.style.left = '0px';
				cP.style.top = '0px';
				cP.style.position = 'relative';
				cP.style[p7OPM.prf + 'transition'] = 'opacity ' + dur + 'ms ease';
				cP.style.opacity = 1;
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinOpen(tB, cP, wW);
				}, dur);
			} else if (an == 2) {
				if (tB.opmDirection == 'right') {
					x = cP.offsetWidth;
				} else if (tB.opmDirection == 'left') {
					x = cP.offsetWidth * -1;
				} else {
					if (tB.opmCurPanelNum > tB.opmPrevPanelNum) {
						x = cP.offsetWidth;
					} else {
						x = cP.offsetWidth * -1;
					}
				}
				cP.style.top = '0px';
				cP.style.left = x + 'px';
				cP.style.position = 'relative';
				cP.style.visibility = 'visible';
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'left ' + dur + 'ms ease';
				cP.style.left = '0px';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinOpen(tB, cP, wW);
				}, dur);
			} else if (an == 3) {
				if (tB.opmDirection == 'right') {
					x = cP.offsetHeight * -1;
				} else if (tB.opmDirection == 'left') {
					x = wW.offsetHeight;
				} else {
					if (tB.opmCurPanelNum > tB.opmPrevPanelNum) {
						x = cP.offsetHeight * -1;
					} else {
						x = wW.offsetHeight;
					}
				}
				cP.style.left = '0px';
				cP.style.top = x + 'px';
				cP.style.position = 'relative';
				cP.style.visibility = 'visible';
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'top ' + dur + 'ms ease';
				cP.style.top = '0px';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinOpen(tB, cP, wW);
				}, dur);
			} else if (an == 4) {
				cP.style[p7OPM.prf + 'transform'] = 'scale(0.1)';
				cP.style.opacity = 1;
				cP.style.left = '0px';
				cP.style.top = '0px';
				cP.style.position = 'relative';
				cP.style.visibility = 'visible';
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = p7OPM.prf + 'transform ' + dur + 'ms linear';
				cP.style[p7OPM.prf + 'transform'] = 'scale(1)';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinOpen(tB, cP, wW);
				}, dur);
			} else if (an == 5) {
				cP.style[p7OPM.prf + 'transform'] = 'scale(0.1,1)';
				cP.style.opacity = 1;
				cP.style.left = '0px';
				cP.style.top = '0px';
				cP.style.position = 'relative';
				cP.style.visibility = 'visible';
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = p7OPM.prf + 'transform ' + dur + 'ms linear';
				cP.style[p7OPM.prf + 'transform'] = 'scale(1,1)';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinOpen(tB, cP, wW);
				}, dur);
			} else {
				cP.style.top = '0px';
				cP.style.left = '0px';
				cP.style.visibility = 'visible';
				cP.style.position = 'relative';
				wW.style.height = 'auto';
			}
		}
	} else {
		if (md != 'accordion') {
			if (an > 0) {
				wW.style.height = 'auto';
			} else {
				wW.style.height = 'auto';
			}
		}
	}
	if (md == 'accordion' && bp != 1) {
		if (tB.opmSTEanim) {
			clearTimeout(tB.opmSTEanim);
		}
		tB.opmSTEanim = setTimeout(function(){
			P7_OPMste(a.opmAcTrig);
		}, dur + 100);
	}
	if (tB.p7opt[4] == 3) {
		if (tB.opmShowMode == 'play') {
			tm = tB.p7opt[8] * 1000;
			tm += tB.p7opt[3];
			if (tB.opmInit) {
				tB.opmInit = false;
				tm = tB.p7opt[12] * 1000;
			}
			tB.opmShowResume = false;
			if (tB.opmShowTimer) {
				clearTimeout(tB.opmShowTimer);
			}
			tB.opmShowTimer = setTimeout(function(){
				P7_OPMcontrol(tB.id, 'next', 2);
			}, tm);
		}
	}
}

function P7_OPMfinOpen(tB, cP, wW){
	if (tB.opmCurPanel == cP) {
		if (tB.p7opt[1] > 0) {
			cP.style[p7OPM.prf + 'transition'] = null;
			cP.style[p7OPM.prf + 'transform'] = null;
		}
		cP.style.height = 'auto';
	}
}

function P7_OPMclose(dv, sn, bp, tch){
	var x, a, tB, wW, md, an, cP, dur;
	bp = (bp) ? bp : null;
	tB = document.getElementById(dv);
	if (!tB.opmTabs[sn - 1]) {
		return false;
	}
	a = tB.opmTabs[sn - 1];
	if (a.opmState == 'closed') {
		return;
	}
	a.opmState = 'closed';
	tB = document.getElementById(a.opmDiv);
	wW = document.getElementById(tB.id.replace('_', 'ww_'));
	md = P7_OPMgetMode(tB);
	an = tB.p7opt[2];
	dur = tB.p7opt[3];
	if (bp == 1) {
		an = 0;
	}
	if (tch) {
		an = 2;
	}
	P7_OPMremClass(a, 'open');
	P7_OPMremClass(a.parentNode, 'open');
	P7_OPMremClass(a.opmAcTrig, 'open');
	if (a.opmPanel) {
		cP = a.opmPanel;
		P7_OPMremClass(cP, 'current-panel');
		if (cP.opmFrames) {
			P7_OPMframes(cP, 'off');
		}
		if (md == 'accordion' && an > 0) {
			cP.style.height = P7_OPMgetDim(cP, 'height') + 'px';
			cP.offsetWidth = cP.offsetWidth;
			cP.style[p7OPM.prf + 'transition'] = 'height ' + dur + 'ms ease';
			cP.style.height = '0px';
			if (cP.opmAnimC) {
				clearTimeout(cP.opmAnimC);
			}
			cP.opmAnimC = setTimeout(function(){
				P7_OPMfinClose(tB, cP);
			}, dur);
		} else {
			if (an == 1) {
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'opacity ' + dur + 'ms ease-out';
				cP.style.opacity = 0;
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinClose(tB, cP);
				}, dur);
			} else if (an == 2) {
				if (tB.opmDirection == 'right') {
					x = cP.offsetWidth * -1;
				} else if (tB.opmDirection == 'left') {
					x = cP.offsetWidth;
				} else {
					if (tB.opmCurPanelNum > tB.opmPrevPanelNum) {
						x = cP.offsetWidth * -1;
					} else {
						x = cP.offsetWidth;
					}
				}
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'left ' + dur + 'ms ease';
				cP.style.left = x + 'px';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinClose(tB, cP);
				}, dur);
			} else if (an == 3) {
				if (tB.opmCurPanelNum > tB.opmPrevPanelNum) {
					x = tB.opmVPHeightTarget;
				} else {
					x = wW.offsetHeight * -1;
				}
				if (tB.opmDirection == 'right') {
					x = tB.opmVPHeightTarget;
				} else if (tB.opmDirection == 'left') {
					x = wW.offsetHeight * -1;
				} else {
					if (tB.opmCurPanelNum > tB.opmPrevPanelNum) {
						x = tB.opmVPHeightTarget;
					} else {
						x = wW.offsetHeight * -1;
					}
				}
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'top ' + dur + 'ms ease';
				cP.style.top = x + 'px';
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinClose(tB, cP);
				}, dur);
			} else if (an == 4 || an == 5) {
				cP.offsetWidth = cP.offsetWidth;
				cP.style[p7OPM.prf + 'transition'] = 'opacity ' + dur + 'ms ease-out';
				cP.style.opacity = 0;
				if (cP.opmAnimC) {
					clearTimeout(cP.opmAnimC);
				}
				cP.opmAnimC = setTimeout(function(){
					P7_OPMfinClose(tB, cP);
				}, dur);
			} else {
				cP.style.position = 'absolute';
				cP.style.top = '-9000px';
				cP.style.left = '-9000px';
				cP.style.visibility = 'hidden';
			}
		}
	}
}

function P7_OPMfinClose(tB, cP){
	if (tB.opmCurPanel != cP) {
		if (tB.p7opt[1] > 0) {
			cP.style[p7OPM.prf + 'transition'] = null;
			cP.style[p7OPM.prf + 'transform'] = null;
			cP.style.opacity = 1;
		}
		cP.style.position = 'absolute';
		cP.style.top = '-9000px';
		cP.style.left = '-9000px';
		cP.style.visibility = 'hidden';
		cP.style.height = 'auto';
	}
}

function P7_OPManimate(ob, prop, un, fv, tv, dur, typ, cb){
	if (ob.p7AnimRunning) {
		ob.p7AnimRunning = false;
		clearInterval(ob.p7OPManim);
	}
	typ = (!typ) ? 'quad' : typ;
	ob.p7animType = typ;
	ob.p7animProp = prop;
	ob.p7animUnit = un;
	ob.p7animStartVal = fv;
	ob.p7animCurrentVal = ob.p7animStartVal;
	ob.p7animFinishVal = tv;
	ob.style[ob.p7animProp] = ob.p7animCurrentVal + ob.p7animUnit;
	ob.style.visibility = 'visible';
	ob.p7animStartTime = P7_OPMgetTime(0);
	ob.p7animDuration = dur;
	if (!ob.p7AnimRunning) {
		ob.p7AnimRunning = true;
		ob.p7OPManim = setInterval(function(){
			P7_OPManimator(ob, cb);
		}, p7OPM.animDelay);
	}
}

function P7_OPManimator(el, cb, op){
	var i, tB, tA, tS, et, nv, m = false;
	et = P7_OPMgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_OPManim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.style[el.p7animProp] = nv + el.p7animUnit;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7OPManim);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_OPManim(tp, t, b, c, d){
	if (tp == 'quad') {
		return -c * (t /= d) * (t - 2) + b;
	} else if (tp == 'cubic') {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	} else {
		return (c * (t / d)) + b;
	}
}

function P7_OPMgetTime(st){
	var d = new Date();
	return d.getTime() - st;
}

function P7_OPMste(el){
	var st, t, bD, sb, se;
	bD = document.body;
	bD.p7AnimRunning = false;
	if (bD.p7STEanim) {
		clearInterval(bD.p7STEanim);
	}
	if (bD.p7STTanim) {
		clearInterval(bD.p7STTanim);
	}
	if (bD.p7DMManim) {
		clearInterval(bD.p7DMManim);
	}
	if (bD.p7STTanim) {
		clearInterval(bD.p7LBNAVanim);
	}
	if (bD.p7STTanim) {
		clearInterval(bD.p7SOManim);
	}
	sb = document.body.scrollTop;
	se = document.documentElement.scrollTop;
	st = sb;
	if (se > sb) {
		st = se;
	}
	t = st + el.getBoundingClientRect().top;
	t -= el.offsetHeight;
	if (p7OPM.defAnim == 1) {
		bD.p7animType = 'quad';
		bD.p7animStartVal = st;
		bD.p7animCurrentVal = bD.p7animStartVal;
		bD.p7animFinishVal = t;
		bD.p7animStartTime = P7_OPMgetTime(0);
		bD.p7animDuration = p7OPM.defDuration;
		if (!bD.p7AnimRunning) {
			bD.p7AnimRunning = true;
			bD.p7STEanim = setInterval(function(){
				P7_OPMsteA(bD);
			}, p7OPM.animDelay);
		}
	} else {
		bD.body.scrollTop = t;
		document.documentElement.scrollTop = t;
		if (typeof(P7_STTrsz) == 'function') {
			P7_STTrsz();
		}
	}
	return false;
}

function P7_OPMsteA(el){
	var et, nv, m = false;
	et = P7_OPMgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_OPManim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.scrollTop = nv;
		document.documentElement.scrollTop = nv;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7STEanim);
		if (typeof(P7_STTrsz) == 'function') {
			P7_STTrsz();
		}
	}
}

function P7_OPMrsz(){
	var i, d;
	for (i = 0; i < p7OPM.ctl.length; i++) {
		d = document.getElementById(p7OPM.ctl[i][0]);
		if (d) {
			P7_OPMresizer(d);
		}
	}
}

function P7_OPMresizer(tB){
	var i, w = 10;
	if (!tB) {
		return;
	}
	if (tB.p7opt[4] == 1) {
		if (tB.offsetWidth <= (tB.opmBreakPoint + 10)) {
			P7_OPMsetClass(tB, 'opm-v-tabs');
			tB.opmTabWrap.style.width = tB.p7opt[5] + tB.p7opt[6];
		} else {
			P7_OPMremClass(tB, 'opm-v-tabs');
			tB.opmTabWrap.style.width = 'auto';
		}
	}
}

function P7_OPMframes(el, ac){
	var i, tD;
	if (el && el.opmFrames && el.opmFrames.length) {
		for (i = 0; i < el.opmFrames.length; i++) {
			if (ac == 'on') {
				el.opmFrames[i].src = el.opmFrames[i].opmSrc;
			} else {
				el.opmFrames[i].src = '';
			}
		}
	}
}

function P7_OPMassignSwipe(el){
	var fn = function(evt){
		var x, y, tch, tB, md;
		evt = (evt) ? evt : event;
		tch = (evt.touches && evt.touches[0]) ? true : false;
		if (tch && evt.touches.length > 1) {
			P7_OPMtchCancel(evt);
			return;
		}
		tB = document.getElementById(this.opmDiv);
		md = P7_OPMgetMode(tB);
		if (md == 'accordion') {
			P7_OPMtchCancel();
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7OPM.startX = x;
		p7OPM.startY = y;
		if (!p7OPM.tchEl) {
			p7OPM.tchEl = this;
		}
	};
	if ('ontouchstart' in window) {
		P7_OPMaddEvent(el, 'touchstart', fn);
		P7_OPMaddEvent(el, 'touchmove', P7_OPMtchMove);
		P7_OPMaddEvent(el, 'touchend', P7_OPMtchEnd);
	} else {
		if (navigator.maxTouchPoints) {
			P7_OPMaddEvent(el, 'pointerdown', fn);
			P7_OPMaddEvent(el, 'pointermove', P7_OPMtchMove);
			P7_OPMaddEvent(el, 'pointerup', P7_OPMtchEnd);
		} else if (navigator.msMaxTouchPoints) {
			P7_OPMaddEvent(el, 'MSPointerDown', fn);
			P7_OPMaddEvent(el, 'MSPointerMove', P7_OPMtchMove);
			P7_OPMaddEvent(el, 'MSPointerUp', P7_OPMtchEnd);
		}
	}
}

function P7_OPMtchMove(evt){
	var tch, el, x, y, swl, cl;
	evt = (evt) ? evt : event;
	tch = (evt.touches && evt.touches[0]) ? true : false;
	if (p7OPM.tchEl) {
		el = p7OPM.tchEl;
		if (tch && evt.touches.length > 1) {
			P7_OPMtchCancel(evt);
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7OPM.curX = x;
		p7OPM.curY = y;
		swl = p7OPM.curX - p7OPM.startX;
		cl = (p7OPM.curX === 0 && p7OPM.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			P7_OPMtchEnd();
		}
		if (!cl && Math.abs(swl) > 4) {
			evt.preventDefault();
		}
	} else {
		P7_OPMtchCancel();
	}
}

function P7_OPMtchEnd(evt){
	if (p7OPM.tchEl) {
		var swl, el, dir, cl;
		el = p7OPM.tchEl;
		p7OPM.tchEl = null;
		swl = p7OPM.curX - p7OPM.startX;
		cl = (p7OPM.curX === 0 && p7OPM.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			if (swl < 0) {
				dir = 'left';
			} else {
				dir = 'right';
			}
			if (dir == 'left') {
				P7_OPMcontrol(el.opmDiv, 'next', null, true);
			} else if (dir == 'right') {
				P7_OPMcontrol(el.opmDiv, 'prev', null, true);
			}
		}
		P7_OPMtchCancel();
	} else {
		P7_OPMtchCancel();
	}
}

function P7_OPMtchCancel(){
	p7OPM.tchEl = null;
	p7OPM.startX = 0;
	p7OPM.startY = 0;
	p7OPM.curX = 0;
	p7OPM.curY = 0;
}

function P7_OPMurl(dv){
	var i, h, s, x, k, d = 'opm', pn, tB, n = dv.replace('p7OPM_', '');
	tB = document.getElementById(dv);
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
					if (x && x.length > 2) {
						tB.opmDefPanel = P7_OPMparsePN(x);
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
		if (x && x.indexOf(d) === 0 && x.length > 5) {
			tB.opmDefPanel = P7_OPMparsePN(x);
		}
	}
}

function P7_OPMgetDim(el, d){
	var b, x;
	b = el.getBoundingClientRect();
	if (d == 'height') {
		x = b.bottom - b.top;
	} else if (d == 'width') {
		x = b.right - b.left;
	}
	return x;
}

function P7_OPMgetMode(tB){
	var cl, md = 'normal';
	if (P7_OPMgetStyle(tB, 'max-height') == '700777px') {
		md = 'accordion';
	} else {
		cl = tB.className;
		if (cl && cl !== '' && cl.indexOf('opm-v-tabs') > -1) {
			md = 'vtabs';
		}
	}
	return md;
}

function P7_OPMparsePN(d){
	var x = d.lastIndexOf('_');
	return parseInt(d.substr(x + 1), 10);
}

function P7_OPMsetClass(ob, cl){
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

function P7_OPMremClass(ob, cl){
	if (ob) {
		var cc, nc;
		cc = ob.className;
		cl = cl.replace('-', '\-');
		var re = new RegExp('\\b' + cl + '\\b');
		if (re.test(cc)) {
			nc = cc.replace(re, '');
			nc = nc.replace(/\s+/g, ' ');
			nc = nc.replace(/\s$/, '');
			nc = nc.replace(/^\s/, '');
			ob.className = nc;
		}
	}
}

function P7_OPMgetStyle(el, s){
	if (el.currentStyle) {
		s = el.currentStyle[s];
	} else if (document.defaultView && document.defaultView.getComputedStyle) {
		s = document.defaultView.getComputedStyle(el, "")[s];
	} else {
		s = el.style[s];
	}
	return s;
}

function P7_OPMgetIEver(){
	var j, v = -1, nv, m = false;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7OPM.ie = v;
	}
	return v;
}

function P7_OPMaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_OPMgetCSSPre(){
	var i, dV, pre = ['animationDuration', 'WebkitAnimationDuration'];
	var c = 'none', cssPre = ['', '-webkit-'];
	dV = document.createElement('div');
	for (i = 0; i < pre.length; i++) {
		if (dV.style[pre[i]] !== undefined) {
			c = cssPre[i];
			break;
		}
	}
	return c;
}

function P7_OPMsetCC(dd, rp, ac){
	var d, tC;
	d = dd.replace('_', rp);
	tC = document.getElementById(d);
	if (tC) {
		tC.onclick = function(){
			return P7_OPMcontrol(dd, ac);
		};
	}
	return tC;
}
