// DIMENSIONS ARE IN MM
function PlaneBox(h, w, d, h_s, w_s, d_s, material){
	// TODO DEFAULTIZE h_s, w_s, d_s to 1
	console.log(h, w, d, h_s, w_s, d_s);
	this.depth = d;
	this.geometry = new THREE.BoxGeometry(h, w, d, h_s, w_s, d_s);
	this.mesh = new THREE.Mesh(	this.geometry, material );
	this.material = material;
	this.mesh.rotation.x = -Math.PI / 2;
	this.mesh.position.y = -100;
}

PlaneBox.prototype = {
	// Return the top geometry of the planar box
	cacheTop: function(){
		if(typeof this.top_indices !== "undefined") return this.top_indices;

		var geom = this.geometry;
		this.top_indices = [];
		var self = this;
		
		// vertice indices
		$.map(geom.vertices, function(el, i){
			if(el.z >= self.depth/2.0) self.top_indices.push(i);
		});



		return this.top_indices;
	}, 
	// applies fn to top vertex indices
	applyToTop: function(fn, vertices){
		var top = this.cacheTop();
		$.each(top, function(i, el){
			var vertex = vertices[el]
			fn(vertex, el);
		});
		this.geometry.verticesNeedUpdate = true;
		return true;
	}



	// function facesToNewRegion(faces){
	//   data = {faces: faces, pca1: [0, 1, 0], pca2: [1, 0, 0], pca3: [0, 0, 1], neighbors_computed: false};
	//   var r = new Region(stl, data);
	//   stl.regions.push(r);
	//   r.highlight(true);
	// }
}

// function extractFaces(geometry, vertexIndices){
// 		// console.log(geometry, vertexIndices);
//   	  //INDEX OF FACES
//       counts = {};
//       console.log(vertexIndices.length);
//       faces = $.map(vertexIndices, function(e){ return toFaces(geometry, e)});//.sort();
//       $.each(faces, function(i,e){ if(typeof counts[e] === "undefined") counts[e] = 1; else counts[e] ++ });
//       faces = $.map(counts, function(e, i){ if(e >= 1) return parseInt(i)});
//       return faces;
// }

// function toFaces(geometry, p){ 
// 	return $.map(geometry.faces, function(e, i){ if(e.a == p || e.b == p || e.c == p) return i; })
// }
