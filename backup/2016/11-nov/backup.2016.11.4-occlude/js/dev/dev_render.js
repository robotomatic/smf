"use strict";

function initializeDevRender() {
    
}

function updateDevRender() {

}


function devLogRenderOcclusions(totals, colors) {
    document.getElementById("dev-render-occlude-label-front-top").innerText = totals.front_top;
    document.getElementById("dev-render-occlude-label-front-front").innerText = totals.front_front;
    document.getElementById("dev-render-occlude-label-front-bottom").innerText = totals.front_bottom;
    
    document.getElementById("dev-render-occlude-label-front-top-color").style.backgroundColor = colors.front_top;
    document.getElementById("dev-render-occlude-label-front-front-color").style.backgroundColor = colors.front_front;
    document.getElementById("dev-render-occlude-label-front-bottom-color").style.backgroundColor = colors.front_bottom;
    
    document.getElementById("dev-render-occlude-label-side-top").innerText = totals.side_top;
    document.getElementById("dev-render-occlude-label-side-side").innerText = totals.side_side;
    document.getElementById("dev-render-occlude-label-side-bottom").innerText = totals.side_bottom;
    
    document.getElementById("dev-render-occlude-label-side-top-color").style.backgroundColor = colors.side_top;
    document.getElementById("dev-render-occlude-label-side-side-color").style.backgroundColor = colors.side_side;
    document.getElementById("dev-render-occlude-label-side-bottom-color").style.backgroundColor = colors.side_bottom;

    document.getElementById("dev-render-occlude-label-items").innerText = totals.items;
    document.getElementById("dev-render-occlude-label-items-color").style.backgroundColor = colors.items;
}