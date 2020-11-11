
/* 
 ================================================
 PVII Pop Box Magic scripts
 Copyright (c) 2016-2017 Project Seven Development
 www.projectseven.com
 Version: 1.1.5 -build 23
 ================================================
 
 */
var p7PBX = {
	ctl: [],
	status: false,
	once: false,
	ie: false,
	clk: false,
	prf: 'none',
	current: null,
	overlay: null,
	overlayZindex: 99999995, // 99,999,995
	panelZindex: 9999900, // 9,999,900
	animDelay: (1000 / 60)
};
function P7_PBXset(){
	var h, hd, sh = '';
	if (!document.getElementById) {
		return;
	}
	p7PBX.ie = P7_PBXgetIEver();
	sh += '.pbx-panel {position:absolute;left:-9000px;top:-9000px;}\n';
	sh += '.pbx-overlay {position:fixed;top:-100%;left:0;width:100%;height:100%;overflow:hidden;z-index:990;opacity:0;}\n';
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
	p7PBX.prf = P7_PBXgetCSSPre();
}

P7_PBXset();
function P7_PBXbb(){
}

function P7_PBXaddLoad(){
	if (!document.getElementById) {
		return;
	}
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_PBXinit, false);
		window.addEventListener("load", P7_PBXinit, false);
		window.addEventListener("unload", P7_PBXbb, false);
		window.addEventListener("resize", P7_PBXrsz, false);
		document.addEventListener("keydown", P7_PBXkey, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_opm defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_opm").onreadystatechange = function(){
			if (this.readyState == "complete") {
				P7_PBXinit();
			}
		};
		window.attachEvent("onload", P7_PBXinit);
		window.attachEvent("onunload", P7_PBXbb);
		window.attachEvent("onresize", P7_PBXrsz);
		document.attachEvent("onkeydown", P7_PBXkey);
	}
}

