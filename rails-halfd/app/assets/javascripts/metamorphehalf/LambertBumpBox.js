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
		BumpBox.loadTexture(this.url, function(texture){
			self.obj = BumpBox.make(200, 200, 100.0, lambertMaterial);
			self.obj.mesh.geometry.original = clone_vec_array(self.obj.mesh.geometry.vertices); //Keep the original geometry

			self.texture = texture;
			// UPDATE THE PHYSICAL/CPU ENGINE
			self.depth_map = storage.cache(this.url, function(){ 
				return LambertBumpBox.cacheDepthMap(texture, self.obj)
			}, function(val){
				return $.map(val, function(val, i){
					return new THREE.Vector3(val.x, val.y, val.z);
				});
			});

			callbackFN(self);
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

LambertBumpBox.cacheDepthMap = function(texture, obj){
	console.log("caching");
	
	// vertexID ==> normal * grayImagePixel 
		depthMap = [];

		var geometry = obj.mesh.geometry;
		var vertices = clone_vec_array(obj.mesh.geometry.original);
	    var faces = geometry.faces;
	      

	    for (i = 0; i < geometry.faces.length ; i++) {

	      var uv1 = geometry.faceVertexUvs[0][i][0];
	      var v1 = vertices[faces[i].a];

	      
	      var uv2 = geometry.faceVertexUvs[0][i][1];
	      var v2 = vertices[faces[i].b];	
	      
	      var uv3 = geometry.faceVertexUvs[0][i][2];
	      var v3 = vertices[faces[i].c];

	      var normal = faces[i].normal;
	    
	      depthMap[faces[i].a] = normal.clone().multiplyScalar(texture.getUV(uv1));
	      depthMap[faces[i].b] = normal.clone().multiplyScalar(texture.getUV(uv2));
	      depthMap[faces[i].c] = normal.clone().multiplyScalar(texture.getUV(uv3));
 
    	}
   
    	return depthMap; 
}
