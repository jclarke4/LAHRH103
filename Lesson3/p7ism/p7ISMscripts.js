
/* 
 ================================================
 PVII Info Slider scripts
 Copyright (c) 2018-2020 Project Seven Development
 www.projectseven.com
 Version: 1.1.8 -build 16
 ================================================
 
 */
var p7ISMtext = {
	playShow: 'Start Auto Play',
	pauseShow: 'Pause Auto Play'
};
var p7ISM = {
	ctl: [],
	once: false,
	prf: 'none',
	ie: false,
	downKey: null
};
function P7_ISMaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_ISMinit, false);
		window.addEventListener("load", P7_ISMinit, false);
		window.addEventListener("resize", P7_ISMrsz, false);
		document.addEventListener("keydown", P7_ISMkey, false);
		document.addEventListener("keyup", P7_ISMkeyup, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", P7_ISMinit);
		document.attachEvent("onkeydown", P7_ISMkey);
		document.attachEvent("onkeyup", P7_ISMkeyup);
		window.attachEvent("onresize", P7_ISMrsz);
	}
}

P7_ISMaddLoad();
function P7_ISMinit(){
	var i, x, j, dT, tB, sW, cN, oW, tA, el;
	if (p7ISM.once) {
		return;
	}
	p7ISM.once = true;
	p7ISM.prf = P7_ISMgetCSSPre();
	P7_ISMgetIEver();
	dT = P7_ISMgetByAttribute('data-ism', 'p7ISM_');
	for (j = 0; j < dT.length; j++) {
		p7ISM.ctl[p7ISM.ctl.length] = dT[j];
		tB = dT[j];
		P7_ISMremClass(tB, 'ism-noscript');
		tB.ismOpt = tB.getAttribute('data-ism').split(',');
		sW = document.getElementById(tB.id.replace('_', 'sw_'));
		oW = sW.parentNode;
		oW.ismDiv = tB;
		oW.ismSW = sW;
		P7_ISMaddEvent(sW.parentNode, 'scroll', function(){
			if (this.scrollLeft === 0) {
				P7_ISMcontrol(this.ismDiv.id, 'start');
			} else {
				P7_ISMrsz();
			}
		});
		el = P7_ISMhasFlex(tB);
		if (el) {
			P7_ISMsetClass(el, 'ism-flex-fix');
		}
		tB.ismNumPlays = 1;
		tB.ismDirection = 'right';
		tB.ismShowMode = 'pause';
		tB.ismPanels = [];
		tB.ismCurrPanel = 1;
		tB.ismDefPanel = tB.ismOpt[2];
		if (tB.ismOpt[7] == 1) {
			P7_ISMrandomizer(sW);
		}
		cN = P7_ISMgetByClass(sW, 'ism-panel', 'DIV');
		x = 0;
		for (i = 0; i < cN.length; i++) {
			x++;
			tB.ismPanels[x] = cN[i];
			cN[i].ismPanelNum = x;
			cN[i].ismDiv = tB;
		}
		tB.ismPanelNums = x;
		if (tB.ismPanels.length < 1) {
			return;
		}
		tB.ismLastPanel = tB.ismPanels[tB.ismPanels.length - 1];
		tB.ismPags = [];
		el = document.getElementById(tB.id.replace('_', 'pg_'));
		if (el) {
			tA = el.getElementsByTagName('A');
			for (i = 0; i < tA.length; i++) {
				tB.ismPags[i] = tA[i];
				tA[i].ismDiv = tB;
				tA[i].ismPagIndex = i;
				tA[i].onclick = function(){
					P7_ISMpaginator(this);
					return false;
				};
			}
		}
		P7_ISMpagsReset(tB);
		tB.ismSW = sW;
		sW.ismDiv = tB;
		P7_ISMassignSwipe(tB);
		el = document.getElementById(tB.id.replace('_', 'tal_'));
		if (el) {
			el.ismDiv = tB;
			tB.ismLeftA = el;
			el.onclick = function(){
				P7_ISMcontrol(this.ismDiv.id, 'left');
				return false;
			};
		}
		el = document.getElementById(tB.id.replace('_', 'tar_'));
		if (el) {
			el.ismDiv = tB;
			tB.ismRightA = el;
			el.onclick = function(){
				P7_ISMcontrol(this.ismDiv.id, 'right');
				return false;
			};
		}
		tB.ismControls = [];
		tB.ismControls[0] = null;
		el = document.getElementById(tB.id.replace('_', 'pp_'));
		if (el) {
			el.p7state = 'pause';
			el.ismDiv = tB;
			P7_ISMsetClass(el, 'paused');
			el.setAttribute('title', p7ISMtext.playShow);
			tB.ismControls[0] = el;
			el.onclick = function(){
				var ac = (this.p7state == 'play') ? 'pause' : 'play';
				P7_ISMcontrol(this.ismDiv.id, ac, 3);
				return false;
			};
			el.ismSetButtonState = function(st){
				var tx;
				if (st == 'play') {
					tx = p7ISMtext.pauseShow;
					P7_ISMremClass(this, 'paused');
				} else {
					tx = p7ISMtext.playShow;
					P7_ISMsetClass(this, 'paused');
				}
				this.setAttribute('title', tx);
			};
		}
		if (tB.ismOpt[4] == 1) {
			tB.ismShowMode = 'play';
			tB.ismShowResume = false;
			if (tB.ismControls[0]) {
				tB.ismControls[0].p7state = 'play';
				tB.ismControls[0].ismSetButtonState('play');
			}
		}
		P7_ISMarws(tB, false);
		if (!tB.ismControls[0] && tB.ismOpt[9] == 1) {
			P7_ISMsetPomo(tB);
		}
		P7_ISMurl(tB.id);
		P7_ISMgotToPanel(tB.id, tB.ismDefPanel, 1);
	}
}

