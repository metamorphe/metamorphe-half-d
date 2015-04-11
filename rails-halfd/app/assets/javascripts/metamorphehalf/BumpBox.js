function BumpBox(){}


BumpBox.make = function(h, w, d, resolution, material){
	console.log("MAKE", h, w, resolution);
	var w_seg_size = w / resolution;
	var h_seg_size = h / resolution;

	var seg_size =  Math.min(w_seg_size, h_seg_size);

	var w_segments = parseInt(w/seg_size);
	var h_segments = parseInt(h/seg_size);

	// pb = new PlaneBox(h, w, d, h_segments, w_segments, 1, material);
	// Height = circumference
	var cy_height = 20;
	var cy_radius = 20;
	// cy_height / (2 * Math.PI) * 3;

	// var cy_height = 35;

	// var cy_radius = 35;
	// var cy_height = cy_radius * Math.PI * 2;
	pb = new TextureCylinder(cy_radius, cy_height, 200, 200, false, material);

	return pb;	
}




BumpBox.loadTexture = function(url, ready){
	console.log("Trying to load", url);
	var bumpTexture = new THREE.ImageUtils.loadTexture(url, THREE.UVMapping, function(texture){
		console.log("Successfully loaded texture!", url);
		// texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping; 
	texture.minFilter = THREE.LinearFilter;
		ready(texture);
	});
}