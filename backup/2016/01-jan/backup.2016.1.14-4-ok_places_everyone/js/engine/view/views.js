function Views(views) {
    this.views = views;
}

Views.prototype.loadJson = function(data) {
    this.views = data.views;
}

Views.prototype.getViews = function() {
    return this.views;
}