function P7_ISMctrl(dv, ac){
	return P7_ISMcontrol(dv, ac);
}

function P7_ISMcontrol(dv, ac, bp){
	var tB, cs, ts, nx, rs, fp, m = false, sn, lp, pauseOnAction;
	tB = document.getElementById(dv);
	if (tB) {
		if (tB.ismShowTimer) {
			clearTimeout(tB.ismShowTimer);
		}
		pauseOnAction = (tB.ismOpt[8] == 1) ? true : false;
		cs = parseInt(tB.ismCurrPanel, 10);
		ts = parseInt(tB.ismPanelNums, 10);
		if (ac == 'pause') {
			if (bp !== 3) {
				if (tB.ismOpt[9] == 1 && tB.ismShowMode == 'play') {
					tB.ismShowResume = true;
				} else {
					tB.ismShowResume = false;
				}
			}
			P7_ISMpause(dv);
			return m;
		}
		if (!bp && pauseOnAction) {
			if (tB.ismOpt[9] == 1 && tB.ismShowMode == 'play') {
				tB.ismShowResume = true;
			}
			P7_ISMpause(dv, ac);
		}
		nx = P7_ISMgetPanelCount(tB);
		fp = P7_ISMgetFirstPanel(tB);
		if (ac == 'play') {
			tB.ismShowMode = 'play';
			tB.ismShowResume = false;
			if (tB.ismControls[0]) {
				tB.ismControls[0].p7state = 'play';
				tB.ismControls[0].ismSetButtonState('play');
			}
			ac = 'playnext';
			rs = true;
			if (tB.ismDirection == 'right' && fp == (ts - nx + 1)) {
				tB.ismDirection = 'left';
			} else if (tB.ismDirection == 'left' && fp == 1) {
				tB.ismDirection = 'right';
			}
		}
		if (ac == 'start') {
			sn = 1;
		} else if (ac == 'end') {
			sn = ts;
		} else if (ac == 'prev') {
			sn = fp - 1;
		} else if (ac == 'next') {
			sn = fp + 1;
		} else if (ac == 'right') {
			sn = fp + nx;
		} else if (ac == 'left') {
			sn = fp - nx;
		} else if (ac == 'playnext') {
			if (tB.ismShowMode == 'play') {
				if (tB.ismDirection == 'left') {
					if (tB.ismOpt[3] == 1) {
						sn = fp - nx;
						if (tB.ismCurrPanel !== 1 && sn < 1) {
							sn = 1;
						}
					} else {
						sn = fp - 1;
					}
				} else {
					if (tB.ismOpt[3] == 1) {
						sn = fp + nx;
					} else {
						sn = fp + 1;
					}
				}
				lp = false;
				if (tB.ismOpt[3] == 1) {
					if (sn > ts || sn < 1) {
						lp = true;
					}
				} else {
					if (sn > (ts - nx + 1) || sn < 1) {
						lp = true;
					}
				}
				if (lp) {
					tB.ismNumPlays++;
					if (tB.ismOpt[6] > 0 && tB.ismNumPlays > tB.ismOpt[6]) {
						tB.ismNumPlays = 0;
						sn = cs;
						P7_ISMpause(tB.id);
						return;
					} else {
						if (tB.ismDirection == 'right') {
							tB.ismDirection = 'left';
							if (tB.ismOpt[3] == 1) {
								sn = fp - nx;
							} else {
								sn = fp - 1;
							}
						} else {
							tB.ismDirection = 'right';
							if (tB.ismOpt[3] == 1) {
								sn = fp + nx;
							} else {
								sn = fp + 1;
							}
						}
					}
				}
			}
		} else {
			sn = ac;
		}
		sn = (sn < 1) ? 1 : sn;
		sn = (sn > tB.ismPanelNums) ? tB.ismPanelNums : sn;
		P7_ISMgotToPanel(tB.id, sn, bp);
	}
	return false;
}

