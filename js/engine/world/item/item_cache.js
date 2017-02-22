"use strict";

function ItemCache() {

//    this.cache = new Array();
//    this.box = new Rectangle(0, 0, 0, 0);
//    this.image = new Image(null, 0, 0, 0, 0);
//    this.debug = false;
//    this.itemdebugger = new ItemDebugger();
//
//    this.temp = {
//        canvas : null,
//        ctx : null
//    };
//    this.temp.canvas = document.createElement('canvas');
//    this.temp.ctx = this.temp.canvas.getContext("2d");
    
}

ItemCache.prototype.reset = function() {
//    this.cache.length = 0;
}

ItemCache.prototype.renderItem = function(now, ctx, item, renderer, mbr, window, width, height, quality, floodlevel) {
    item.renderStart(now, width, height);
    item.renderRender(now, ctx, renderer, mbr, window, width, height);
    item.renderEnd(now, ctx);
}




//ItemCache.prototype.foo = function(now, ctx, item, renderer, mbr, window, width, height, quality, floodlevel) {
//    
//    var x = mbr.x;
//    var y = mbr.y;
//    var z = mbr.z;
//    var scale = mbr.scale;
//
//    var px = x;
//    var py = y;
//    var pz = z;
//    var pw = width;
//    var ph = height;
//    var gctx = ctx;
//    
////    var mbr = item.getProjectedMbr();
////    var px = 0;
////    var py = 0;
////    var pw = mbr.width;
////    var ph = mbr.height;
////    
////    this.temp.canvas.x = 0;
////    this.temp.canvas.y = 0;
////    this.temp.canvas.width = pw;
////    this.temp.canvas.height = ph;
////    
////    var gctx = this.temp.ctx;
//
//    this.renderItemItem(now, gctx, item, renderer, mbr, px, py, pz, pw, ph, scale, quality, floodlevel);
//    this.debugItem(now, gctx, item, renderer, mbr, px, py, pz, pw, ph, scale);
//    
////    item.image.x = 0;
////    item.image.y = 0;
////    item.image.width = mbr.width;
////    item.image.height = mbr.height;
////    item.image.data = this.temp.canvas;
////    
////    item.image.draw(ctx, mbr.x, mbr.y, mbr.width, mbr.height);
//}
//
//ItemCache.prototype.renderItemItem = function(now, ctx, item, renderer, window, ox, oy, oz, width, height, scale, quality, floodlevel) {
//
//    quality = 2;
//    
//    var box = item.box;
//    var x = box.x;
//    var y = box.y;
//    var w = box.width;
//    var h = box.height;
//    
//    this.box.x = x;
//    this.box.y = y;
//    this.box.width = w;
//    this.box.height = h;
//
//    if (item.iteminfo && item.iteminfo.front === false) return;
//    
//    var p = 1;
//    //var pad = p * item.scalefactor;
//    var pad = p;
//    var hpad = pad / 2;
////    var qpad = pad * quality;
//    var qpad = pad;
//    var qhpad = qpad / 2;
//
//    var iiw = item.width;
//    var iw = 0;
//    if (iiw == "100%") {
//        iw = width;
//        w = width;
//        x = 0;
//        quality = 1;
//    } else {
//        iw = iiw * quality;
//    }
//    
//    var iih = item.height;
//    var ih = 0;
//    if (iih == "100%") {
//        ih = height;
//        h = height;
//        y = 0;
//        quality = 1;
//    } else {
//        ih = iih * quality;
//    }
//    
//    if (item.cache === true) {
//        var cachename = item.id;
//        var cacheitem = this.cache[cachename];
//        
//        if (!cacheitem) {
//            var cachecanvas = document.createElement('canvas');
//            cacheitem = {
//                canvas : cachecanvas,
//                ctx : cachecanvas.getContext("2d")
//            }
//            this.cache[cachename] = cacheitem;
//            item.box.x = 0;
//            item.box.y = 0;
//            item.box.width = iw;
//            item.box.height = ih;
//            cacheitem.canvas.width = item.box.width + qpad;
//            cacheitem.canvas.height = item.box.height + qpad;
//            item.render(now, cacheitem.ctx, window, qhpad, qhpad, quality, renderer);
//        }
//        
//        this.image.x = 0;
//        this.image.y = 0;
//        this.image.width = cacheitem.canvas.width;
//        this.image.height = cacheitem.canvas.height;
//        this.image.data = cacheitem.canvas;
//        
//        var dx = x;
//        var dy = y;
//        var dw = w;
//        var dh = h;
//
////        var spad = pad * scale * item.scalefactor;
//        var spad = pad;
//        var shpad = spad / 2;
//        
//        dx = x - shpad;
//        dy = y - shpad;
//        dw = w + spad;
//        dh = h + spad;
//        
//        this.image.clipY(floodlevel ? floodlevel : 0);
//        
//        this.image.draw(ctx, dx, dy, dw, dh);
//    } else {
//        item.render(now, ctx, window, x, y, scale, renderer);
//    }
//}
//    
//ItemCache.prototype.debugItem = function(now, ctx, item, renderer, window, ox, oy, oz, width, height, scale) {
//    var debug = false;
//    if (!this.debug && !item.debug && !debug) return;
//    item.box.x = this.box.x;
//    item.box.y = this.box.y;
//    item.box.width = this.box.width;
//    item.box.height = this.box.height;
//    this.itemdebugger.debugItem(item, now, ctx, window, ox, oy, width, height, scale);
//}
