
/* 
 ================================================
 PVII Art Gallery Magic scripts
 Copyright (c) 2017-2018 Project Seven Development
 www.projectseven.com
 Version: 1.2.5 -build 45
 ================================================
 
 */
var p7AGMtext = {
	thumbShow: 'Show Thumbnails',
	thumbHide: 'Hide Thumbnails',
	categoryShow: 'Show Categories',
	categoryHide: 'Hide Categories',
	captionShow: 'Show Captions',
	captionHide: 'Hide Captions',
	fullscreenEnter: 'Display in Fullscreen',
	fullscreenExit: 'Exit Fullscreen',
	toolbarShow: 'Show Toolbar',
	toolbarHide: 'Hide Toolbar',
	playShow: 'Play Slide Show',
	pauseShow: 'Pause Slide Show'
};
var p7AGM = {
	ctl: [],
	once: false,
	prf: 'none',
	ie: false,
	fullscreen: false,
	animDelay: (1000 / 60),
	swipeDuration: 300,
	autoCaptionFormat: ['', 'fn', '* \\ **', '* \\ **: fn', 'Image * of **', 'Image * of **: fn', 'Slide * of **', 'Slide * of **: fn', '* of **', '* of **: fn', 'Image# *', 'Image# *: fn', 'Slide# *', 'Slide# *: fn'],
	downKey: null
};
function P7_AGMset(){
	var h, hd, sh = '';
	if (!document.getElementById) {
		return;
	}
	sh += '.agm-thumbs-wrapper {display:none;}\n';
	sh += '.agm-thumbs-wrapper.active {display:block;}\n';
	sh += '.p7AGM-fs-wrapper {position:relative;}\n';
	sh += '.agm-fs-image {width:100%;}\n';
	sh += '.agm-thumbs-outer {width:100%;}\n';
	sh += '.agm-thumbs,.agm-thumbs *,.p7AGM-fs,.p7AGM-fs *,p7AGM-fs {touch-action:pan-y pinch-zoom;ms-touch-action:pan-y pinch-zoom;}\n';
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

P7_AGMset();
function P7_AGMbb(){
}

function P7_AGMaddLoad(){
	if (window.addEventListener) {
		document.addEventListener("DOMContentLoaded", P7_AGMinit, false);
		window.addEventListener("load", P7_AGMinit, false);
		window.addEventListener("unload", P7_AGMbb, false);
		window.addEventListener("resize", P7_AGMrsz, false);
		document.addEventListener("keydown", P7_AGMkey, false);
		document.addEventListener("keyup", P7_AGMkeyup, false);
	} else if (window.attachEvent) {
		document.write("<script id=p7ie_agm defer src=\"//:\"><\/script>");
		document.getElementById("p7ie_agm").onreadystatechange = function(){
			if (this.readyState == "complete") {
				P7_AGMinit();
			}
		};
		window.attachEvent("onload", P7_AGMinit);
		window.attachEvent("onunload", P7_AGMbb);
		document.attachEvent("onkeydown", P7_AGMkey);
		document.attachEvent("onkeyup", P7_AGMkeyup);
		window.attachEvent("onresize", P7_AGMrsz);
	}
}

P7_AGMaddLoad();
function P7_AGMinit(){
	var i, k, j, z, el, cl, tB, dT, cT, cA, tA, cF, sW, ob, tmB, fn, pli = 0;
	if (p7AGM.once) {
		return;
	}
	p7AGM.once = true;
	p7AGM.prf = P7_AGMgetCSSPre();
	P7_AGMgetIEver();
	document.p7agmpre = [];
	P7_AGMinitAnimFrame();
	dT = P7_AGMgetByAttribute('data-agm', 'p7AGM');
	for (j = 0; j < dT.length; j++) {
		p7AGM.ctl[p7AGM.ctl.length] = dT[j];
		tB = dT[j];
		tB.agmOpt = tB.getAttribute('data-agm').split(',');
		if (tB.agmOpt[2] > 2 && p7AGM.prf == 'none') {
			tB.agmOpt[2] = 2;
		}
		if (tB.agmOpt[2] == 4) {
			P7_AGMsetClass(tB, 'agm-burns');
		}
		P7_AGMremClass(tB, 'agm-noscript');
		sW = document.getElementById(tB.id.replace('_', 'fs_'));
		tB.agmSW = sW;
		sW.agmDiv = tB;
		tB.agmKBnum = 0;
		tB.agmMLnum = 0;
		el = P7_AGMhasFlex(tB);
		if (el) {
			P7_AGMsetClass(el, 'agm-flex-parent');
		}
		tB.agmDefCat = tB.agmOpt[0];
		tB.agmDefImage = tB.agmOpt[0];
		el = document.createElement('div');
		el.setAttribute('id', tB.id.replace('_', 'ldg_'));
		el.className = 'p7agm-loading';
		tB.agmLoading = el;
		sW.appendChild(el);
		tB.agmControls = [];
		el = document.getElementById(tB.id.replace('_', 'tal_'));
		if (el) {
			el.agmDiv = tB;
			el.onmousedown = function(){
				P7_AGMcScrollStart(this.agmDiv, 'left');
			};
			el.onmouseup = function(){
				var tU = this.agmDiv.agmCurrCat;
				if (tU.p7Scrolling) {
					P7_AGMcancelAnimFrame(tU.p7Scrolling);
				}
				if (tU.p7AnimRunning) {
					tU.p7AnimRunning = false;
					clearInterval(tU.p7AGManim);
				}
			};
		}
		el = document.getElementById(tB.id.replace('_', 'tar_'));
		if (el) {
			el.agmDiv = tB;
			el.onmousedown = function(){
				P7_AGMcScrollStart(this.agmDiv, 'right');
			};
			el.onmouseup = function(){
				var tU = this.agmDiv.agmCurrCat;
				if (tU.p7Scrolling) {
					P7_AGMcancelAnimFrame(tU.p7Scrolling);
				}
				if (tU.p7AnimRunning) {
					tU.p7AnimRunning = false;
					clearInterval(tU.p7AGManim);
				}
			};
		}
		tB.agmControls[3] = P7_AGMsetCC(tB.id, 'rp_', 'prev');
		tB.agmControls[5] = P7_AGMsetCC(tB.id, 'rn_', 'next');
		el = document.getElementById(tB.id.replace('_', 'bp_'));
		if (el) {
			el.agmDiv = tB;
			el.onmousedown = function(){
				P7_AGMcontrol(this.agmDiv.id, 0, 'prev');
			};
		}
		el = document.getElementById(tB.id.replace('_', 'bn_'));
		if (el) {
			el.agmDiv = tB;
			el.onmousedown = function(){
				P7_AGMcontrol(this.agmDiv.id, 0, 'next');
			};
		}
		el = document.getElementById(tB.id.replace('_', 'rpp_'));
		if (el) {
			el.p7state = 'pause';
			el.agmDiv = tB.id;
			el.setAttribute('title', p7AGMtext.playShow);
			tB.agmControls[4] = el;
			el.onclick = function(){
				var ac = (this.p7state == 'play') ? 'pause' : 'play';
				P7_AGMcontrol(this.agmDiv, 0, ac, 3);
				return false;
			};
			el.agmSetButtonState = function(st){
				var tx;
				if (st == 'play') {
					tx = p7AGMtext.pauseShow;
					P7_AGMremClass(this, 'paused');
				} else {
					tx = p7AGMtext.playShow;
					P7_AGMsetClass(this, 'paused');
				}
				this.setAttribute('title', tx);
			};
		}
		tmB = document.getElementById(tB.id.replace('_', 'tmb_'));
		tB.agmThumbDiv = tmB;
		if (tmB) {
			el = document.getElementById(tB.id.replace('_', 'tcn_'));
			if (el) {
				el.agmDiv = tB;
				el.agmState = 'showing';
				el.agmTmb = tmB;
				el.setAttribute('title', p7AGMtext.thumbHide);
				el.onclick = function(){
					var tx;
					if (this.agmState == 'hidden') {
						tx = p7AGMtext.thumbHide;
						this.agmState = 'showing';
						P7_AGMremClass(this.agmDiv, 'agm-thumbs-hidden');
					} else {
						tx = p7AGMtext.thumbShow;
						this.agmState = 'hidden';
						P7_AGMsetClass(this.agmDiv, 'agm-thumbs-hidden');
					}
					this.setAttribute('title', tx);
					return false;
				};
				if (tB.agmOpt[14] == 1) {
					P7_AGMthumbnails(tB.id, 'hide');
				}
			}
		}
		el = document.getElementById(tB.id.replace('_', 'tdl_'));
		tB.agmToolDivLeft = el;
		el = document.getElementById(tB.id.replace('_', 'tdr_'));
		tB.agmToolDivRight = el;
		ob = document.getElementById(tB.id.replace('_', 'tbr_'));
		tB.agmToolbarDiv = ob;
		ob.agmDiv = tB;
		if (ob) {
			el = document.getElementById(tB.id.replace('_', 'hsb_'));
			if (el) {
				el.agmDiv = tB;
				el.setAttribute('title', p7AGMtext.toolbarHide);
				el.onclick = function(){
					P7_AGMsetClass(this.agmDiv, 'agm-toolbar-hidden');
					return false;
				};
			}
			el = document.getElementById(tB.id.replace('_', 'hhb_'));
			if (el) {
				el.agmDiv = tB;
				el.setAttribute('title', p7AGMtext.toolbarShow);
				el.onclick = function(){
					P7_AGMremClass(this.agmDiv, 'agm-toolbar-hidden');
					return false;
				};
			}
			if (tB.agmOpt[13] == 1) {
				P7_AGMtoolbar(tB.id, 'hide');
			}
		}
		el = document.getElementById(tB.id.replace('_', 'cpb_'));
		if (el) {
			el.agmDiv = tB;
			el.agmState = 'showing';
			el.setAttribute('title', p7AGMtext.captionHide);
			el.onclick = function(){
				var tx;
				if (this.agmState == 'hidden') {
					tx = p7AGMtext.captionHide;
					this.agmState = 'showing';
					P7_AGMremClass(this.agmDiv, 'agm-caption-hidden');
				} else {
					tx = p7AGMtext.captionShow;
					this.agmState = 'hidden';
					P7_AGMsetClass(this.agmDiv, 'agm-caption-hidden');
				}
				this.setAttribute('title', tx);
				return false;
			};
		}
		el = document.getElementById(tB.id.replace('_', 'fsb_'));
		if (el) {
			el.agmDiv = tB;
			el.agmState = 'minimized';
			tB.agmFSButton = el;
			el.onclick = function(){
				var ac = 'on';
				if (this.agmState == 'maximized') {
					ac = 'off';
				}
				P7_AGMfullscreen(this.agmDiv.id, ac);
				return false;
			};
			fn = function(){
				var fs = (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
				if (p7AGM.fullscreen && !fs) {
					P7_AGMfullscreen(p7AGM.fullscreen.id, 'off');
				}
			};
			if (tB.requestFullscreen) {
				document.addEventListener('fullscreenchange', fn);
			} else if (tB.msRequestFullscreen) {
				document.addEventListener('MSFullscreenChange', fn);
			} else if (tB.mozRequestFullScreen) {
				document.addEventListener('mozfullscreenchange', fn);
			} else if (tB.webkitRequestFullscreen) {
				document.addEventListener('webkitfullscreenchange', fn);
			}
		}
		cT = document.getElementById(tB.id.replace('_', 'ct_'));
		tB.agmCatDiv = cT;
		tB.agmCatTrigs = [];
		tB.agmCatDivs = [];
		tB.agmCurrSlideNum = 0;
		tB.agmPrevSlideNum = 0;
		tB.agmNumPlays = 1;
		tB.agmDirection = 'right';
		tB.agmShowMode = 'pause';
		k = 0;
		if (cT) {
			cA = cT.getElementsByTagName('A');
			tB.agmCatItems = cA.length;
			for (i = 0; i < cA.length; i++) {
				if (cA[i].id && cA[i].id.indexOf('ct_') > -1) {
					el = document.getElementById(cA[i].id.replace('ct_', 'cd_'));
					if (el) {
						k++;
						tB.agmCatTrigs[k] = cA[i];
						cA[i].agmDiv = tB.id;
						cA[i].agmCat = el.id;
						cA[i].agmCatNum = k;
						tB.agmCatDivs[k] = el;
						if (el) {
							el.agmCatNum = cA[i].agmCatNum;
							ob = el.getElementsByTagName('LI');
							el.agmLastLi = ob[ob.length - 1];
						}
						cA[i].onclick = function(){
							P7_AGMshowCat(this.agmDiv, this.agmCatNum);
							return false;
						};
					}
				}
			}
		} else {
			el = document.getElementById(tB.id.replace('_', 'cd_') + '_1');
			tB.agmCatTrigs = null;
			if (el) {
				tB.agmCatDivs[1] = el;
				el.agmCatNum = 1;
				tB.agmCatItems = 1;
				ob = el.getElementsByTagName('LI');
				el.agmLastLi = ob[ob.length - 1];
			}
		}
		el = document.getElementById(tB.id.replace('_', 'sc_'));
		if (el) {
			tB.agmShowCat = el;
			el.agmDiv = tB;
			el.agmState = 'hidden';
			el.setAttribute('title', p7AGMtext.categoryShow);
			el.onclick = function(){
				var tx;
				if (this.agmState == 'hidden') {
					this.agmState = 'showing';
					P7_AGMsetClass(this, 'on');
					P7_AGMsetClass(this.agmDiv.agmCatDiv, 'cat-show');
					tx = p7AGMtext.categoryHide;
				} else {
					this.agmState = 'hidden';
					P7_AGMremClass(this, 'on');
					P7_AGMremClass(this.agmDiv.agmCatDiv, 'cat-show');
					tx = p7AGMtext.categoryShow;
				}
				this.setAttribute('title', tx);
				return false;
			};
		}
		el = document.getElementById(tB.id.replace('_', 'ctg_'));
		tB.agmCurrCatTx = el;
		el.agmDiv = tB;
		if (tB.agmCatItems > 1) {
			el.onmousedown = function(){
				this.agmDiv.agmShowCat.click();
				return false;
			};
		} else {
			P7_AGMsetClass(tB.agmShowCat, 'agm-cat-button-hide');
		}
		for (z = 1; z < tB.agmCatDivs.length; z++) {
			cT = tB.agmCatDivs[z];
			cT.agmSlides = [];
			if (!p7AGM.ie || p7AGM.ie > 8) {
				P7_AGMdswpAssign(cT);
			}
			tA = cT.getElementsByTagName('A');
			k = 0;
			for (i = 0; i < tA.length; i++) {
				cl = tA[i].parentNode.className;
				if (tA[i].parentNode.nodeName == "LI" && cl && (/agm/.test(cl))) {
					k++;
					cT.agmSlides[k] = tA[i];
					tA[i].agmDiv = tB.id;
					tA[i].agmCat = cT.id;
					tA[i].agmCatNum = cT.agmCatNum;
					tA[i].agmSlideNum = k;
					cT.agmSlideNums = cT.agmSlides.length - 1;
					ob = tA[i].getElementsByTagName('IMG');
					if (ob && ob[0]) {
						tA[i].agmThumbImg = ob[0];
					}
					document.p7agmpre[pli] = new Image();
					document.p7agmpre[pli].cmp = false;
					document.p7agmpre[pli].agmDiv = tB.id;
					P7_AGMsetImage(document.p7agmpre[pli]);
					tA[i].agmPreIndex = pli;
					tA[i].agmPreImage = document.p7agmpre[pli];
					if (k < 2) {
						document.p7agmpre[pli].src = tA[i].href;
					}
					pli++;
					tA[i].onclick = function(evt){
						var x, d, tch;
						evt = (evt) ? evt : event;
						tch = (evt.touches && evt.touches[0]) ? true : false;
						x = (tch) ? evt.touches[0].pageX : evt.clientX;
						d = Math.abs(this.agmPosX - x);
						if (d < 15) {
							P7_AGMcontrol(this.agmDiv, this.agmCatNum, this.agmSlideNum);
						}
						return false;
					};
					tA[i].onmousedown = function(evt){
						evt = (evt) ? evt : event;
						var tch = (evt.touches && evt.touches[0]) ? true : false;
						this.agmPosX = (tch) ? evt.touches[0].pageX : evt.clientX;
					};
				}
			}
		}
		if (tB.agmOpt[4] == 1) {
			tB.agmShowMode = 'play';
			tB.agmShowResume = false;
			if (tB.agmControls[4]) {
				tB.agmControls[4].p7state = 'play';
				tB.agmControls[4].agmSetButtonState('play');
			}
		}
		P7_AGMurl(tB.id);
		P7_AGMshowSlide(tB.id, tB.agmDefCat, tB.agmDefImage, 1, null);
		if (tB.agmOpt[16] == 1) {
			P7_AGMfullscreen(tB.id, 'on');
		}
	}
	P7_AGMrsz();
}

function P7_AGMctrl(dv, ct, ac){
	return P7_AGMcontrol(dv, ct, ac);
}

function P7_AGMcontrol(dv, ct, ac, bp, tch){
	var i, tD, cs, ts, op, sn, eI, eC, eD, tm = 0, pauseOnAction, rs = false, m = false, cT;
	tD = document.getElementById(dv);
	ct = (!ct || ct < 1) ? tD.agmCurrCat.agmCatNum : ct;
	if (tD && tD.agmCatDivs && tD.agmCatDivs[ct]) {
		cT = tD.agmCatDivs[ct];
		if (tD.agmShowTimer) {
			clearTimeout(tD.agmShowTimer);
		}
		pauseOnAction = (tD.agmOpt[8] == 1) ? true : false;
		cs = parseInt(tD.agmCurrSlideNum, 10);
		ts = parseInt(cT.agmSlideNums, 10);
		if (ac == 'pause') {
			if (bp !== 3) {
				if (tD.agmOpt[9] == 1 && tD.agmShowMode == 'play') {
					tD.agmShowResume = true;
				} else {
					tD.agmShowResume = false;
				}
			}
			P7_AGMpause(dv);
			return m;
		}
		if (!bp && pauseOnAction) {
			if (tD.agmOpt[9] == 1 && tD.agmShowMode == 'play') {
				tD.agmShowResume = true;
			}
			P7_AGMpause(dv, ac);
		}
		if (ac == 'play') {
			tD.agmShowMode = 'play';
			tD.agmShowResume = false;
			if (tD.agmControls[4]) {
				tD.agmControls[4].p7state = 'play';
				tD.agmControls[4].agmSetButtonState('play');
			}
			ac = 'next';
			rs = true;
		}
		if (ac == 'first') {
			tD.agmDirection = 'left';
			sn = 1;
		} else if (ac == 'prev') {
			tD.agmDirection = 'left';
			sn = cs - 1;
			if (sn < 1) {
				sn = ts;
			}
		} else if (ac == 'next') {
			sn = cs + 1;
			tD.agmDirection = 'right';
			if (tD.agmShowMode == 'play') {
				if (sn > ts) {
					tD.agmNumPlays++;
					if (tD.agmOpt[6] > 0 && tD.agmNumPlays > tD.agmOpt[6]) {
						tD.agmNumPlays = 0;
						sn = (tD.agmOpt[7] == 1) ? 1 : cT.agmSlideNums;
						P7_AGMpause(tD.id);
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
			tD.agmDirection = 'right';
			sn = ts;
		} else {
			tD.agmDirection = 'right';
			sn = ac;
			if (sn < tD.agmCurrSlideNum && cT == tD.agmCurrCat) {
				tD.agmDirection = 'left';
			}
		}
		sn = (sn < 1) ? 1 : sn;
		sn = (sn > cT.agmSlideNums) ? cT.agmSlideNums : sn;
		if (sn == tD.agmCurrSlideNum && bp != 1) {
			return m;
		}
		if (rs) {
			tm = 100;
			setTimeout("P7_AGMshowSlide('" + tD.id + "'," + ct + "," + sn + "," + bp + ")", tm);
		} else {
			P7_AGMshowSlide(tD.id, ct, sn, bp, tch);
		}
	}
	return false;
}

function P7_AGMpause(d, ac){
	var cD, sd, iM, tD = document.getElementById(d);
	if (tD) {
		tD.agmShowMode = 'pause';
		if (tD.agmShowTimer) {
			clearTimeout(tD.agmShowTimer);
		}
		if (tD.agmControls[4]) {
			tD.agmControls[4].p7state = 'pause';
			tD.agmControls[4].agmSetButtonState('pause');
		}
	}
}

function P7_AGMfullscreen(dv, ac){
	var tB, cl, ks = false;
	tB = document.getElementById(dv);
	if (!tB) {
		return;
	}
	cl = 'agm-fullscreen';
	if (tB.agmOpt[12] == 1) {
		ks = true;
	}
	if (ac == 'on') {
		P7_AGMsetClass(document.body, cl);
		P7_AGMsetClass(tB, cl);
		if (tB.agmFSButton) {
			P7_AGMsetClass(tB.agmFSButton, 'agm-maximized');
			tB.agmFSButton.agmState = 'maximized';
			tB.agmFSButton.setAttribute('title', p7AGMtext.fullscreenExit);
		}
		p7AGM.fullscreen = tB;
		tB.agmFullscreen = true;
		P7_AGMrsz();
		if (ks) {
			if (tB.requestFullscreen) {
				tB.requestFullscreen();
			} else if (tB.msRequestFullscreen) {
				tB.msRequestFullscreen();
			} else if (tB.mozRequestFullScreen) {
				tB.mozRequestFullScreen();
			} else if (tB.webkitRequestFullscreen) {
				tB.webkitRequestFullscreen();
			}
		}
	} else {
		P7_AGMremClass(document.body, cl);
		P7_AGMremClass(tB, cl);
		if (tB.agmFSButton) {
			P7_AGMremClass(tB.agmFSButton, 'agm-maximized');
			tB.agmFSButton.agmState = 'minimized';
			tB.agmFSButton.setAttribute('title', p7AGMtext.fullscreenEnter);
		}
		p7AGM.fullscreen = false;
		tB.agmFullscreen = false;
		P7_AGMrsz();
		if (ks) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}
}

function P7_AGMtoolbar(dv, ac){
	var tB, el, d;
	tB = document.getElementById(dv);
	d = (ac == 'show') ? 'hhb_' : 'hsb_';
	el = document.getElementById(tB.id.replace('_', d));
	if (el) {
		el.click();
	}
}

function P7_AGMthumbnails(dv, ac){
	var tB, el, d;
	tB = document.getElementById(dv);
	el = document.getElementById(tB.id.replace('_', 'tcn_'));
	if (el) {
		if ((ac == 'show' && el.agmState == 'hidden') || (ac == 'hide' && el.agmState == 'showing')) {
			el.click();
		}
	}
}

function P7_AGMshowSlide(dv, ct, sn, bp, tch){
	var i, tD, tA, sW, sB, iM, el, sL, aM, sC, cP, cN, cl, dD, cT, tx, ff;
	bp = (bp) ? bp : null;
	tD = document.getElementById(dv);
	cT = tD.agmCatDivs[ct];
	if (!cT.agmSlides[sn]) {
		return false;
	}
	if (tD.currentCat == cT && tD.agmCurrSlideNum == sn && bp != 1) {
		return false;
	}
	if (tD.agmShowTimer) {
		clearTimeout(tD.agmShowTimer);
	}
	if (tD.agmWait) {
		clearTimeout(tD.agmWait);
	}
	if (tD.agmCurrSlideNum !== 0) {
		tD.agmPrevSlideNum = tD.agmCurrSlideNum;
	}
	tD.agmPrevCat = tD.agmCurrCat;
	P7_AGMopenCat(dv, ct);
	tD.agmCurrSlideNum = sn;
	tD.agmCurrCat = cT;
	tA = cT.agmSlides[sn];
	P7_AGMsyncThumb(tD);
	if (tA.agmBuiltSlide) {
		P7_AGMdispA(tD.id, cT, sn, tA.agmBuiltSlide, bp, tch);
	} else {
		sB = document.createElement('div');
		sB.className = 'p7AGM-fs';
		sB.agmSlideNum = sn;
		sB.agmDiv = tD.id;
		sB.agmCat = cT.id;
		sB.style.left = '-9000px';
		sB.style.top = '0px';
		sB.style.position = 'absolute';
		sC = document.createElement('div');
		sC.className = 'agm-fs-image';
		sB.agmSC = sC;
		sC.agmDiv = tD;
		if (tD.agmOpt[9] == 1) {
			P7_AGMsetPomo(sC);
		}
		P7_AGMassignSwipe(sB, dv);
		cN = tA.parentNode.childNodes;
		for (var kk = 0; kk < cN.length; kk++) {
			cl = cN[kk].className;
			if (cl && /agm_caption/i.test(cl)) {
				dD = document.createElement('div');
				sC.agmDesc = dD;
				dD.className = 'agm-caption' + cl.replace('agm_caption', '');
				P7_AGMcopyCN(dD, cN[kk]);
			}
			if (cl && /agm_link/i.test(cl)) {
				el = cN[kk].getElementsByTagName('A');
				if (el && el[0]) {
					tA.agmLink = el[0];
				}
			}
		}
		if (!dD && tD.agmOpt[17] > 0) {
			dD = document.createElement('div');
			sC.agmDesc = dD;
			dD.className = 'agm-caption';
			dD.style.display = 'none';
			ff = tA.href.substring(tA.href.lastIndexOf('/') + 1);
			tx = p7AGM.autoCaptionFormat[tD.agmOpt[17]].replace('**', cT.agmSlideNums);
			tx = tx.replace('fn', ff);
			tx = tx.replace('*', sn);
			dD.appendChild(document.createTextNode(tx));
		}
		aM = document.createElement('A');
		aM.className = 'agm-image-link';
		if (tA.agmLink) {
			aM.setAttribute('href', tA.agmLink.getAttribute('href'));
			tx = tA.agmLink.getAttribute('title');
			if (tx && tx !== '') {
				aM.setAttribute('title', tx);
			}
			if (tA.agmLink.target && tA.agmLink.target !== '') {
				aM.setAttribute('target', tA.agmLink.target);
			}
		}
		iM = document.createElement('IMG');
		iM.className = 'agm-image';
		P7_AGMsetImage(iM);
		iM.agmCnt = 0;
		iM.src = tA.href;
		if (tA.agmThumb) {
			tx = tA.agmThumb.getAttribute('alt');
		} else {
			tx = tA.getAttribute('title');
		}
		tx = (tx) ? tx : tA.href.substring(tA.href.lastIndexOf('/') + 1);
		iM.setAttribute('alt', tx);
		iM.oncontextmenu = function(){
			return false;
		};
		if (dD && (tD.agmOpt[10] < 1 || tD.agmOpt[10] == 2)) {
			if (tD.agmOpt[10] == 2) {
				P7_AGMsetClass(dD, 'agm-caption-overlay-top');
			} else {
				P7_AGMsetClass(dD, 'agm-caption-top');
			}
			sB.appendChild(dD);
		}
		aM.appendChild(iM);
		sC.appendChild(aM);
		sB.appendChild(sC);
		if (dD && (tD.agmOpt[10] == 1 || tD.agmOpt[10] == 3)) {
			if (tD.agmOpt[10] == 3) {
				P7_AGMsetClass(dD, 'agm-caption-overlay-bottom');
			} else {
				P7_AGMsetClass(dD, 'agm-caption-bottom');
			}
			sB.appendChild(dD);
		}
		tD.agmSW.appendChild(sB);
		sC.agmImage = iM;
		tD.agmWait = setInterval(function(){
			P7_AGMloadImage(tD, cT, sC, iM, sn, bp, tch);
		}, 60);
	}
}

function P7_AGMloadImage(tD, cT, sC, im, sn, bp, tch){
	var sB, tA, cl;
	im.agmCnt++;
	if ((im.cmp && im.complete && im.height > 10 && im.width > 10) || im.loadFailed) {
		clearInterval(tD.agmWait);
		if (im.p7Status == 'load_error') {
			im.style.minHeight = '300px';
			sC.parentNode.agmImgError = true;
		} else {
			tD.agmLoading.style.display = 'none';
		}
		tA = cT.agmSlides[sn];
		if (im.naturalWidth) {
			sC.agmImWidth = im.naturalWidth;
			sC.agmImHeight = im.naturalHeight;
		} else {
			sC.agmImWidth = im.width;
			sC.agmImHeight = im.height;
		}
		if (sC.agmCaption) {
			sC.agmCaption.style.display = 'block';
		}
		if (sC.agmDesc) {
			sC.agmDesc.style.display = 'block';
		}
		P7_AGMdispA(tD.id, cT, sn, sC.parentNode, bp, tch);
	} else {
		if (im.agmCnt > 3 || im.p7Status == 'load_error') {
			tD.agmLoading.style.display = 'block';
		}
	}
	if (im.agmCnt > 100 || im.p7Status == 'load_error' && !im.cmp) {
		im.loadFailed = true;
		im.cmp = true;
		im.complete = true;
		im.width = 400;
		im.height = 400;
		im.style.minHeight = '300px';
	}
}

function P7_AGMsetImage(im){
	im.p7Status = '';
	im.onload = function(){
		this.cmp = true;
	};
	im.onerror = function(){
		this.cmp = false;
		this.p7Status = 'load_error';
	};
}

function P7_AGMdispA(dv, cT, sn, sB, bp, tch){
	var tA, tD, iM, an, cl, dur, sW, h, nh, x, oh;
	tD = document.getElementById(dv);
	sW = tD.agmSW;
	tA = cT.agmSlides[sn];
	if (!tA.agmBuiltSlide) {
		tA.agmBuiltSlide = sB;
	}
	if (sB.agmAnimC) {
		clearTimeout(sB.agmAnimC);
	}
	if (tD.currentCat == cT && tD.agmCurrSlideNum == sn) {
		return false;
	}
	tD.agmPrevSlide = tD.agmCurrSlide;
	tD.agmCurrSlide = sB;
	an = (bp && bp == 1) ? 0 : tD.agmOpt[2];
	if (tD.agmOpt[2] > 3) {
		an = tD.agmOpt[2];
	}
	dur = tD.agmOpt[3];
	P7_AGMsetClass(tA.parentNode, 'agm-down');
	P7_AGMsetClass(sB, 'current-slide');
	if (tch) {
		if (an == 1) {
			an = 3;
		}
	}
	if ((an > 0 && bp != 1) || an > 4) {
		nh = tD.agmCurrSlide.offsetHeight;
		if (tD.agmPrevSlide) {
			oh = tD.agmPrevSlide.offsetHeight;
		} else {
			oh = nh;
		}
		tD.agmStartHeight = oh;
		tD.agmFinHeight = nh;
		if (tD.agmFullscreen && tD.agmOpt[12] == 1) {
			sW.style.height = '100%';
		} else {
			P7_AGManimate(sW, 'height', 'px', oh, nh, 300, 'linear');
		}
	}
	if (sB.agmImgError) {
		tD.agmLoading.style.display = 'block';
	} else {
		tD.agmLoading.style.display = 'none';
	}
	if (tD.agmPrevCat !== cT || tD.agmPrevSlideNum != sn) {
		P7_AGMcloseSlide(dv, tD.agmPrevCat, tD.agmPrevSlideNum, 0, tch);
	}
	if (an == 1) {
		sB.style.left = '0px';
		sB.style.top = '0px';
		sB.style.position = 'relative';
		P7_AGMfade(sB, 2, 100, dur, 'quad');
		P7_AGMdispFin(dv, sn, bp);
	} else if (an == 2) {
		x = sW.offsetWidth;
		if (sB.filters) {
			sB.style.filter = '';
		} else {
			sB.style.opacity = 1;
		}
		if (tD.agmDirection == 'left') {
			x = x * -1;
		}
		sB.style.top = '0px';
		sB.style.left = x + 'px';
		sB.style.position = 'relative';
		sB.style.visibility = 'visible';
		P7_AGManimate(sB, 'left', 'px', x, 0, dur, 'quad');
		P7_AGMdispFin(dv, sn, bp);
	} else if (an == 3) {
		x = sW.offsetWidth;
		if (tD.agmDirection == 'left') {
			x = x * -1;
		}
		x = x * 0.60;
		sB.style.opacity = 0;
		sB.style.top = '0px';
		sB.style.left = x + 'px';
		sB.offsetWidth = sB.offsetWidth;
		sB.style.position = 'relative';
		sB.style.visibility = 'visible';
		sB.style[p7AGM.prf + 'transition'] = 'left ' + dur + 'ms ease, opacity ' + (dur * 2) + 'ms linear';
		sB.style.left = '0px';
		sB.style.opacity = 1;
		P7_AGMdispFin(dv, sn, bp);
	} else if (an == 4) {
		dur = 3500;
		sB.style.left = '0px';
		sB.style.top = '0px';
		sB.style.position = 'relative';
		sB.style.opacity = 0;
		sB.style.visibility = 'visible';
		iM = sB.agmSC.agmImage;
		P7_AGMremClass(iM, 'agm-run');
		tD.agmKBnum++;
		tD.agmKBnum = (tD.agmKBnum > 5) ? 1 : tD.agmKBnum;
		cl = 'agm-burns-' + tD.agmKBnum;
		if (iM.agmKB) {
			P7_AGMremClass(iM, iM.agmKB);
		}
		iM.agmKB = cl;
		P7_AGMsetClass(iM, cl);
		iM.offsetWidth = iM.offsetWidth;
		P7_AGMsetClass(iM, 'agm-run');
		if (bp != 1) {
			sB.style[p7AGM.prf + 'transition'] = 'opacity ' + dur + 'ms linear';
		}
		sB.style.opacity = 1;
		P7_AGMdispFin(dv, sn, bp);
	} else if (an > 4) {
		sB.style.visibility = 'hidden';
		sB.style[p7AGM.prf + 'transition'] = null;
		sB.style.left = '0px';
		sB.style.top = '0px';
		P7_AGMremClass(sB, 'agm-multi-show');
		P7_AGMremClass(sB, 'agm-multi-close');
		if (an == 5) {
			tD.agmMLnum++;
			tD.agmMLnum = (tD.agmMLnum > 5) ? 1 : tD.agmMLnum;
		} else {
			tD.agmMLnum = an - 5;
		}
		cl = 'agm-multi-' + tD.agmMLnum;
		if (sB.agmML) {
			P7_AGMremClass(sB, sB.agmML);
		}
		sB.agmML = cl;
		if (sB.agmML) {
			P7_AGMremClass(sB, sB.agmML);
		}
		sB.agmML = cl;
		P7_AGMsetClass(sB, cl);
		sB.offsetWidth = sB.offsetWidth;
		sB.style.visibility = 'visible';
		if (bp != 1) {
			sB.style[p7AGM.prf + 'transition'] = 'transform ' + dur + 'ms ease, opacity ' + (dur * 1.4) + 'ms ease';
		}
		P7_AGMsetClass(sB, 'agm-multi-show');
		P7_AGMdispFin(dv, sn, bp);
	} else {
		sB.style.left = '0px';
		sB.style.top = '0px';
		sB.style.position = 'relative';
		sB.style.visibility = 'visible';
		P7_AGMdispFin(dv, sn, bp);
	}
}

function P7_AGMcloseSlide(dv, cT, sn, bp, tch){
	var tD, sB, sW, tA, an, dur, x;
	bp = (bp) ? bp : null;
	tD = document.getElementById(dv);
	sW = tD.agmSW;
	if (sn > 0) {
		sB = cT.agmSlides[sn].agmBuiltSlide;
	} else {
		sB = sW.getElementsByTagName('DIV')[0];
		if (!sB.agmDiv) {
			sW.removeChild(sB);
		}
		return;
	}
	if (!sB) {
		return;
	}
	tA = cT.agmSlides[sn];
	an = (bp && bp == 1) ? 0 : tD.agmOpt[2];
	dur = tD.agmOpt[3];
	P7_AGMremClass(tA.parentNode, 'agm-down');
	P7_AGMremClass(sB, 'current-slide');
	if (tch && bp != 1) {
		if (an == 1) {
			an = 3;
		}
	}
	if (an == 1) {
		sB.style.position = 'absolute';
		P7_AGMfade(sB, 100, 0, dur, 'quad', function(){
			P7_AGMcloseSlideBox(dv, sB);
		});
	} else if (an == 2) {
		sB.style.position = 'absolute';
		x = sW.offsetWidth * -1;
		if (tD.agmDirection == 'left') {
			x = x * -1;
		}
		sB.style.top = '0px';
		sB.style.left = '0px';
		P7_AGManimate(sB, 'left', 'px', 0, x, dur, 'quad', function(){
			P7_AGMcloseSlideBox(dv, sB);
		});
	} else if (an == 3) {
		sB.style.position = 'absolute';
		x = sW.offsetWidth * -1;
		if (tD.agmDirection == 'left') {
			x = x * -1;
		}
		x = x * 0.60;
		sB.style.opacity = 1;
		sB.style.top = '0px';
		sB.offsetWidth = sB.offsetWidth;
		sB.style[p7AGM.prf + 'transition'] = 'left ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
		sB.style.left = x + 'px';
		sB.style.opacity = 0;
		sB.agmAnimC = setTimeout(function(){
			P7_AGMcloseSlideBox(dv, sB);
		}, dur);
	} else if (an == 4) {
		dur = 3000;
		sB.style.position = 'absolute';
		sB.style.position = 'absolute';
		sB.style[p7AGM.prf + 'transition'] = 'opacity ' + dur + 'ms linear';
		sB.style.opacity = 0;
		sB.agmAnimC = setTimeout(function(){
			P7_AGMcloseSlideBox(dv, sB);
		}, dur);
	} else if (an > 4) {
		sB.style[p7AGM.prf + 'transition'] = 'transform ' + dur + 'ms ease, opacity ' + dur + 'ms ease';
		sB.offsetWidth = sB.offsetWidth;
		P7_AGMsetClass(sB, 'agm-multi-close');
		sB.agmAnimC = setTimeout(function(){
			P7_AGMcloseSlideBox(dv, sB);
		}, dur);
	} else {
		sB.style.left = '-9000px';
		sB.style.position = 'absolute';
		sB.style.visibility = 'hidden';
	}
}

function P7_AGMcloseSlideBox(dv, sB){
	var tD, iM;
	tD = document.getElementById(dv);
	sB.agmState = 'closed';
	P7_AGMremClass(sB, 'current-slide');
	if (tD.agmOpt[2] > 2 && p7AGM.prf != 'none') {
		sB.style[p7AGM.prf + 'transition'] = null;
		sB.offsetWidth = sB.offsetWidth;
	}
	if (tD.agmOpt[2] == 4) {
		iM = sB.agmSC.agmImage;
		P7_AGMremClass(iM, 'agm-run');
		iM.offsetWidth = iM.offsetWidth;
	}
	if (tD.agmOpt[2] > 4) {
		P7_AGMremClass(sB, 'agm-multi-show');
		P7_AGMremClass(sB, 'agm-multi-close');
		sB.offsetWidth = sB.offsetWidth;
	}
	sB.style.left = '-9000px';
	sB.style.position = 'absolute';
	sB.style.visibility = 'hidden';
}

function P7_AGMdispFin(dv, sn, bp){
	var tD, ns, tA, cT, tm, sB;
	P7_AGMrsz();
	tD = document.getElementById(dv);
	cT = tD.agmCurrCat;
	if (tD.agmCurrSlideNum != sn) {
		return false;
	}
	tm = tD.agmOpt[5] * 1000;
	ns = parseInt(tD.agmCurrSlideNum, 10) + 1;
	ns = (ns <= cT.agmSlides.length - 1) ? ns : 1;
	tA = cT.agmSlides[ns];
	if (!tA.agmPreImage.cmp) {
		tA.agmPreImage.src = tA.href;
	}
	if (tD.agmShowMode == 'play') {
		tD.agmShowMode = 'play';
		tD.agmShowResume = false;
		if (tD.agmShowTimer) {
			clearTimeout(tD.agmShowTimer);
		}
		tD.agmShowTimer = setTimeout("P7_AGMcontrol('" + tD.id + "',0,'next',2)", tm);
	}
}

function P7_AGMopenCat(dv, ct){
	var i, tD, cT;
	tD = document.getElementById(dv);
	cT = tD.agmCatDivs[ct];
	if (cT && tD.agmCurrCat != cT) {
		P7_AGMremClass(tD.agmPrevCat, 'active');
		P7_AGMsetClass(cT, 'active');
		if (tD.agmCatTrigs) {
			for (i = 1; i < tD.agmCatTrigs.length; i++) {
				P7_AGMremClass(tD.agmCatTrigs[i], 'agm-down');
			}
			P7_AGMsetClass(tD.agmCatTrigs[ct], 'agm-down');
		}
		if (tD.agmCurrCatTx) {
			tD.agmCurrCatTx.innerHTML = tD.agmCatTrigs[ct].innerHTML;
		}
		if (tD.agmShowCat && tD.agmShowCat.agmState != 'hidden') {
			tD.agmShowCat.click();
		}
		cT.parentNode.scrollLeft = 0;
	}
}

function P7_AGMshowCat(dv, ct){
	var tD, cT;
	tD = document.getElementById(dv);
	cT = tD.agmCatDivs[ct];
	if (cT && tD.currCat != cT) {
		P7_AGMopenCat(dv, ct);
		P7_AGMshowSlide(dv, ct, 1);
	}
}

function P7_AGMcScrollStart(tB, dir, mp){
	var el, cl;
	el = tB.agmCurrCat;
	if (el.p7Scrolling) {
		P7_AGMcancelAnimFrame(el.p7Scrolling);
	}
	if (el.p7AnimRunning) {
		el.p7AnimRunning = false;
		clearInterval(el.p7AGManim);
	}
	p7AGMsw.el = el;
	p7AGMsw.dir = dir;
	mp = (mp > 1) ? mp : 1;
	p7AGMsw.speedMulti = mp;
	p7AGMsw.tstamp = Date.now();
	p7AGMsw.max = 0;
	p7AGMsw.min = ((el.agmLastLi.offsetLeft + el.agmLastLi.offsetWidth) - el.parentNode.offsetWidth) * -1;
	p7AGMsw.min = (p7AGMsw.min > 0) ? 0 : p7AGMsw.min;
	p7AGMsw.startX = el.offsetLeft;
	p7AGMsw.curX = el.offsetLeft;
	el.p7Scrolling = P7_AGMrequestAnimFrame(P7_AGMcScroll);
}

function P7_AGMcScroll(){
	var el, t, r, targetPos, totDist, nl;
	el = p7AGMsw.el;
	t = Date.now() - p7AGMsw.tstamp;
	targetPos = (p7AGMsw.dir == 'left') ? p7AGMsw.max : p7AGMsw.min;
	r = (p7AGMsw.speed * p7AGMsw.speedMulti) * t;
	totDist = Math.abs(targetPos - p7AGMsw.startX);
	if (p7AGMsw.dir == 'left') {
		nl = p7AGMsw.curX + r;
	} else {
		nl = p7AGMsw.curX - r;
	}
	if (t > 2000) {
		p7AGMsw.startX = p7AGMsw.curX = nl;
		p7AGMsw.tstamp = Date.now();
		p7AGMsw.speedMulti = p7AGMsw.speedMulti * 1.5;
	}
	if (r > totDist) {
		nl = targetPos;
		p7AGMsw.el.style.left = nl + 'px';
	} else {
		p7AGMsw.el.style.left = nl + 'px';
		el.p7Scrolling = P7_AGMrequestAnimFrame(P7_AGMcScroll);
	}
}

function P7_AGMdswpAssign(el){
	var fn = function(evt){
		var tch;
		evt = (evt) ? evt : event;
		tch = (evt.touches && evt.touches[0]) ? true : false;
		if (tch && evt.touches.length > 1) {
			P7_AGMdswpRel(evt);
			return;
		}
		if (!p7AGMsw.tchEl) {
			p7AGMsw.tchEl = el;
			p7AGMsw.el = el;
		}
		if (el.p7AnimRunning) {
			el.p7AnimRunning = false;
			clearInterval(el.p7AGManim);
		}
		p7AGMsw.startX = p7AGMsw.curX = (tch) ? evt.touches[0].pageX : evt.clientX;
		p7AGMsw.startY = p7AGMsw.curY = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7AGMsw.startL = el.offsetLeft;
		p7AGMsw.min = 0;
		p7AGMsw.max = ((el.agmLastLi.offsetLeft + el.agmLastLi.offsetWidth) - el.parentNode.offsetWidth) * -1;
		p7AGMsw.max = (p7AGMsw.max > 0) ? 0 : p7AGMsw.max;
		p7AGMsw.velocity = 0;
		p7AGMsw.amplitude = 0;
		p7AGMsw.frame = p7AGMsw.startX;
		p7AGMsw.tstamp = Date.now();
		if (p7AGMsw.ticker) {
			clearInterval(p7AGMsw.ticker);
		}
		p7AGMsw.ticker = setInterval(P7_AGMdswpTrack, 30);
		if (!tch) {
			if (evt.preventDefault) {
				evt.preventDefault();
				evt.stopPropagation();
			} else {
				evt.returnValue = false;
				evt.cancelBubble = true;
			}
		}
		return false;
	};
	if (typeof window.ontouchstart !== 'undefined') {
		P7_AGMaddEvent(el, 'touchstart', fn);
		P7_AGMaddEvent(document, 'touchmove', P7_AGMdswpDrag);
		P7_AGMaddEvent(document, 'touchend', P7_AGMdswpRel);
	}
	P7_AGMaddEvent(el, 'mousedown', fn);
	P7_AGMaddEvent(document, 'mousemove', P7_AGMdswpDrag);
	P7_AGMaddEvent(document, 'mouseup', P7_AGMdswpRel);
}

function P7_AGMdswpDrag(evt){
	var tch, el, x, y, dx, dy, min, max, nl;
	evt = (evt) ? evt : event;
	tch = (evt.touches && evt.touches[0]) ? true : false;
	if (p7AGMsw.tchEl) {
		if (tch && evt.touches.length > 1) {
			P7_AGMdswpRel(evt);
			return;
		}
		el = p7AGMsw.tchEl;
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		dx = p7AGMsw.curX - x;
		dy = p7AGMsw.curY - y;
		if (dx > 2 || dx < -2) {
			p7AGMsw.curX = x;
			p7AGMsw.curY = y;
			min = 0;
			max = p7AGMsw.max;
			nl = p7AGMsw.startL + (x - p7AGMsw.startX);
			el.style.left = nl + 'px';
			if (evt.preventDefault) {
				evt.preventDefault();
				evt.stopPropagation();
			} else {
				evt.returnValue = false;
				evt.cancelBubble = true;
			}
			return false;
		}
	}
}

function P7_AGMdswpTrack(){
	var now, elapsed, delta, v;
	now = Date.now();
	elapsed = now - p7AGMsw.tstamp;
	p7AGMsw.tstamp = now;
	delta = p7AGMsw.curX - p7AGMsw.frame;
	p7AGMsw.frame = p7AGMsw.curX;
	v = 1000 * delta / (1 + elapsed);
	p7AGMsw.velocity = 0.8 * v + 0.2 * p7AGMsw.velocity;
}

function P7_AGMdswpRel(evt){
	var nl, max, el;
	if (p7AGMsw.ticker) {
		clearInterval(p7AGMsw.ticker);
	}
	if (p7AGMsw.tchEl) {
		el = p7AGMsw.el;
		nl = p7AGMsw.startL + (p7AGMsw.curX - p7AGMsw.startX);
		max = p7AGMsw.max;
		if (p7AGMsw.velocity > 10 || p7AGMsw.velocity < -10) {
			p7AGMsw.amplitude = 0.9 * p7AGMsw.velocity;
			p7AGMsw.target = Math.round(nl + p7AGMsw.amplitude);
			p7AGMsw.tstamp = Date.now();
			if (nl > p7AGMsw.min) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.min, 400, 'bounce');
			} else if (nl < p7AGMsw.max) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.max, 400, 'bounce');
			} else {
				el.p7Scrolling = P7_AGMrequestAnimFrame(P7_AGMdswpAutoScroll);
			}
		} else {
			if (nl > p7AGMsw.min) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.min, 400, 'bounce');
			} else if (nl < p7AGMsw.max) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.max, 400, 'bounce');
			}
		}
	}
	p7AGMsw.tchEl = null;
	return false;
}

