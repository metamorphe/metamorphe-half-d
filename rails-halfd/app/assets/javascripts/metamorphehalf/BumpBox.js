function BumpBox(){

}


BumpBox.make = function(h, w, d, resolution, material){
	console.log("MAKE", h, w, resolution);
	var w_seg_size = w / resolution;
	var h_seg_size = h / resolution;

	var seg_size =  Math.min(w_seg_size, h_seg_size);

	var w_segments = parseInt(w/seg_size);
	var h_segments = parseInt(h/seg_size);

	pb = new PlaneBox(h, w, d, h_segments, w_segments, 1, material);
	// pb = new TextureCylinder(35, 70, 100, 100, false, material);
	return pb;	
}




BumpBox.loadTexture = function(url, ready){
	console.log("Trying to load", url);
	var bumpTexture = new THREE.ImageUtils.loadTexture(url, THREE.UVMapping, function(texture){
		console.log("Successfully loaded texture!", url);
		ready(texture);
	});
}