P7_PBXaddLoad();
function P7_PBXinit(){
	var i, j, k, s, a, el, cT, tB, tA, pN, fn, frms, kj, t;
	if (p7PBX.once) {
		return;
	}
	p7PBX.once = true;
	el = document.createElement('div');
	el.setAttribute('id', 'p7PBXov');
	el.setAttribute('class', 'pbx-overlay');
	el.style.zIndex = p7PBX.overlayZindex;
	p7PBX.overlayZindex++;
	document.getElementsByTagName('BODY')[0].appendChild(el);
	P7_PBXaddEvent(el, 'click', function(evt){
		evt = (evt) ? evt : event;
		P7_PBXcontrol('all', 'close');
		evt.preventDefault();
	});
	p7PBX.overlay = el;
	if (!p7PBX.clk) {
		p7PBX.clk = true;
		P7_PBXaddEvent(document, 'click', P7_PBXbody);
		P7_PBXaddEvent(document, 'touchstart', P7_PBXbody);
	}
	cT = P7_PBXgetByAttribute('data-pbx', 'pbx-trigger');
	for (j = 0; j < cT.length; j++) {
		p7PBX.ctl[p7PBX.ctl.length] = cT[j];
		tA = cT[j];
		tA.pbxState = 'closed';
		tA.p7opt = tA.getAttribute('data-pbx').split(',');
		tA.pbxId = tA.p7opt[0];
		tA.pbxChildTrigs = [];
		tA.pbxHasChild = false;
		tA.pbxParent = false;
		tA.pbxCloseChild = function(){
			if (this.pbxChildTrigs[0]) {
				for (var i = 0; i < this.pbxChildTrigs.length; i++) {
					if (this.pbxChildTrigs[i].pbxState != 'closed') {
						P7_PBXclose(this.pbxChildTrigs[i]);
					}
				}
			}
		};
		pN = document.getElementById(tA.pbxId.replace('_', 'p_'));
		tA.pbxPanel = pN;
		if (pN) {
			pN.style.maxWidth = tA.p7opt[2] + 'px';
			pN.style.minWidth = tA.p7opt[7] + 'px';
			pN.pbxTrig = tA;
			if (pN.parentNode.nodeName != 'BODY') {
				document.getElementsByTagName('BODY')[0].appendChild(pN);
			}
			P7_PBXaddEvent(tA, 'click', function(evt){
				evt = (evt) ? evt : event;
				P7_PBXsetCursorPos(evt, this);
				if (!P7_PBXclick(this)) {
					evt.preventDefault();
				}
			});
			el = document.getElementById(tA.pbxId.replace('_', 'cl_'));
			if (el) {
				el.pbxTrig = tA;
				P7_PBXaddEvent(el, 'click', function(evt){
					evt = (evt) ? evt : event;
					P7_PBXclose(this.pbxTrig);
					evt.preventDefault();
				});
			}
			tA.tchPointer = false;
			if (tA.p7opt[3] == 1) {
				fn = function(evt){
					evt = (evt) ? evt : event;
					if (this.pbxCloseTimer) {
						clearTimeout(this.pbxCloseTimer);
					}
					var p = this.pbxParent;
					if (p && p.pbxCloseTimer) {
						clearTimeout(p.pbxCloseTimer);
					}
					P7_PBXsetCursorPos(evt, this);
					if (this.tchPointer) {
						return;
					}
					var a = this;
					this.pbxCloseTimer = setTimeout(function(){
						P7_PBXopen(a);
					}, 50);
				};
				P7_PBXbindPointer(tA);
				P7_PBXaddEvent(tA, 'mouseover', fn);
				fn = function(evt){
					var i, tg, pp, dv, m = true, a = this, d = this.pbxId.replace('_', 'p_');
					evt = (evt) ? evt : event;
					tg = (evt.toElement) ? evt.toElement : evt.relatedTarget;
					if (this.tchPointer) {
						return;
					}
					if (tg) {
						pp = tg;
						while (pp) {
							if (pp.nodeName && pp.nodeName == 'BODY') {
								break;
							}
							if (pp == this || (pp.id && pp.id == d)) {
								m = false;
								break;
							}
							if (this.pbxHasChild && pp.pbxTrig) {
								for (i = 0; i < this.pbxChildTrigs.length; i++) {
									if (pp.pbxTrig == this.pbxChildTrigs[i]) {
										m = false;
									}
								}
								if (!m) {
									break;
								}
							}
							pp = pp.parentNode;
						}
						if (m) {
							if (this.pbxCloseTimer) {
								clearTimeout(this.pbxCloseTimer);
							}
							this.pbxCloseTimer = setTimeout(function(){
								P7_PBXclose(a);
							}, 250);
						}
					}
				};
				if (tA.p7opt[1] != 5) {
					P7_PBXaddEvent(tA, 'mouseout', fn);
				}
				fn = function(evt){
					if (this.pbxTrig.pbxCloseTimer) {
						clearTimeout(this.pbxTrig.pbxCloseTimer);
					}
					var p = this.pbxTrig.pbxParent;
					if (p && p.pbxCloseTimer) {
						clearTimeout(p.pbxCloseTimer);
					}
				};
				P7_PBXbindPointer(pN);
				P7_PBXaddEvent(pN, 'mouseover', fn);
				fn = function(evt){
					var tg, pp, pa, pb = false, a = this.pbxTrig, m = true;
					evt = (evt) ? evt : event;
					tg = (evt.toElement) ? evt.toElement : evt.relatedTarget;
					if (this.tchPointer) {
						return;
					}
					if (tg) {
						pp = tg;
						while (pp) {
							if (pp.nodeName && pp.nodeName == 'BODY') {
								break;
							}
							if (pp == this || pp == this.pbxTrig) {
								m = false;
								break;
							}
							if (pp.id && pp.id.indexOf('p7PBXp') > -1) {
								pb = true;
							}
							if (a.pbxHasChild && (pp.pbxId || pp.pbxTrig)) {
								for (i = 0; i < a.pbxChildTrigs.length; i++) {
									if (pp == a.pbxChildTrigs[i]) {
										m = false;
									}
									if (pp.pbxTrig == a.pbxChildTrigs[i]) {
										m = false;
									}
								}
								if (!m) {
									break;
								}
							}
							pp = pp.parentNode;
						}
						if (m) {
							pp = this.pbxTrig.pbxParent;
							if (!pb && pp) {
								while (pp) {
									pa = pp;
									pp = pp.pbxParent;
								}
								if (pa) {
									a = pa;
								}
							}
							if (this.pbxTrig.pbxCloseTimer) {
								clearTimeout(this.pbxTrig.pbxCloseTimer);
							}
							this.pbxTrig.pbxCloseTimer = setTimeout(function(){
								P7_PBXclose(a);
							}, 250);
						}
					}
				};
				if (tA.p7opt[1] != 5) {
					P7_PBXaddEvent(pN, 'mouseout', fn);
				}
			}
			frms = pN.getElementsByTagName('IFRAME');
			if (frms && frms.length) {
				tA.pbxFrames = [];
				for (kj = 0; kj < frms.length; kj++) {
					pN.style.width = '100%';
					if (/video-wrapper/.test(frms[kj].parentNode.className)) {
						tA.pbxFrames[kj] = frms[kj];
						frms[kj].pbxSrc = frms[kj].src;
						frms[kj].src = '';
					}
				}
			}
			P7_PBXurl(tA);
		}
	}
	for (i = 0; i < p7PBX.ctl.length; i++) {
		tA = p7PBX.ctl[i];
		el = P7_PBXhasParent(tA);
		if (el) {
			tA.pbxParent = el;
			el.pbxChildTrigs.push(tA);
			el.pbxHasChild = true;
		}
		P7_PBXurl(tA);
		if (tA.p7opt[10] == 1) {
			t = tA.p7opt[11] * 1000;
			t = (t > 0) ? t : 0;
			tA.pbxOpenTimer = setTimeout(P7_PBXcreateTMH(tA), t);
		}
	}
	P7_PBXrsz();
}