function P7_ISMpause(d){
	var tB = document.getElementById(d);
	if (tB) {
		tB.ismShowMode = 'pause';
		if (tB.ismShowTimer) {
			clearTimeout(tB.ismShowTimer);
		}
		if (tB.ismControls[0]) {
			tB.ismControls[0].p7state = 'pause';
			tB.ismControls[0].ismSetButtonState('pause');
		}
	}
}

function P7_ISMgotToPanel(dv, pn, bp){
	var tB, sW, tP, dur, min, max, nl;
	tB = document.getElementById(dv);
	if (!tB) {
		return;
	}
	sW = tB.ismSW;
	if (sW.ismAnimRunning) {
		return;
	}
	tP = tB.ismPanels[pn];
	pn = parseInt(pn, 10);
	if (!pn || pn < 0 || pn > tB.ismPanelNums) {
		return;
	}
	tB.ismCurrPanel = pn;
	dur = tB.ismOpt[1];
	min = 0;
	max = ((tB.ismLastPanel.offsetLeft + tB.ismLastPanel.offsetWidth) - sW.parentNode.clientWidth) * -1;
	min += sW.parentNode.scrollLeft;
	max += sW.parentNode.scrollLeft;
	nl = tP.offsetLeft * -1;
	nl = (nl >= min) ? min : nl;
	nl = (nl <= max) ? max : nl;
	sW.offsetWidth = sW.offsetWidth;
	sW.style[p7ISM.prf + 'transition'] = 'transform ' + dur + 'ms ease-out';
	if (p7ISM.prf != 'none') {
		sW.ismAnimRunning = true;
		sW.style[p7ISM.prf + 'transform'] = 'translateX(' + nl + 'px)';
	} else {
		sW.style.left = nl + 'px';
	}
	if (sW.ismAnimC) {
		clearTimeout(sW.ismAnimC);
	}
	sW.ismAnimC = setTimeout(function(){
		sW.ismAnimRunning = false;
		P7_ISMarws(tB, nl);
	}, dur);
	P7_ISMpagsSet(tB);
	P7_ISMdispFin(tB, bp);
}

