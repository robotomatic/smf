"use strict";

function ItemRenderer() {
    this.tilerenderer = new ItemRendererTiles();
    this.cloudsrenderer = new ItemRendererClouds();
    this.wavesrenderer = new ItemRendererWaves();
    this.flagsrenderer = new ItemRendererFlag();
    this.scaffoldrenderer = new ItemRendererScaffold();
    this.woodrenderer = new ItemRendererWood();
    this.groundrenderer = new ItemRendererGround();
    this.grassrenderer = new ItemRendererGrass();
    this.bushrenderer = new ItemRendererBush();
    this.rockrenderer = new ItemRendererRock();
    this.treerenderer = new ItemRendererTree();
    this.metalrenderer = new ItemRendererMetal();
    this.starsrenderer = new ItemRendererStars();
    this.gearsrenderer = new ItemRendererGears();
}

ItemRenderer.prototype.render = function(ctx, color, renderer, item, x, y, width, height, titem, scale, drawdetails) {
    
    // todo: gross.
    
    if (renderer == "tile") this.tilerenderer.drawTiles(ctx, color, item, x, y, width, height, scale, titem);
    
    else if (renderer == "stars") this.starsrenderer.drawStars(ctx, item, x, y, width, height, scale, titem);
    else if (renderer == "scaffold") this.scaffoldrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
    else if (renderer == "wood") this.woodrenderer.drawSupport(ctx, item, x, y, width, height, titem, drawdetails);
    else if (renderer == "ground") this.groundrenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "ground-bg") this.groundrenderer.drawPlatformBg(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "grass") this.grassrenderer.drawGrass(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "bush") this.bushrenderer.drawBush(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "rock") this.rockrenderer.drawRock(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "tree") this.treerenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);
    else if (renderer == "metal") this.metalrenderer.drawPlatform(ctx, item, x, y, width, height, scale, titem, drawdetails);

    else if (renderer == "gear") this.gearsrenderer.drawGear(ctx, item, x, y, width, height, titem, drawdetails);

    else if (renderer == "clouds" || renderer == "fog") this.cloudsrenderer.drawClouds(ctx, item, x, y, width, height, scale, titem);
    else if (renderer == "wave") this.wavesrenderer.drawWaves(ctx, titem.color, item, x, y, width, height, scale, titem);
    else if (renderer == "flag") this.flagsrenderer.drawFlag(ctx, item, x, y, width, height, scale, titem);
}