function P7_PBXcreateTMH(el){
	return function(){
		P7_PBXopen(el);
	};
}

function P7_PBXclick(a){
	var wH, m = false;
	if (a.pbxCloseTimer) {
		clearTimeout(this.pbxCloseTimer);
	}
	wH = window.location.href;
	if (a.href != wH && a.href != wH + '#') {
		if (a.href.toLowerCase().indexOf('javascript:') == -1) {
			m = true;
		}
	}
	if (!m) {
		if (a.pbxState == 'open') {
			P7_PBXclose(a);
		} else {
			P7_PBXopen(a);
		}
	}
	return m;
}

function P7_PBXctrl(dv, ac, a){
	if (a) {
		a.pbxTrig = true;
	}
	return P7_PBXcontrol(dv, ac);
}

function P7_PBXcontrol(dv, ac){
	var i, a;
	for (i = p7PBX.ctl.length - 1; i > -1; i--) {
		if (dv == 'all' && ac == 'close') {
			if (p7PBX.ctl[i].pbxState != 'closed') {
				P7_PBXclose(p7PBX.ctl[i]);
			}
		} else if (p7PBX.ctl[i].pbxId == dv) {
			a = p7PBX.ctl[i];
			if (a) {
				if (ac == 'close') {
					P7_PBXclose(a);
					break;
				} else if (ac == 'open') {
					P7_PBXopen(a);
					break;
				}
			}
		}
	}
	return false;
}

function P7_PBXbody(evt){
	evt = (evt) ? evt : event;
	var i, tA, m = true, pp = (evt.fromElement) ? evt.fromElement : evt.target;
	while (pp) {
		if (pp.pbxTrig) {
			m = false;
			break;
		}
		if (pp.pbxId) {
			m = false;
			break;
		}
		if (pp && pp.id && typeof(pp.id) == 'string' && pp.id.indexOf('p7PBXp_') === 0) {
			m = false;
			break;
		}
		if (pp && pp.tagName && (pp.tagName == 'BODY' || pp.tagName == 'HTML')) {
			break;
		}
		pp = pp.parentNode;
	}
	if (m) {
		for (i = 0; i < p7PBX.ctl.length; i++) {
			tA = p7PBX.ctl[i];
			if (tA.pbxState != 'closed' && tA.p7opt[12] == 1) {
				P7_PBXclose(tA);
			}
		}
	}
}

