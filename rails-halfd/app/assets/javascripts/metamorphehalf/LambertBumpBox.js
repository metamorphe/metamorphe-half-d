var lambertMaterial = new THREE.MeshLambertMaterial({
						        ambient: new THREE.Color( 0xff0000 ),
						        color: new THREE.Color( 0xffffff ),
						        specular: new THREE.Color( 0x00ff00 ),
						        // emissive: new THREE.Color( 0x0000ff ),
						        side: THREE.DoubleSide,
						        shininess: 0
						      });


function LambertBumpBox(url, mag){
	this.url = url; 
	this.mag = mag;


}




LambertBumpBox.prototype = {
	load: function(callbackFN){
		var self = this;
		alert.notice("Calculating ... ");
		BumpBox.loadTexture(this.url, function(texture){
			self.obj = BumpBox.make(200, 200, 100.0, lambertMaterial);
			self.obj.mesh.geometry.original = clone_vec_array(self.obj.mesh.geometry.vertices); //Keep the original geometry

			self.texture = texture;
			// UPDATE THE PHYSICAL/CPU ENGINE
			LambertBumpBox.getDepthMap(texture, self.obj, callbackFN, self);
		});
	}, 
	raise: function(mag){
		mag /= 250.0;
		
		var geometry = this.obj.mesh.geometry;
		var vertices = clone_vec_array(this.obj.mesh.geometry.original);
		var depth_map = LambertBumpBox.adjustDepthMap(this.depth_map, mag);
	    
	    this.obj.applyToTop(function(vertex, id){
	    	vertex.add(depth_map[id]);
	    }, vertices);

    	this.obj.mesh.geometry.vertices = vertices;
		this.obj.mesh.geometry.verticesNeedUpdate = true;
    	this.obj.mesh.geometry.normalsNeedUpdate = true;
		this.obj.mesh.geometry.computeFaceNormals();
		this.obj.mesh.geometry.computeVertexNormals();
	},
	save: function(name){
		var filename = name + ".stl";
		console.log("Saving", filename);		
		AsciiStlWriter.save(this.obj.mesh.geometry, filename);
	}
}


LambertBumpBox.adjustDepthMap = function(depthMap, magnitude){
	var new_depth = []
	for(var i in depthMap)
		new_depth[i] = depthMap[i].clone().multiplyScalar(magnitude);
	return new_depth;
}

LambertBumpBox.getDepthMap = function(texture, obj, fn, box){

	self.depth_map = storage.cache(box.url, function(){
		var wp = new workPackage(texture, obj.mesh.geometry);
		
		depthWorker.addEventListener('message', function(e) {
		
		  	var depthMap = e.data.map(function(el, i){
		  		return new THREE.Vector3(el.x, el.y, el.z);
		  	});
		  	box.depth_map = depthMap;
		  	storage.set(box.url, JSON.stringify(depthMap));
		  	fn(box);
	  	}, false);

		depthWorker.postMessage({'wp': wp}); 	
	
	}, function(val){

		box.depth_map = $.map(val, function(val, i){
			return new THREE.Vector3(val.x, val.y, val.z);
		});
		fn(box);
	});
}