function P7_AGMdswpAutoScroll(){
	var elapsed, delta, nl, el, min, max, x, cl, bf = 100;
	el = p7AGMsw.el;
	if (el.p7AnimRunning) {
		el.p7AnimRunning = false;
		clearInterval(el.p7AGManim);
	}
	if (p7AGMsw.amplitude) {
		elapsed = Date.now() - p7AGMsw.tstamp;
		delta = -p7AGMsw.amplitude * Math.exp(-elapsed / 325);
		bf = (delta < 50) ? bf * 0.30 : bf;
		if (delta > 0.5 || delta < -0.5) {
			nl = p7AGMsw.target + delta;
			min = p7AGMsw.min;
			max = p7AGMsw.max;
			if (nl > (p7AGMsw.min + bf)) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.min, 400, 'bounce');
			} else if (nl < (p7AGMsw.max - bf)) {
				P7_AGManimate(el, 'left', 'px', nl, p7AGMsw.max, 400, 'bounce');
			} else {
				el.style.left = nl + 'px';
				if (nl !== min && nl != max) {
					el.p7Scrolling = P7_AGMrequestAnimFrame(P7_AGMdswpAutoScroll);
				}
			}
		} else {
			cl = nl;
			nl = p7AGMsw.target;
			nl = (nl > min) ? min : nl;
			nl = (nl < max) ? max : nl;
			P7_AGManimate(el, 'left', 'px', cl, nl, 400, 'bounce');
		}
	}
}

