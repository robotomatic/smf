"use strict";

var DATE_NOW = new Date();    

var benchmarklast = null;
var benchmarkgroup = "";
var benchmarkgroupstart = null;
var benchmarkgrouplast = false;

function cloneObject(o) {
    if (!o || o == undefined) {
        return null;
    }
    return JSON.parse(JSON.stringify(o));
}

function clearRect(ctx, x, y, width, height) { 
    ctx.clearRect(x, y, width, height); 
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function timestamp() {
    if (window.performance && window.performance.now) return window.performance.now();
    return DATE_NOW.getTime();
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


function benchmark(what, group = null) {
    
    if (!__dev) return;

    var now = timestamp();
    var date = new Date();
    
    var messagestart = "";
    var messageend = "";
    
    if (benchmarklast) {
        var d = round((now - benchmarklast) / 1000, 3);
        messagestart = formatDate(date) + ": ";
        messageend = what + " == " + d;
        
    } else {
        messagestart = formatDate(date) + ": ";
        messageend = what;
    }

    var start = false;
    var end = false;
    if (group && benchmarkgroup) {
        benchmarkgroup = "";
        end = true;
        var dd = round((now - benchmarkgroupstart) / 1000, 3);
        messageend = what + " == " + dd;
    } else if (group) {
        start = true;
        if (!benchmarkgrouplast) {
            logDev("");
        }
    }
    
    if (benchmarkgroup) {
        messagestart += "---> ";
    }

    var message = messagestart + messageend;
    logDev(message);
    
    if (group) {
        if (end) {
            logDev("");
            benchmarkgroupstart = null;
            benchmarkgrouplast = true;
        } else {
            benchmarkgroup = group;
            benchmarkgroupstart = now;
            benchmarkgrouplast = false;
        }
    } else {
        benchmarkgrouplast = false;
    }

    benchmarklast = now;
}




function formatDate(date) {
    var monthnames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var day = date.getDate();
    var monthindex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthnames[monthindex] + ' ' + year + " " + formatTime(date);
}

function formatTime(date) {
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var milli = round(date.getMilliseconds(), 3);
    return hour + ":" + min + ":" + sec + ":" + milli;
}