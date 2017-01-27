"use strict";

var debug_render = {
    front_top : true,
    front_front : true,
    front_bottom : true,
    side_front : true,
    side_top : true,
    side_side : true,
    side_bottom : true
}


function initializeDevRender() {
    
    document.getElementById("dev-render-occlude-label-front-top-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-front-front-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-front-bottom-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-side-front-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-side-top-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-side-side-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
    document.getElementById("dev-render-occlude-label-side-bottom-debug").onchange = function() {
        devSetOcclusion(this.id, this.checked);
    };
}


function devSetOcclusion(id, val) {
    var nid = id.replace("dev-render-occlude-label-", "").replace("-debug", "").replace("-", "_");
    debug_render[nid] = val;
}


function updateDevRender() {

}


function devRenderOcclusions(totals, colors) {
    document.getElementById("dev-render-occlude-label-front-top").innerText = totals.front_top;
    document.getElementById("dev-render-occlude-label-front-front").innerText = totals.front_front;
    document.getElementById("dev-render-occlude-label-front-bottom").innerText = totals.front_bottom;
    
    document.getElementById("dev-render-occlude-label-front-top-color").style.backgroundColor = colors.front_top;
    document.getElementById("dev-render-occlude-label-front-front-color").style.backgroundColor = colors.front_front;
    document.getElementById("dev-render-occlude-label-front-bottom-color").style.backgroundColor = colors.front_bottom;
    
    document.getElementById("dev-render-occlude-label-side-front").innerText = totals.side_front;
    document.getElementById("dev-render-occlude-label-side-top").innerText = totals.side_top;
    document.getElementById("dev-render-occlude-label-side-side").innerText = totals.side_side;
    document.getElementById("dev-render-occlude-label-side-bottom").innerText = totals.side_bottom;
    
    document.getElementById("dev-render-occlude-label-side-front-color").style.backgroundColor = colors.side_front;
    document.getElementById("dev-render-occlude-label-side-top-color").style.backgroundColor = colors.side_top;
    document.getElementById("dev-render-occlude-label-side-side-color").style.backgroundColor = colors.side_side;
    document.getElementById("dev-render-occlude-label-side-bottom-color").style.backgroundColor = colors.side_bottom;

    document.getElementById("dev-render-occlude-label-items-hidden").innerText = totals.hidden;
    document.getElementById("dev-render-occlude-label-items-hidden-color").style.backgroundColor = colors.hidden;

    document.getElementById("dev-render-occlude-label-items").innerText = totals.items;
    document.getElementById("dev-render-occlude-label-items-color").style.backgroundColor = colors.items;
    
    document.getElementById("dev-render-occlude-label-items-overlap").innerText = totals.overlaps;
    document.getElementById("dev-render-occlude-label-items-overlap-color").style.backgroundColor = colors.overlaps;
}