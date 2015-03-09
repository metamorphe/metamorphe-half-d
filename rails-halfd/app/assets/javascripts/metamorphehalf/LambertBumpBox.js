var lambertMaterial = new THREE.MeshLambertMaterial({
						        ambient: new THREE.Color( 0xff0000 ),
						        color: new THREE.Color( 0xffffff ),
						        specular: new THREE.Color( 0x00ff00 ),
						        // emissive: new THREE.Color( 0x0000ff ),
						        side: THREE.DoubleSide,
						        shininess: 0
						      });


function LambertBumpBox(url, mag, h, w, d, resolution){
	this.url = url; 
	this.mag = mag;
	this.h = h; 
	this.w = w; 
	this.d = d; 
	this.resolution = resolution;

}

LambertBumpBox.prototype = {
	load: function(callbackFN){
		var self = this;
		if(typeof alert !== "undefined")
			alert.notice("Calculating ... ");
		BumpBox.loadTexture(this.url, function(texture){
			self.obj = BumpBox.make(self.w, self.h, self.d, self.resolution, lambertMaterial);
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
	var new_depth = [];

	for(var i in depthMap){
		new_depth[i] = depthMap[i].clone().multiplyScalar(magnitude);
	}
	return new_depth;
}
var wp;

LambertBumpBox.getDepthMap = function(texture, obj, fn, box){
	var start = performance.now();
	
	self.depth_map = storage.cache(box.url, function(){
		wp = new workPackage(texture, obj.mesh.geometry);
		box.depth_map = extractDepthMap(wp);
		var end = performance.now();
		var time = (end - start)/1000;
		console.log('Total Execution time: ' + time.toFixed(2));

		fn(box);
	}, function(val){
		box.depth_map = $.map(val, function(val, i){
			return new THREE.Vector3(val.x, val.y, val.z);
		});
		var end = performance.now();
		var time = (end - start)/1000;
		console.log('Total Execution time: ' + time.toFixed(2));
		fn(box);
	});
}


function extractDepthMap(wp){
	console.log("Extracting");
	var height = wp.pixels.height;
	var width = wp.pixels.width;
	var pixels = wp.pixels;
	var faces = wp.faces;
	var faceVertexUvs = wp.faceVertexUvs;

	depthMap = [];

	faces.forEach(function(face, i){
		var uv1 = faceVertexUvs[0][i][0];
		var pixel1 = pixels.data[uv2xy(uv1, width, height)];

		var uv2 = faceVertexUvs[0][i][1];
		var pixel2 = pixels.data[uv2xy(uv2, width, height)];	

		var uv3 = faceVertexUvs[0][i][2];
		var pixel3 = pixels.data[uv2xy(uv3, width, height)];

		var normal = face.normal;

		depthMap[faces[i].a] = normal.clone().multiplyScalar(pixel1); 
		depthMap[faces[i].b] = normal.clone().multiplyScalar(pixel2); 
		depthMap[faces[i].c] = normal.clone().multiplyScalar(pixel3); 
	});
	return depthMap;
}

function uv2xy(uv, w, h){
	var u = uv.y;
	var v = uv.x;

	if(u < 0 || u > 1 || v < 0 || v > 1){
		var err = new Error("Invalid UV coordinates (" + u + ", " + v + ")");
		return err.stack;
	}

	var x = Math.floor(u * 1.0 * h);
	var y = (w - 1) - Math.floor(v * 1.0 * w);

	var row = x * (w * 4); 
	var col = y * 4;
	var index = row + col;

	return index;
}