function P7_AGMsyncThumb(tB, bp){
	var tU, sn, nl, ull, csl, uw, vw, ml, pc, dB, dC, bdl, cS, uww;
	sn = tB.agmCurrSlideNum;
	tU = tB.agmCurrCat;
	cS = tU.agmSlides[sn];
	ull = Math.abs(tU.offsetLeft);
	csl = cS.parentNode.offsetLeft;
	uw = (tU.agmLastLi.offsetLeft + tU.agmLastLi.offsetWidth) - tU.parentNode.offsetWidth;
	uww = tU.agmLastLi.offsetLeft + tU.agmLastLi.offsetWidth;
	vw = tU.parentNode.offsetWidth;
	if (csl < ull || csl > ((ull + vw) - (cS.parentNode.offsetWidth / 2))) {
		if (csl < ull) {
			nl = (csl + cS.parentNode.offsetWidth - vw) * -1;
		} else {
			nl = csl * -1;
		}
		ml = uw * -1;
		nl = (nl < ml) ? ml : nl;
		nl = (nl > 0) ? 0 : nl;
		nl = (uww < vw) ? 0 : nl;
		if (!bp && tB.agmOpt[2] > 0) {
			P7_AGManimate(tU, 'left', 'px', tU.offsetLeft, nl, 400, 'quad');
		} else {
			tU.style.left = nl + 'px';
		}
	} else {
		if (uww < vw) {
			nl = 0;
			tU.style.left = nl + 'px';
		}
	}
}

