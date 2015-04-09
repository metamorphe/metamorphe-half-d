// DIMENSIONS ARE IN MM
function TextureSphere(r, w_r, h_r, material){
	console.log("sphere", r, w_r, h_r, material);
	var geometry = new THREE.SphereGeometry(r, w_r, h_r)
	geometry.dynamic = true;

	this.radius = r;
	this.mesh = new THREE.Mesh(	geometry, material );

	this.mesh.rotation.z = - Math.PI;
	this.mesh.position.y =  0;
	this.material = material;
}

TextureSphere.prototype = {
	// Return the top geometry of the planar box
	computeTextelIndices: function(){
		if(typeof this.textel_indices !== "undefined") return this.textel_indices;

		var geom = this.mesh.geometry;
		this.textel_indices = [];
		var self = this;
		
		// vertice indices
		var keys = ["a", "b", "c"];
		var indices = [];
		var normals = [];
		$.map(geom.faces, function(el, i){
			for(var j in keys){
				var vert = el[keys[j]];
				var vertexNorm = el.vertexNormals[j];
				// if((vertexNorm.y < 0.9 && vertexNorm.y > -0.9)){
				indices.push(vert);
				normals.push(vertexNorm);
				// }
					

			}
		});

		// ONLY UNIQUE VERTICES
		var clean_indices = [];
		var clean_normals = [];
		$.each(indices, function(i, el){
			if($.inArray(el, clean_indices) === -1){
				clean_indices.push(el);
				clean_normals.push(normals[i]);
			}
		});

		this.textel_indices = $.map(clean_indices, function(el, i){
			return {vertex: el, normal: clean_normals[i]}
		});
			console.log(this.textel_indices);
		return this.textel_indices;
	},
	// applies fn to top vertex indices
	applyTexture: function(fn, vertices){
		this.mesh.geometry.computeVertexNormals();

		var textel_indices = this.computeTextelIndices();
		
		$.each(textel_indices, function(i, el){
			fn(vertices[el.vertex], el.vertex, el.normal);
		});

		this.mesh.geometry.verticesNeedUpdate = true;
	}, 
	test: function(){
		this.computeTextelIndices();
		this.applyTexture(function(vertex, id, normal){ 
			vertex.add(normal);
		}, pb.mesh.geometry.vertices);
		return true;
	}
}