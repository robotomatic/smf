function drawPerspective(canvasId, imgUrl, scale) {
  var canvas  = document.getElementById(canvasId),
      context = canvas.getContext('2d'),
      img     = document.createElement('img');
  
  img.src = imgUrl;
  
  img.onload = function () {
    context.clearRect(0, 0, img.width,img.height);
    canvas.height = img.height;
    canvas.width  = img.width;
    
    numSlices   = img.width * 0.75;
    sliceWidth  = img.width / numSlices;
    sliceHeight = img.height;
    heightScale = (1 - scale) / numSlices;
    widthScale  = (scale*scale*scale);
    
    for (var i = 0; i < numSlices; i++) {
      // Where is the vertical chunk taken from?
       var sx = sliceWidth * i,
           sy = 0;
      
      // Where do we put it?
       var dx      = sliceWidth * i * widthScale,
           dy      = (sliceHeight * heightScale * (numSlices - i)) / 2,
           dHeight = sliceHeight * (1 - (heightScale * (numSlices - i))),
           dWidth  = sliceWidth * scale;
           
    
       context.drawImage(img, sx, sy, sliceWidth, sliceHeight, dx, dy, dWidth, dHeight);
    }
    
  };
}
          
sign  = 1;
scale = 1;

setInterval(function(){
   scale -= 0.0025 * sign;
   drawPerspective("yourCanvasID", 'https://i.redd.it/3kup8ap55qnx.jpg', scale);

  if(scale <= 0.5 || scale >= 1) sign = - sign;
}, 30);