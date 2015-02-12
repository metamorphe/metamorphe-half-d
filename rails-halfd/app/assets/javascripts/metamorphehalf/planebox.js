function PlaneBox(h, w, d, h_s, w_s, d_s){
	// TODO DEFAULTIZE h_s, w_s, d_s to 1
	console.log(h, w, d);
	this.depth = d;
	this.geometry = new THREE.BoxGeometry(h, w, d, h_s, w_s, d_s);
	this.mesh = new THREE.Mesh(	this.geometry, lambertMaterial);
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
		
		$.map(geom.vertices, function(el, i){
			if(el.z >= self.depth/2.0) self.top_indices.push(i);
		});
		
		return this.top_indices;
	}, 
	applyToTop: function(fn){
		var top = this.cacheTop();
		var geom = this.geometry;
		$.each(top, function(i, el){
			var vertex = geom.vertices[el]
			fn(vertex);
		});
		geom.verticesNeedUpdate = true;
		return true;
	}

	// function extractFaces(vertexIndices){
 //  	  //INDEX OF FACES
 //      counts = {};
 //      faces = $.map(vertexIndices, function(e){ return toFaces(e)});//.sort();
 //      $.each(faces, function(i,e){ if(typeof counts[e] === "undefined") counts[e] = 1; else counts[e] ++ });
 //      faces = $.map(counts, function(e, i){ if(e >= 1) return parseInt(i)});
 //      return faces;
	// }

	// function facesToNewRegion(faces){
	//   data = {faces: faces, pca1: [0, 1, 0], pca2: [1, 0, 0], pca3: [0, 0, 1], neighbors_computed: false};
	//   var r = new Region(stl, data);
	//   stl.regions.push(r);
	//   r.highlight(true);
	// }

	// function toFaces(p){ 
	//   return $.map(stl.object.geometry.faces, function(e, i){ if(e.a == p || e.b == p || e.c == p) return i; })
	// }


}