function P7_ISMdispFin(tB){
	var tm = tB.ismOpt[5] * 1000;
	if (tB.ismShowMode == 'play') {
		tB.ismShowMode = 'play';
		tB.ismShowResume = false;
		if (tB.ismShowTimer) {
			clearTimeout(tB.ismShowTimer);
		}
		tB.ismShowTimer = setTimeout("P7_ISMcontrol('" + tB.id + "','playnext',2)", tm);
	}
}

function P7_ISMgetPanelCount(tB){
	var i, pN, vw, w = 0;
	vw = tB.offsetWidth + 1;
	pN = tB.ismPanels;
	for (i = 1; i < pN.length; i++) {
		w += pN[i].offsetWidth;
		if (w > vw) {
			break;
		}
	}
	return i - 1;
}

function P7_ISMgetFirstPanel(tB){
	var i, sW, cl, pN, ofl = 0;
	sW = tB.ismSW;
	cl = P7_ISMgetCurLeft(sW) * -1;
	pN = tB.ismPanels;
	for (i = 1; i < pN.length; i++) {
		ofl = pN[i].offsetLeft;
		if (ofl >= cl) {
			break;
		}
	}
	return i;
}

function P7_ISMpaginator(a){
	var pc, pn, tB;
	tB = a.ismDiv;
	if (!tB) {
		return;
	}
	pc = P7_ISMgetPanelCount(a.ismDiv);
	pn = (a.ismPagIndex * pc) + 1;
	P7_ISMgotToPanel(a.ismDiv.id, pn);
}

function P7_ISMpagsReset(tB){
	var i, x, pc;
	if (tB.ismPags) {
		pc = P7_ISMgetPanelCount(tB);
		x = Math.ceil(tB.ismPanelNums / pc);
		x--;
		for (i = 0; i < tB.ismPags.length; i++) {
			if (i <= x) {
				tB.ismPags[i].style.display = 'block';
			} else {
				tB.ismPags[i].style.display = 'none';
			}
		}
		P7_ISMpagsSet(tB);
	}
}

function P7_ISMpagsSet(tB){
	var i, pc, x, pn, cp, min = 1, max = 0;
	if (tB.ismPags) {
		pc = P7_ISMgetPanelCount(tB);
		pn = tB.ismPanelNums;
		cp = tB.ismCurrPanel;
		x = Math.floor(pn / cp);
		x--;
		for (i = 0; i < tB.ismPags.length; i++) {
			max += pc;
			if (cp >= min && cp <= max) {
				P7_ISMsetClass(tB.ismPags[i], 'down');
			} else {
				P7_ISMremClass(tB.ismPags[i], 'down');
			}
			min += pc;
		}
	}
}

function P7_ISMarws(tB, tgl){
	var x, min, max, sW = tB.ismSW;
	if (tgl || tgl === 0) {
		x = tgl;
	} else {
		x = P7_ISMgetCurLeft(sW);
	}
	min = sW.parentNode.scrollLeft;
	if (tB.ismLeftA) {
		if (x < (min - 2)) {
			P7_ISMsetClass(tB.ismLeftA.parentNode, 'show');
		} else {
			P7_ISMremClass(tB.ismLeftA.parentNode, 'show');
		}
	}
	if (tB.ismRightA) {
		max = ((tB.ismLastPanel.offsetLeft + tB.ismLastPanel.offsetWidth) - tB.offsetWidth) * -1;
		max += sW.parentNode.scrollLeft;
		if (x > (max + 2)) {
			P7_ISMsetClass(tB.ismRightA.parentNode, 'show');
			if (tB.ismControls[0]) {
				P7_ISMsetClass(tB.ismControls[0].parentNode, 'ism-arrow-on');
			}
		} else {
			P7_ISMremClass(tB.ismRightA.parentNode, 'show');
			if (tB.ismControls[0]) {
				P7_ISMremClass(tB.ismControls[0].parentNode, 'ism-arrow-on');
			}
		}
	}
}