function P7_PBXopen(a){
	var pN, an, md, dur, t, l;
	if (a.pbxState == 'open') {
		return;
	}
	a.pbxState = 'open';
	P7_PBXsetClass(a, 'open');
	if (a.p7opt[6] == 1) {
		P7_PBXtoggle(a);
	}
	pN = a.pbxPanel;
	if (!pN) {
		return;
	}
	p7PBX.current = a;
	an = a.p7opt[4];
	dur = a.p7opt[5];
	md = a.p7opt[1];
	pN.style.visibility = 'hidden';
	if (a.pbxFrames) {
		P7_PBXframes(a, 'on');
	}
	if (md == 4 || md == 5) {
		l = (p7PBX.overlay.offsetWidth - pN.offsetWidth) / 2;
		l = (l < 10) ? 10 : l;
		pN.style.left = l + 'px';
		t = (p7PBX.overlay.offsetHeight - pN.offsetHeight) / 2;
		t += P7_PBXgetWinScroll()[0];
		t = (t < 0) ? 9 : t;
		pN.style.top = t + 'px';
		if (md == 5) {
			p7PBX.overlay.style.top = '0px';
			p7PBX.overlay.style.opacity = 1;
		}
	}
	if (md == 5 || (a.pbxParent && a.pbxParent.p7opt[1] == 5)) {
		pN.style.zIndex = p7PBX.overlayZindex;
		p7PBX.overlayZindex++;
	} else {
		pN.style.zIndex = p7PBX.panelZindex;
		p7PBX.panelZindex++;
	}
	P7_PBXresizer(a);
	if (an == 1) {
		pN.style.opacity = 0;
		pN.style.visibility = 'visible';
		pN.offsetWidth = pN.offsetWidth;
		pN.style[p7PBX.prf + 'transition'] = 'opacity ' + dur + 'ms ease';
		pN.style.opacity = 1;
	} else if (an == 2) {
		pN.style[p7PBX.prf + 'transform'] = 'scale(0.01)';
		pN.style.opacity = 0;
		pN.style.visibility = 'visible';
		pN.offsetWidth = pN.offsetWidth;
		pN.style[p7PBX.prf + 'transition'] = p7PBX.prf + 'transform ' + dur + 'ms ease-out';
		pN.style[p7PBX.prf + 'transition-property'] = p7PBX.prf + 'transform,opacity';
		pN.style[p7PBX.prf + 'transform-origin'] = 'left top';
		pN.style[p7PBX.prf + 'transform'] = 'scale(1)';
		pN.style.opacity = 1;
	} else if (an == 3 || an == 4) {
		pN.style[p7PBX.prf + 'transform'] = 'scale(0.01,1)';
		pN.style.opacity = 0;
		pN.style.visibility = 'visible';
		pN.offsetWidth = pN.offsetWidth;
		pN.style[p7PBX.prf + 'transition'] = p7PBX.prf + 'transform ' + dur + 'ms ease-out';
		pN.style[p7PBX.prf + 'transition-property'] = p7PBX.prf + 'transform,opacity';
		if (an == 4) {
			pN.style[p7PBX.prf + 'transform-origin'] = 'left center';
		}
		pN.style[p7PBX.prf + 'transform'] = 'scale(1)';
		pN.style.opacity = 1;
	} else {
		pN.style.visibility = 'visible';
	}
}

function P7_PBXclose(a){
	var pN, an, md, dur;
	if (a.pbxState == 'closed') {
		return;
	}
	a.pbxState = 'closed';
	P7_PBXremClass(a, 'open');
	pN = a.pbxPanel;
	if (!pN) {
		return;
	}
	a.pbxCloseChild();
	an = a.p7opt[4];
	dur = a.p7opt[5];
	md = a.p7opt[1];
	if (md == 5) {
		if (!a.pbxParent || a.pbxParent.p7opt[1] != 5) {
			p7PBX.overlay.style.opacity = 0;
		}
	}
	if (a.pbxFrames) {
		P7_PBXframes(a, 'off');
	}
	if (an == 1) {
		pN.offsetWidth = pN.offsetWidth;
		pN.style[p7PBX.prf + 'transition'] = 'opacity ' + dur + 'ms ease';
		pN.style.opacity = 0;
		pN.pbxAnimC = setTimeout(function(){
			P7_PBXfinClose(a);
		}, dur);
	} else if (an == 2) {
		pN.offsetWidth = pN.offsetWidth;
		pN.style[p7PBX.prf + 'transition'] = p7PBX.prf + 'transform ' + dur + 'ms ease-in';
		pN.style[p7PBX.prf + 'transition-property'] = p7PBX.prf + 'transform, opacity';
		pN.style[p7PBX.prf + 'transform'] = 'scale(0.01)';
		pN.style.opacity = 0;
		pN.pbxAnimC = setTimeout(function(){
			P7_PBXfinClose(a);
		}, dur);
	} else if (an == 3 || an == 4) {
		pN.offsetWidth = pN.offsetWidth;
		pN.style.opacity = 1;
		pN.style[p7PBX.prf + 'transition'] = p7PBX.prf + 'transform ' + dur + 'ms ease-in';
		pN.style[p7PBX.prf + 'transition-property'] = p7PBX.prf + 'transform, opacity';
		pN.style[p7PBX.prf + 'transform'] = 'scale(0.01,1)';
		pN.style.opacity = 0;
		pN.pbxAnimC = setTimeout(function(){
			P7_PBXfinClose(a);
		}, dur);
	} else {
		P7_PBXfinClose(a);
	}
}

