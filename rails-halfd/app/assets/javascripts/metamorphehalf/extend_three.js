// THREE.js extension functions

THREE.Texture.prototype.calculateRGB = function() {
	var img = this.image;
	var canvas = $('canvas#texture-render')[0];
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	this.imgCanvas = canvas.getContext('2d');
	this.rgb_calculated = true;
}


 // returns the gray pixel at coordinates vec2
THREE.Texture.prototype.getUV = function(vec2) {
	var u = vec2.x;
	var v = vec2.y;
	if(u < 0 || u > 1 || v < 0 || v > 1){
		var err = new Error("Invalid UV coordinates (" + u + ", " + v + ")");
   		return err.stack;
	}
	if(u < 0.01) u = 0.01; // image overhang adjustment
	if(v < 0.01) v = 0.01; // image overhang adjustment



	if(! this.rgb_calculated) this.calculateRGB();

	var img = this.image;
	var x = u * 1.0 * img.width;
	var y = v * 1.0 * img.height;

	// flip vertex
	x = img.width - x;
	y = img.height - y;
	
	// // top-left
	// var x1 = Math.floor(u * img.width);
	// var y1 = Math.floor(v * img.height);
	
	// // bottom-left
	// var x2 = Math.ceil(u * img.width);
	// var y2 = Math.ceil(v * img.height);
	
	// var Q11 = this.getGrayPixel(x1, y1);
	// var Q21 = this.getGrayPixel(x2, y1);
	// var Q12 = this.getGrayPixel(x1, y2);
	// var Q22 = this.getGrayPixel(x2, y2);

	// console.log(x1, x, x2, y1, y, y2, Q11, Q21, Q12, Q22);
	
  // ###*
  // # (x1, y1) - coordinates of corner 1 - [Q11]
  // # (x2, y1) - coordinates of corner 2 - [Q21]
  // # (x1, y2) - coordinates of corner 3 - [Q12]
  // # (x2, y2) - coordinates of corner 4 - [Q22]
  // # 
  // # (x, y)   - coordinates of interpolation
  // # 
  // # Q11      - corner 1
  // # Q21      - corner 2
  // # Q12      - corner 3
  // # Q22      - corner 4
  // ###
  return this.getGrayPixel(x, y);
	// return calcBilinearInterpolant(x1, x, x2, y1, y, y2, Q11, Q21, Q12, Q22)
}
THREE.Texture.prototype.getGrayPixel = function(x, y){
	var val = this.imgCanvas.getImageData(x, y, 1, 1).data;
	return .2126 * val[0] + .7152 *  val[1] + .0722 *  val[2]; 
}