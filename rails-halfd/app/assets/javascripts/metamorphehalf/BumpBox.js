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
	pb.mesh.rotation.x = - Math.PI / 2;
	pb.mesh.rotation.z = - Math.PI;
	pb.mesh.position.y =  0;
	return pb;	
}




BumpBox.loadTexture = function(url, ready){
	console.log("Trying to load", url, ready);
	var bumpTexture = new THREE.ImageUtils.loadTexture(url, THREE.UVMapping, function(texture){
		console.log("Successfully loaded texture!", url);
		// texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping; 
		texture.minFilter = THREE.LinearFilter;
		ready(texture);
	});
}