var p7AGMsw = {
	tchEl: null,
	el: null,
	ob: null,
	startX: 0,
	startY: 0,
	curX: 0,
	curY: 0,
	startL: 0,
	startT: 0,
	dir: 'right',
	velocity: 0,
	amplitude: 0,
	frame: 0,
	tstamp: 0,
	ticker: null,
	min: 0,
	max: 0,
	speed: 500 / 1000, // pixels per milli second
	speedMulti: 1
};
function P7_AGMassignSwipe(el){
	var fn = function(evt){
		var x, y, tch, tB, md;
		evt = (evt) ? evt : event;
		tch = (evt.touches && evt.touches[0]) ? true : false;
		if (tch && evt.touches.length > 1) {
			P7_AGMtchCancel(evt);
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7AGMsw.startX = x;
		p7AGMsw.startY = y;
		if (!p7AGMsw.tchEl) {
			p7AGMsw.tchEl = this;
		}
	};
	if ('ontouchstart' in window) {
		P7_AGMaddEvent(el, 'touchstart', fn);
		P7_AGMaddEvent(el, 'touchmove', P7_AGMtchMove);
		P7_AGMaddEvent(el, 'touchend', P7_AGMtchEnd);
	} else {
		if (navigator.maxTouchPoints) {
			P7_AGMaddEvent(el, 'pointerdown', fn);
			P7_AGMaddEvent(el, 'pointermove', P7_AGMtchMove);
			P7_AGMaddEvent(el, 'pointerup', P7_AGMtchEnd);
			P7_AGMsetClass(el, 'p7agm-pointer');
		} else if (navigator.msMaxTouchPoints) {
			P7_AGMaddEvent(el, 'MSPointerDown', fn);
			P7_AGMaddEvent(el, 'MSPointerMove', P7_AGMtchMove);
			P7_AGMaddEvent(el, 'MSPointerUp', P7_AGMtchEnd);
			P7_AGMsetClass(el, 'p7agm-ms-pointer');
		}
	}
}

function P7_AGMtchMove(evt){
	var tch, el, x, y, swl, cl;
	evt = (evt) ? evt : event;
	tch = (evt.touches && evt.touches[0]) ? true : false;
	if (p7AGMsw.tchEl) {
		el = p7AGMsw.tchEl;
		if (tch && evt.touches.length > 1) {
			P7_AGMtchCancel(evt);
			return;
		}
		x = (tch) ? evt.touches[0].pageX : evt.clientX;
		y = (tch) ? evt.touches[0].pageY : evt.clientY;
		p7AGMsw.curX = x;
		p7AGMsw.curY = y;
		swl = p7AGMsw.curX - p7AGMsw.startX;
		cl = (p7AGMsw.curX === 0 && p7AGMsw.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			P7_AGMtchEnd();
		}
		if (!cl && Math.abs(swl) > 20) {
			evt.preventDefault();
		}
	} else {
		P7_AGMtchCancel();
	}
}

function P7_AGMtchEnd(evt){
	if (p7AGMsw.tchEl) {
		var swl, el, dir, cl;
		el = p7AGMsw.tchEl;
		p7AGMsw.tchEl = null;
		swl = p7AGMsw.curX - p7AGMsw.startX;
		cl = (p7AGMsw.curX === 0 && p7AGMsw.curY === 0);
		if (!cl && Math.abs(swl) > 70) {
			if (swl < 0) {
				dir = 'left';
			} else {
				dir = 'right';
			}
			if (dir == 'left') {
				P7_AGMcontrol(el.agmDiv, 0, 'next', null, true);
			} else if (dir == 'right') {
				P7_AGMcontrol(el.agmDiv, 0, 'prev', null, true);
			}
		}
		P7_AGMtchCancel();
	} else {
		P7_AGMtchCancel();
	}
}

function P7_AGMtchCancel(){
	p7AGMsw.tchEl = null;
	p7AGMsw.startX = 0;
	p7AGMsw.startY = 0;
	p7AGMsw.curX = 0;
	p7AGMsw.curY = 0;
}

function P7_AGMsetPomo(sC){
	sC.addEventListener('pointerover', function(evt){
		this.agmPointerType = evt.pointerType;
	}, false);
	sC.addEventListener('mouseover', function(evt){
		if (p7AGMsw.el || p7AGMsw.ob) {
			return;
		}
		if (this.agmPointerType && this.agmPointerType != 'mouse') {
			return;
		}
		var tD = this.agmDiv;
		if (this.parentNode.p7AnimRunning) {
			return;
		}
		if (tD.agmShowMode == 'play') {
			P7_AGMpause(tD.id);
			tD.agmShowResume = true;
		}
	}, false);
	sC.addEventListener('mouseout', function(evt){
		if (p7AGMsw.el || p7AGMsw.ob) {
			return;
		}
		if (this.agmPointerType && this.agmPointerType != 'mouse') {
			return;
		}
		if (this.parentNode.p7AnimRunning) {
			return;
		}
		var tg, pp, m = true, tD = this.agmDiv;
		if (tD.agmCurrSlide != this.parentNode) {
			return;
		}
		if (this.parentNode.p7AnimRunning) {
			return;
		}
		if (tD.agmShowResume) {
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
					tD.agmShowResume = false;
					P7_AGMcontrol(tD.id, 0, 'play');
				}
			}
		}
	}, false);
}