function P7_PBXfinClose(a){
	var pN;
	if (a.pbxState != 'open') {
		pN = a.pbxPanel;
		if (a.p7opt[1] == 5) {
			if (!a.pbxParent || a.pbxParent.p7opt[1] != 5) {
				p7PBX.overlay.style.top = '-100%';
			}
		}
		if (a.p7opt[4] > 0) {
			pN.style[p7PBX.prf + 'transition'] = null;
			pN.style[p7PBX.prf + 'transform'] = null;
			pN.style.opacity = 1;
		}
		pN.style.visibility = 'hidden';
		pN.style.left = '-9000px';
		pN.style.top = '-9000px';
	}
}

function P7_PBXtoggle(a){
	var i, tA;
	for (i = 0; i < p7PBX.ctl.length; i++) {
		tA = p7PBX.ctl[i];
		if (tA !== a && tA.pbxState != 'closed') {
			P7_PBXclose(tA);
		}
	}
}

function P7_PBXhasParent(a){
	var tr = false, pp = a.parentNode;
	while (pp) {
		if (pp.pbxTrig) {
			tr = pp.pbxTrig;
			break;
		}
		if (pp.nodeName && pp.nodeName == 'BODY') {
			break;
		}
		pp = pp.parentNode;
	}
	return tr;
}

function P7_PBXrsz(){
	var i, a;
	for (i = 0; i < p7PBX.ctl.length; i++) {
		a = p7PBX.ctl[i];
		if (a && a.pbxState == 'open') {
			P7_PBXresizer(a);
		}
	}
}

function P7_PBXresizer(a){
	var i, md, h, w, l, t, br, ws, ww, pr;
	if (!a) {
		return;
	}
	md = a.p7opt[1];
	var pN = document.getElementById(a.pbxId.replace('_', 'p_'));
	ww = p7PBX.overlay.offsetWidth;
	if (md == 4 || md == 5) {
		l = (ww - pN.offsetWidth) / 2;
		l = (l < 10) ? 10 : l;
		pN.style.left = l + 'px';
	} else {
		if (md == 3 && !a.pbxPosX) {
			md = 0;
		}
		if (md == 3) {
			l = a.pbxPosX + 3;
			t = a.pbxPosY + 3;
		} else {
			br = a.getBoundingClientRect();
			ws = P7_PBXgetWinScroll();
			if (md == 2) {
				l = br.right + ws[1];
				t = br.top + ws[0];
				h = br.bottom - br.top;
				t += h;
			} else if (md == 1) {
				w = br.right - br.left;
				l = (br.left + ws[1]) + ((w - pN.offsetWidth) / 2);
				t = br.top + ws[0];
				h = br.bottom - br.top;
				t += h;
			} else {
				l = br.left + ws[1];
				t = br.top + ws[0];
				h = br.bottom - br.top;
				t += h;
			}
		}
		if (a.p7opt[8]) {
			l += parseInt(a.p7opt[8], 10);
		}
		if (a.p7opt[9]) {
			t += parseInt(a.p7opt[9], 10);
		}
		pr = l + pN.offsetWidth;
		if (pr > ww) {
			l = ww - pN.offsetWidth;
		}
		l = (l < 0) ? 0 : l;
		t = (t < 0) ? 0 : t;
		pN.style.left = l + 'px';
		pN.style.top = t + 'px';
	}
}

function P7_PBXgetWinScroll(){
	var st = 0, sl = 0;
	st = document.body.parentNode.scrollTop;
	if (!st) {
		st = document.body.scrollTop;
		if (!st) {
			st = window.scrollY ? window.scrollY : 0;
		}
	}
	sl = document.body.parentNode.scrollLeft;
	if (!sl) {
		sl = document.body.scrollLeft;
		if (sl) {
			sl = window.scrollX ? window.scrollX : 0;
		}
	}
	return [st, sl];
}

function P7_PBXbindPointer(el){
	if (navigator.maxTouchPoints) {
		el.addEventListener('pointerover', P7_PBXsetPointer, false);
		el.addEventListener('mouseleave', P7_PBXsetPointer, false);
	} else if (navigator.msMaxTouchPoints) {
		el.addEventListener('MSPointerOver', P7_PBXsetPointer, false);
		el.addEventListener('mouseleave', P7_PBXsetPointer, false);
	} else if (el.ontouchstart !== undefined) {
		el.addEventListener('touchstart', P7_PBXsetPointer, false);
	}
}

