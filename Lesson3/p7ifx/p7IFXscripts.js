
/* 
 ================================================
 PVII Image Effexts Magic scripts
 Copyright (c) 2017 Project Seven Development
 www.projectseven.com
 Version: 1.1.1 -build 05
 ================================================
 
 */
var p7IFX = {
	ctl: [],
	once: false,
	prf: 'none'
};
function P7_IFXaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_IFXinit, false);
		window.addEventListener("load", P7_IFXinit, false);
	}
}

P7_IFXaddLoad();
function P7_IFXinit(){
	var i, j, x, el, cl, im, cT, tB, iM, sD, bs, dt, sdb, md;
	if (p7IFX.once) {
		return;
	}
	p7IFX.once = true;
	p7IFX.prf = P7_IFXgetCSSPre();
	if (p7IFX.prf == 'none') {
		return;
	}
	cT = document.querySelectorAll('*[data-ifx]');
	for (j = 0; j < cT.length; j++) {
		p7IFX.ctl[p7IFX.ctl.length] = cT[j];
		tB = cT[j];
		tB.ifxOpt = tB.getAttribute('data-ifx').split(',');
		P7_IFXsetValue(tB, 'start');
		tB.offsetWidth = tB.offsetWidth;
		if (tB.ifxOpt[0] < 13) {
			tB.style[p7IFX.prf + 'transition-duration'] = tB.ifxOpt[4] + 's';
		}
		md = 'ease';
		x = tB.ifxOpt[3];
		if (x == 1) {
			md = 'linear';
		} else if (x == 2) {
			md = 'ease-in';
		} else if (x == 3) {
			md = 'ease-out';
		} else if (x == 4) {
			md = 'ease-in-out';
		}
		if (tB.ifxOpt[0] < 13) {
			tB.style[p7IFX.prf + 'transition-timing-function'] = md;
		}
		tB.offsetWidth = tB.offsetWidth;
		P7_IFXbindPointer(tB);
		var fn = function(evt){
			if (this.ifxState == 'off') {
				P7_IFXsetValue(this, 'end');
			} else if (this.ifxOpt[5] != 1) {
				P7_IFXsetValue(this, 'start');
			}
		};
		P7_IFXaddEvent(tB, 'mousedown', fn);
		if (tB.ifxOpt[6] == 1) {
			P7_IFXaddEvent(tB, 'mouseover', function(evt){
				if (this.tchPointer) {
					return;
				}
				if (this.ifxState != 'on') {
					P7_IFXsetValue(this, 'end');
				}
			});
			if (tB.ifxOpt[5] != 1) {
				P7_IFXaddEvent(tB, 'mouseout', function(evt){
					if (this.tchPointer) {
						return;
					}
					if (this.ifxState != 'off') {
						this.ifxTmr = setTimeout(P7_IFXcreateTMR(this), 180);
					}
				});
			}
		}
	}
}

function P7_IFXcreateTMR(el){
	return function(){
		P7_IFXsetValue(el, 'start');
	};
}

function P7_IFXsetValue(el, sp){
	var v, x, tp;
	if (sp == 'start') {
		x = el.ifxOpt[1];
		el.ifxState = 'off';
		P7_IFXremClass(el, 'ifx-on');
	} else {
		x = el.ifxOpt[2];
		el.ifxState = 'on';
		P7_IFXsetClass(el, 'ifx-on');
		if (el.ifxOpt[7] == 1) {
			P7_IFXcloseAll(el);
		}
	}
	tp = 'filter';
	switch (parseInt(el.ifxOpt[0], 10)) {
		case 0:
			v = 'grayscale(' + x + ')';
			break;
		case 1:
			v = 'sepia(' + x + ')';
			break;
		case 2:
			v = 'saturate(' + x + '%)';
			break;
		case 3:
			v = 'invert(' + x + '%)';
			break;
		case 4:
			tp = 'opacity';
			v = x;
			break;
		case 5:
			v = 'brightness(' + x + '%)';
			break;
		case 6:
			v = 'contrast(' + x + '%)';
			break;
		case 7:
			v = 'blur(' + x + 'px)';
			break;
		case 8:
			tp = 'transform';
			v = 'scale(' + x + ')';
			break;
		case 9:
			tp = 'transform';
			v = 'rotate(' + x + 'deg)';
	}
	if (el.ifxOpt[0] < 10) {
		el.style[p7IFX.prf + tp] = v;
	}
}

function P7_IFXtrg(dv, sp){
	var el = document.getElementById(dv);
	if (el) {
		P7_IFXsetValue(el, sp);
	}
}

function P7_IFXcloseAll(el){
	var i, tB;
	for (i = 0; i < p7IFX.ctl.length; i++) {
		tB = p7IFX.ctl[i];
		if (el != tB && tB.ifxState == 'on') {
			if (tB.ifxOpt[5] != 1) {
				P7_IFXsetValue(tB, 'start');
			}
		}
	}
}

function P7_IFXbindPointer(el){
	if (navigator.maxTouchPoints) {
		el.addEventListener('pointerover', P7_IFXsetPointer, false);
		el.addEventListener('mouseleave', P7_IFXsetPointer, false);
	} else if (navigator.msMaxTouchPoints) {
		el.addEventListener('MSPointerOver', P7_IFXsetPointer, false);
		el.addEventListener('mouseleave', P7_IFXsetPointer, false);
	} else if (el.ontouchstart !== undefined) {
		el.addEventListener('touchstart', P7_IFXsetPointer, false);
	}
}

function P7_IFXsetPointer(evt){
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

function P7_IFXgetCSSPre(){
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

function P7_IFXaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_IFXsetClass(ob, cl){
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

function P7_IFXremClass(ob, cl){
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