function P7_AGMgetTime(st){
	var d = new Date();
	return d.getTime() - st;
}

function P7_AGManim(tp, t, b, c, d){
	if (tp == 'quad') {
		return -c * (t /= d) * (t - 2) + b;
	} else if (tp == 'cubic') {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	} else if (tp == 'bounce') {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		}
	} else {
		return (c * (t / d)) + b;
	}
}

function P7_AGManimate(ob, prop, un, fv, tv, dur, typ, cb){
	if (ob.p7AnimRunning) {
		ob.p7AnimRunning = false;
		clearInterval(ob.p7AGManim);
	}
	if (ob.p7Scrolling) {
		P7_AGMcancelAnimFrame(ob.p7Scrolling);
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
	ob.p7animStartTime = P7_AGMgetTime(0);
	ob.p7animDuration = dur;
	if (!ob.p7AnimRunning) {
		ob.p7AnimRunning = true;
		ob.p7AGManim = setInterval(function(){
			P7_AGManimator(ob, cb);
		}, p7AGM.animDelay);
	}
}

function P7_AGManimator(el, cb, op){
	var i, tB, tA, tS, et, nv, m = false;
	et = P7_AGMgetTime(el.p7animStartTime);
	if (et >= el.p7animDuration) {
		et = el.p7animDuration;
		m = true;
	}
	if (el.p7animCurrentVal != el.p7animFinishVal) {
		nv = P7_AGManim(el.p7animType, et, el.p7animStartVal, el.p7animFinishVal - el.p7animStartVal, el.p7animDuration);
		el.p7animCurrentVal = nv;
		el.style[el.p7animProp] = nv + el.p7animUnit;
	}
	if (m) {
		el.p7AnimRunning = false;
		clearInterval(el.p7AGManim);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_AGMfade(ob, from, to, dur, typ, cb){
	if (ob.p7FadeRunning) {
		clearInterval(ob.p7Fade);
		ob.p7FadeRunning = false;
	}
	typ = (!typ) ? 'quad' : typ;
	ob.p7fadeType = typ;
	ob.p7StartFade = from;
	ob.p7FinishFade = to;
	ob.p7CurrentFade = ob.p7StartFade;
	if (ob.filters) {
		ob.style.filter = 'alpha(opacity=' + ob.p7CurrentFade + ')';
	} else {
		ob.style.opacity = ob.p7CurrentFade / 100;
	}
	ob.style.visibility = 'visible';
	ob.fadeStartTime = P7_AGMgetTime(0);
	ob.fadeDuration = dur;
	ob.p7FadeRunning = true;
	ob.p7Fade = setInterval(function(){
		P7_AGMfader(ob, cb);
	}, p7AGM.animDelay);
}

function P7_AGMfader(el, cb){
	var i, tC, tA, op, et, cet, m = false;
	et = P7_AGMgetTime(el.fadeStartTime);
	if (et >= el.fadeDuration) {
		et = el.fadeDuration;
		m = true;
	}
	if (el.p7CurrentFade != el.p7FinishFade) {
		op = P7_AGManim(el.p7fadeType, et, el.p7StartFade, el.p7FinishFade - el.p7StartFade, el.fadeDuration);
		el.p7CurrentFade = op;
		if (el.filters) {
			el.style.filter = 'alpha(opacity=' + el.p7CurrentFade + ')';
		} else {
			el.style.opacity = el.p7CurrentFade / 100;
		}
	}
	if (m) {
		el.p7FadeRunning = false;
		clearInterval(el.p7Fade);
		if (cb && typeof(cb) === "function") {
			cb.call(el);
		}
	}
}

function P7_AGMrsz(){
	var i, x, tB, tU, tA, sW, sB, tw, nl, r, el, sC, max, mx, wx, ws, sh = true;
	for (i = 0; i < p7AGM.ctl.length; i++) {
		tB = p7AGM.ctl[i];
		if (tB && tB.agmCurrSlide) {
			if (p7AGM.fullscreen == tB) {
				sh = false;
			}
			mx = tB.agmToolDivLeft.parentNode.offsetWidth - tB.agmToolDivRight.offsetWidth - 6;
			tB.agmToolDivLeft.style.maxWidth = mx + 'px';
			tB.agmCurrCatTx.style.maxWidth = 'none';
			ws = (tB.agmCurrCatTx.parentNode.getElementsByTagName('LI')[0].offsetLeft) * 2;
			wx = mx - tB.agmCurrCatTx.offsetLeft - tB.agmShowCat.offsetWidth - ws;
			wx = (wx < 0) ? 0 : wx;
			if (tB.agmCurrCatTx.offsetWidth > wx) {
				P7_AGMsetClass(tB.agmCurrCatTx, 'agm-truncated');
			} else {
				P7_AGMremClass(tB.agmCurrCatTx, 'agm-truncated');
			}
			tB.agmCurrCatTx.style.maxWidth = wx + 'px';
			P7_AGMsyncThumb(tB, 1);
			sW = tB.agmSW;
			sB = tB.agmCurrSlide;
			sC = sB.agmSC;
			if (sW.p7AnimRunning) {
				sW.p7AnimRunning = false;
				clearInterval(sW.p7AGManim);
			}
			if (sh) {
				sW.style.height = sB.offsetHeight + 'px';
			} else {
				sW.style.height = '100%';
			}
		}
		if (tB && tB.agmCurrCat && tB.agmCurrCat.agmLastLi) {
			tU = tB.agmCurrCat;
			tw = (tU.agmLastLi.offsetLeft + tU.agmLastLi.offsetWidth) - tU.parentNode.offsetWidth;
			tA = tU.agmSlides[tB.agmCurrSlideNum];
		}
	}
}

function P7_AGMkey(evt){
	var dv, k, tg, nn, ac, m = true;
	evt = (evt) ? evt : event;
	tg = (evt.target) ? evt.target : evt.srcElement;
	if (p7AGM.downKey == evt.keyCode) {
		return;
	}
	p7AGM.downKey = evt.keyCode;
	if (!p7AGM.fullscreen) {
		return;
	} else {
		dv = p7AGM.fullscreen.id;
	}
	nn = tg.nodeName.toLowerCase();
	if (!evt.altKey && !evt.ctrlKey) {
		if (nn != 'input' && nn != 'textarea') {
			k = evt.keyCode;
			if (k == 27 || (k == 88 && typeof(opera) != 'object')) {
				P7_AGMfullscreen(dv, 'off');
				m = false;
			} else if (k == 33 || k == 37 || k == 109 || k == 32 && evt.shiftKey) {
				P7_AGMcontrol(dv, null, 'prev');
				m = false;
			} else if (k == 34 || k == 39 || k == 107 || k == 32) {
				P7_AGMcontrol(dv, null, 'next');
				m = false;
			} else if (k == 35) {
				P7_AGMcontrol(dv, null, 'last');
				m = false;
			} else if (k == 36) {
				P7_AGMcontrol(dv, null, 'first');
				m = false;
			} else if (k == 80) {
				if (p7AGM.fullscreen.agmShowMode) {
					ac = (p7AGM.fullscreen.agmShowMode == 'play') ? 'pause' : 'play';
					P7_AGMcontrol(dv, null, ac);
					m = false;
				}
			}
		}
	}
	if (!m) {
		P7_AGMprevDefault(evt);
	}
	return m;
}

function P7_AGMkeyup(evt){
	evt = (evt) ? evt : event;
	p7AGM.downKey = null;
}

function P7_AGMurl(dv){
	var i, h, s, x, k, d = 'agm', pn, tB, sp, n = dv.replace('p7AGM_', '');
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
					if (sp.length != 3 || n != sp[0]) {
						x = false;
					}
					if (sp && sp.length == 3) {
						tB.agmDefCat = sp[1];
						tB.agmDefImage = sp[2];
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
			tB.agmDefPanel = P7_AGMparsePN(x);
		}
	}
}

function P7_AGMgetByAttribute(att, cls){
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

function P7_AGMgetCSSPre(){
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

function P7_AGMhasFlex(el){
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

function P7_AGMcopyCN(tD, tS){
	while (tS.childNodes.length > 0) {
		tD.appendChild(tS.childNodes[0]);
	}
}

function P7_AGMaddEvent(obj, evt, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evt, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + evt, fn);
	}
}

function P7_AGMprevDefault(evt){
	if (evt.preventDefault) {
		evt.preventDefault();
	} else {
		evt.returnValue = false;
	}
}

function P7_AGMremoveEvent(obj, evt, fn){
	if (obj.removeEventListener) {
		obj.removeEventListener(evt, fn, false);
	} else if (obj.detachEvent) {
		obj.detachEvent('on' + evt, fn);
	}
}

function P7_AGMinitAnimFrame(){
	window.P7_AGMrequestAnimFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){
			return window.setTimeout(callback, 1000 / 60);
		};
	})();
	window.P7_AGMcancelAnimFrame = (function(callback){
		return window.cancelAnimationFrame ||
		window.webkitCancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		function(callback){
			window.clearTimeout(callback);
		};
	})();
}

function P7_AGMsetClass(ob, cl){
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

function P7_AGMremClass(ob, cl){
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

function P7_AGMsetCC(dd, rp, ac){
	var d, tC;
	d = dd.replace('_', rp);
	tC = document.getElementById(d);
	if (tC) {
		tC.onclick = function(){
			return P7_AGMcontrol(dd, 0, ac);
		};
	}
	return tC;
}

function P7_AGMgetIEver(){
	var j, k, v = -1, nv;
	nv = navigator.userAgent.toLowerCase();
	j = nv.indexOf("msie");
	if (j > -1) {
		v = parseFloat(nv.substring(j + 4, j + 8));
		if (document.documentMode) {
			v = document.documentMode;
		}
		p7AGM.ie = v;
	}
	j = nv.indexOf('trident/');
	if (j > 0) {
		k = nv.indexOf('rv:');
		if (k && k > 0) {
			v = parseInt(nv.substring(k + 3, nv.indexOf('.', k)), 10);
		}
		p7AGM.ie = v;
	}
	return v;
}