function P7_PBXsetPointer(evt){
	if (evt.pointerType) {
		if (evt.MSPOINTER_TYPE_TOUCH || evt.pointerType == 'touch') {
			this.tchPointer = true;
		} else if (evt.MSPOINTER_TYPE_PEN || evt.pointerType == 'pen') {
			this.tchPointer = true;
		} else {
			this.tchPointer = false;
		}
	} else if (evt.touches && evt.touches.length && evt.touches.length > 0) {
		this.tchPointer = true;
	} else {
		this.tchPointer = false;
	}
}

function P7_PBXframes(a, ac){
	var i, tD;
	if (a && a.pbxFrames && a.pbxFrames.length) {
		for (i = 0; i < a.pbxFrames.length; i++) {
			if (ac == 'on') {
				a.pbxFrames[i].src = a.pbxFrames[i].pbxSrc;
			} else {
				a.pbxFrames[i].src = '';
			}
		}
	}
}

function P7_PBXurl(a){
	var i, h, s, x, k, d = 'pbx', pn, tB, n = a.p7opt[0].replace('p7PBX_', '');
	h = document.location.search;
	if (h) {
		h = h.replace('?', '');
		s = h.split(/[=&]/g);
		if (s && s.length) {
			for (i = 0; i < s.length; i += 2) {
				if (s[i] == d) {
					x = s[i + 1];
					if (n == x) {
						P7_PBXopen(a);
					}
				}
			}
		}
	}
	h = document.location.hash;
	if (h) {
		if (h.indexOf('pbx_') == 1) {
			s = h.replace('#pbx_', '');
			if (s == n) {
				P7_PBXopen(a);
			}
		}
	}
}

function P7_PBXkey(evt){
	var k, tg, nn, m = true;
	evt = (evt) ? evt : event;
	tg = (evt.target) ? evt.target : evt.srcElement;
	nn = tg.nodeName.toLowerCase();
	if (!evt.altKey && !evt.ctrlKey) {
		if (nn != 'input' && nn != 'textarea') {
			k = evt.keyCode;
			if (k == 27) {
				P7_PBXcontrol('all', 'close');
				m = false;
			}
		}
	}
	if (!m) {
		if (evt.preventDefault) {
			evt.preventDefault();
		}
	}
	return m;
}

function P7_PBXsetCursorPos(evt, a){
	var posx, posy;
	evt = (evt) ? evt : window.event;
	if (evt.pageX || evt.pageY) {
		posx = evt.pageX;
		posy = evt.pageY;
	} else if (evt.clientX || evt.clientY) {
		posx = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	if (a) {
		a.pbxPosX = posx;
		a.pbxPosY = posy;
	}
}

function P7_PBXgetByAttribute(att, cls){
	var i, nL = [], aT, rS = [], cl;
	if (document.querySelectorAll) {
		nL = document.querySelectorAll('*[' + att + ']');
	} else {
		if (typeof(document.getElementsByClassName) != 'function') {
			aT = document.getElementsByTagName('A');
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

function P7_PBXgetDim(el, d){
	var b, x;
	b = el.getBoundingClientRect();
	if (d == 'height') {
		x = b.bottom - b.top;
	} else if (d == 'width') {
		x = b.right - b.left;
	}
	return x;
}

function P7_PBXsetClass(ob, cl){
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

function P7_PBXremClass(ob, cl){
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

function P7_PBXgetStyle(el, s){
	if (el.currentStyle) {
		s = el.currentStyle[s];
	} else if (document.defaultView && document.defaultView.getComputedStyle) {
		s = document.defaultView.getComputedStyle(el, "")[s];
	} else {
		s = el.style[s];
	}
	return s;
}

function P7_PBXgetIEver(){
	var j, v = -1, nv, m = false;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7PBX.ie = v;
	}
	return v;
}

function P7_PBXaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_PBXgetCSSPre(){
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

function P7_PBXsetCC(dd, rp, ac){
	var d, tC;
	d = dd.replace('_', rp);
	tC = document.getElementById(d);
	if (tC) {
		tC.onclick = function(){
			return P7_PBXcontrol(dd, ac);
		};
	}
	return tC;
}