var p7ISMsw = {
	tchEl: null,
	startX: 0,
	startY: 0,
	curX: 0,
	curY: 0
};
function P7_ISMassignSwipe(el){
	var fn = function(evt){
		var x, y, tch;
		evt = (evt) ? evt : event;
		tch = (evt.touches && evt.touches[0]) ? true : false;
		if (tch && evt.touches.length > 1) {
			P7_ISMtchCancel(evt);
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7ISMsw.startX = x;
		p7ISMsw.startY = y;
		if (!p7ISMsw.tchEl) {
			p7ISMsw.tchEl = this;
		}
	};
	if ('ontouchstart' in window) {
		P7_ISMaddEvent(el, 'touchstart', fn);
		P7_ISMaddEvent(el, 'touchmove', P7_ISMtchMove);
		P7_ISMaddEvent(el, 'touchend', P7_ISMtchEnd);
	} else {
		if (navigator.maxTouchPoints) {
			P7_ISMaddEvent(el, 'pointerdown', fn);
			P7_ISMaddEvent(el, 'pointermove', P7_ISMtchMove);
			P7_ISMaddEvent(el, 'pointerup', P7_ISMtchEnd);
		} else if (navigator.msMaxTouchPoints) {
			P7_ISMaddEvent(el, 'MSPointerDown', fn);
			P7_ISMaddEvent(el, 'MSPointerMove', P7_ISMtchMove);
			P7_ISMaddEvent(el, 'MSPointerUp', P7_ISMtchEnd);
		}
	}
}

function P7_ISMtchMove(evt){
	var tch, x, y, swl, cl, el;
	evt = (evt) ? evt : event;
	tch = (evt.touches && evt.touches[0]) ? true : false;
	if (p7ISMsw.tchEl) {
		el = p7ISMsw.tchEl;
		if (tch && evt.touches.length > 1) {
			P7_ISMtchCancel(evt);
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7ISMsw.curX = x;
		p7ISMsw.curY = y;
		swl = p7ISMsw.curX - p7ISMsw.startX;
		cl = (p7ISMsw.curX === 0 && p7ISMsw.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			P7_ISMtchEnd();
		}
		if (!cl && Math.abs(swl) > 20) {
			evt.preventDefault();
		}
	} else {
		P7_ISMtchCancel();
	}
}

function P7_ISMtchEnd(){
	if (p7ISMsw.tchEl) {
		var swl, el, dir, cl;
		el = p7ISMsw.tchEl;
		p7ISMsw.tchEl = null;
		swl = p7ISMsw.curX - p7ISMsw.startX;
		cl = (p7ISMsw.curX === 0 && p7ISMsw.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			if (swl < 0) {
				dir = 'left';
			} else {
				dir = 'right';
			}
			if (dir == 'left') {
				P7_ISMcontrol(el.id, 'right');
			} else if (dir == 'right') {
				P7_ISMscroll(el.id, 'left');
				P7_ISMcontrol(el.id, 'left');
			}
		}
		P7_ISMtchCancel();
	} else {
		P7_ISMtchCancel();
	}
}

function P7_ISMtchCancel(){
	p7ISMsw.tchEl = null;
	p7ISMsw.startX = 0;
	p7ISMsw.startY = 0;
	p7ISMsw.curX = 0;
	p7ISMsw.curY = 0;
}

function P7_ISMurl(dv){
	var tB, h, s, i, d = 'ism', x, sp, n = dv.replace('p7ISM_', '');
	tB = document.getElementById(dv);
	h = document.location.search;
	if (h) {
		h = h.replace('?', '');
		s = h.split(/[=&]/g);
		if (s && s.length) {
			for (i = 0; i < s.length; i += 2) {
				if (s[i] == d) {
					x = s[i + 1];
					sp = x.split('_');
					if (sp.length != 2 || n != sp[0]) {
						x = false;
					}
					if (sp && sp.length == 2) {
						tB.ismDefPanel = sp[1];
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
			tB.ismDefPanel = P7_ISMparsePN(x);
		}
	}
}

function P7_ISMsetPomo(sC){
	sC.addEventListener('pointerover', function(evt){
		this.ismPointerType = evt.pointerType;
	}, false);
	sC.addEventListener('mouseover', function(){
		if (p7ISMsw.tchEL) {
			return;
		}
		if (this.ismPointerType && this.ismPointerType != 'mouse') {
			return;
		}
		if (this.ismShowMode == 'play') {
			P7_ISMpause(this.id);
			this.ismShowResume = true;
		}
	}, false);
	sC.addEventListener('mouseout', function(evt){
		if (p7ISMsw.tchEL) {
			return;
		}
		if (this.ismPointerType && this.ismPointerType != 'mouse') {
			return;
		}
		var tg, pp, m = true, tD = this;
		if (tD.ismShowResume) {
			evt = (evt) ? evt : event;
			tg = (evt.toElement) ? evt.toElement : evt.relatedTarget;
			if (tg) {
				pp = tg;
				while (pp) {
					if (pp == this) {
						m = false;
						break;
					}
					if (pp == tD) {
						break;
					}
					pp = pp.parentNode;
				}
				if (m) {
					tD.ismShowResume = false;
					P7_ISMcontrol(tD.id, 'play');
				}
			}
		}
	}, false);
}

function P7_ISMrsz(){
	var i, nl, tB, sW, min, max, dur = 0;
	for (i = 0; i < p7ISM.ctl.length; i++) {
		tB = p7ISM.ctl[i];
		sW = tB.ismSW;
		nl = tB.ismPanels[tB.ismCurrPanel].offsetLeft * -1;
		min = 0;
		max = ((tB.ismLastPanel.offsetLeft + tB.ismLastPanel.offsetWidth) - sW.parentNode.clientWidth) * -1;
		min += sW.parentNode.scrollLeft;
		max += sW.parentNode.scrollLeft;
		nl = (nl >= min) ? min : nl;
		nl = (nl <= max) ? max : nl;
		if (p7ISM.prf != 'none') {
			sW.style[p7ISM.prf + 'transition'] = 'transform ' + dur + 'ms ease-out';
			sW.style[p7ISM.prf + 'transform'] = 'translateX(' + nl + 'px)';
		} else {
			sW.style.left = nl + 'px';
		}
		P7_ISMarws(tB, nl);
		P7_ISMpagsReset(tB);
	}
}

function P7_ISMkey(evt){
	var k, tg, pp, m = false;
	evt = (evt) ? evt : event;
	tg = (evt.target) ? evt.target : evt.srcElement;
	k = evt.keyCode;
	if (p7ISM.downKey == evt.keyCode) {
		return;
	}
	p7ISM.downKey = evt.keyCode;
	if (k == 39 || k == 37 || k == 36 || k == 35) {
		pp = tg;
		while (pp) {
			if (pp.id && pp.id.indexOf('p7ISM_') > -1) {
				m = true;
				break;
			}
			if (pp.nodeName && pp.nodeName == 'BODY') {
				break;
			}
			pp = pp.parentNode;
		}
		if (m) {
			if (k == 39) {
				P7_ISMcontrol(pp.id, 'right');
			} else if (k == 37) {
				P7_ISMcontrol(pp.id, 'left');
			} else if (k == 36) {
				P7_ISMcontrol(pp.id, 'start');
			} else if (k == 35) {
				P7_ISMcontrol(pp.id, 'end');
			}
			if (evt.preventDefault) {
				evt.preventDefault();
			} else {
				evt.returnValue = false;
			}
		}
	}
}

function P7_ISMkeyup(){
	p7ISM.downKey = null;
}

function P7_ISMaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_ISMgetByAttribute(att, cls){
	var i, nL = [], aT, rS = [], cl;
	if (document.querySelectorAll) {
		nL = document.querySelectorAll('*[' + att + ']');
	} else {
		if (typeof(document.getElementsByClassName) != 'function') {
			aT = document.getElementsByTagName('DIV');
			for (i = 0; i < aT.length; i++) {
				cl = aT[i].className;
				if (cl && cl.indexOf(cls) > -1) {
					rS[rS.length] = aT[i];
				}
			}
		} else {
			rS = document.getElementsByClassName(cls);
		}
		for (i = 0; i < rS.length; i++) {
			if (rS[i].getAttribute(att)) {
				nL[nL.length] = rS[i];
			}
		}
	}
	return nL;
}

function P7_ISMgetByClass(el, cls, tg){
	var i, cl, aT, rS = [];
	if (typeof(el.getElementsByClassName) != 'function') {
		aT = el.getElementsByTagName(tg);
		for (i = 0; i < aT.length; i++) {
			cl = aT[i].className;
			if (cl && cl.indexOf(cls) > -1) {
				rS[rS.length] = aT[i];
			}
		}
	} else {
		rS = el.getElementsByClassName(cls);
	}
	return rS;
}

function P7_ISMshuffle(arr){
	var i = arr.length, tv, r;
	while (0 !== i) {
		r = Math.floor(Math.random() * i);
		i -= 1;
		tv = arr[i];
		arr[i] = arr[r];
		arr[r] = tv;
	}
	return arr;
}

function P7_ISMrandomizer(el){
	var i, k = 0, cn, nd, z, d, arr = [];
	cn = el.childNodes;
	for (z = 0; z < cn.length; z++) {
		arr.push(z);
	}
	arr = P7_ISMshuffle(arr);
	d = document.createElement('DIV');
	while (el.childNodes.length > 0) {
		d.appendChild(el.childNodes[0]);
	}
	for (i = 0; i < arr.length; i++) {
		nd = d.childNodes[arr[i]].cloneNode(true);
		el.appendChild(nd);
	}
}

function P7_ISMgetCSSPre(){
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

function P7_ISMgetIEver(){
	var j, k, v = -1, nv;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7ISM.ie = v;
	}
	j = nv.indexOf('trident/');
	if (j > 0) {
		k = nv.indexOf('rv:');
		if (k && k > 0) {
			v = parseInt(nv.substring(k + 3, nv.indexOf('.', k)), 10);
		}
		p7ISM.ie = v;
	}
	return v;
}

function P7_ISMsetClass(ob, cl){
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

function P7_ISMremClass(ob, cl){
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

function P7_ISMhasFlex(el){
	var pp = el, ob = false;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		while (pp) {
			if (document.defaultView.getComputedStyle(pp, "").getPropertyValue('display') == 'flex') {
				ob = pp;
				break;
			}
			if (pp.nodeName && pp.nodeName == 'BODY') {
				break;
			}
			pp = pp.parentNode;
		}
	}
	return ob;
}

function P7_ISMgetCurLeft(el){
	var m = false, mx, x, trf;
	trf = document.defaultView.getComputedStyle(el, "").getPropertyValue('transform');
	if (trf) {
		mx = trf.split(',');
		if (mx && mx.length && mx.length > 4) {
			x = parseFloat(mx[4]);
			if (!isNaN(x)) {
				m = true;
			}
		}
	}
	if (!m) {
		x = el.offsetLeft;
	}
	return x;
}

function P7_ISMparsePN(d){
	var x = d.lastIndexOf('_');
	return parseInt(d.substr(x + 1), 10);
}
