

function STLGenerator(env, init_mag, init_img){
	this.shaderMaterial;

	this.env = env;
	this.directory = "/heightmap/images/";
	this.filename = "corn.stl";
	this.shaderMaterial =  materials[init_img];

	// dat.gui parameters --> need to caught in the update function
	this.soft_engine = false;
	this.magnitude = init_mag;
	
	//add obj to the env
	this.obj = this.init(200, 200, 100.0); // Setup the plane
	this.obj.mesh.geometry.original = clone_vec_array(this.obj.mesh.geometry.vertices); //Keep the original geometry


	// begin the render loop
	this.update("soft_engine");
	var self = this;
	this.save = function(){
		var name = this.get_name();
		self.export(name + ".stl");
	}
}


STLGenerator.prototype = {
	get_name: function(){
		return this.filename.split('.')[0];
	},
	// Initializes a plane, calculates UV coordinates
	init: function(h, w, resolution){
		var w_seg_size = w / resolution;
		var h_seg_size = h / resolution;

		var seg_size =  Math.min(w_seg_size, h_seg_size);

		var w_segments = parseInt(w/seg_size);
		var h_segments = parseInt(h/seg_size);

		pb = new PlaneBox(h, w, 2, h_segments, w_segments, 1, STLGenerator.lambertMaterial);
		pb.mesh.rotation.x = -Math.PI / 2;
		pb.mesh.rotation.z = -Math.PI;
		pb.mesh.position.y = -100;
		this.env.scene.add(pb.mesh);
		return pb;	
	},
	// U/V coordinates, scales to the absolute depth. Stores new vertices in a temporary data structure which toggleTexture Engine uses to reduce render time.
	map: function(img){
		this.filename = img;
		this.depth_map = undefined; //remove cache
		this.shaderMaterial =  materials[img]; // generates a material and passes back uniforms		
		this.update("soft_engine");
	}, 
	update: function (param) {
		if(param == "soft_engine"){
			if(typeof this.shaderMaterial === "undefined") return;

		
			if(this[param]){
				// UPDATE GPU ENGINE
				this.obj.mesh.geometry.vertices = clone_vec_array(this.obj.mesh.geometry.original);
				this.obj.mesh.geometry.verticesNeedUpdate = true;
				this.obj.mesh.material = this.shaderMaterial;

			} else{
				// UPDATE PHYSICAL/CPU ENGINE
				this.obj.mesh.material = this.shaderMaterial;
				var self = this;
				if(typeof this.depth_map === "undefined"){
					console.log(this.magnitude);
					console.log("Retrieving", this.filename);
					this.depth_map = storage.cache(this.filename, function(){ 
						return STLGenerator.cacheDepthMap(self.shaderMaterial, self.obj)
					}, function(val){
						return $.map(val, function(val, i){
							return new THREE.Vector3(val.x, val.y, val.z);
						});
					});
				}

				this.obj.mesh.material = STLGenerator.lambertMaterial;
				this.raise(this.magnitude/250.0);
				this.obj.mesh.geometry.verticesNeedUpdate = true;
				this.obj.mesh.geometry.computeFaceNormals();
				this.obj.mesh.geometry.computeVertexNormals();
				this.obj.mesh.geometry.computeTangents();
				this.obj.mesh.geometry.computeMorphNormals();
			}
			
		}
		else if(param == "magnitude"){
			if(this.soft_engine){
				// UPDATE THE GPU ENGINE
				this.shaderMaterial.uniforms.bumpScale.value = this.magnitude;
				// this.obj.mesh.geometry.verticesNeedUpdate = true;
			}
			else{
				// UPDATE THE PHYSICAL/CPU ENGINE
				var self = this;
				if(typeof this.depth_map === "undefined")
					this.depth_map = storage.cache(this.image, function(){ 
						return STLGenerator.cacheDepthMap(self.shaderMaterial, self.obj)
					}, function(val){
						return $.map(val, function(val, i){
							return new THREE.Vector3(val.x, val.y, val.z);
						});
					});
				this.raise(this.magnitude/250.0);
				this.obj.mesh.geometry.verticesNeedUpdate = true;
			}
		}
	},
	raise: function( magnitude ){

		if( typeof this.depth_map  === "undefined") return;

		var geometry = this.obj.mesh.geometry;
		var vertices = clone_vec_array(this.obj.mesh.geometry.original);
		var depth_map = STLGenerator.adjustDepthMap(this.depth_map, magnitude);
	    
	    // for(var vertexID in depth_map) //&& applyToTop
	    // 	vertices[vertexID].add(depth_map[vertexID]);

	    this.obj.applyToTop(function(vertex, id){
	    	vertex.add(depth_map[id]);
	    }, vertices);

    	this.obj.mesh.geometry.vertices = vertices;
    	// changes to the vertices
		// changes to the normals
		model.obj.mesh.geometry.normalsNeedUpdate = true;
		this.obj.mesh.geometry.computeFaceNormals();
		this.obj.mesh.geometry.computeVertexNormals();
	} ,
	export: function(filename){
	    AsciiStlWriter.save(model.obj.mesh.geometry, filename);
	} ,
	test: function(){
		this.obj.mesh.geometry.computeFaceNormals();
		this.obj.mesh.geometry.computeVertexNormals();
	}
}

STLGenerator.adjustDepthMap = function(depthMap, magnitude){
	var new_depth = []
	for(var i in depthMap)
		new_depth[i] = depthMap[i].clone().multiplyScalar(magnitude);
	return new_depth;
}

STLGenerator.cacheDepthMap = function(shaderMaterial, obj){
	console.log("caching");
	console.log(shaderMaterial);

	if( typeof shaderMaterial  === "undefined") return;
	// vertexID ==> normal * grayImagePixel 
	depthMap = [];

		var geometry = obj.mesh.geometry;
		var vertices = clone_vec_array(obj.mesh.geometry.original);
	    var faces = geometry.faces;
	    var texture = shaderMaterial.uniforms.bumpTexture.value;
	      

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

STLGenerator.makeShaderTexture = function(url, magnitude, ready){
	var bumpTexture = new THREE.ImageUtils.loadTexture(url, THREE.UVMapping, function(){
		console.log("Successfully loaded!");
		ready();
	});
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// bumpTexture.wrapS = bumpTexture.wrapT = THREE.ClampToEdgeWrapping; 
	// bumpTexture.minFilter = THREE.LinearFilter;
	bumpTexture.update();
	var bumpScale   = magnitude;		
	var customUniforms = {
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpScale:	    { type: "f", value: bumpScale },
	};

	var phongShader = THREE.ShaderLib.phong;
	var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
	uniforms.bumpTexture = { type: "t", value: bumpTexture };
	uniforms.bumpScale = { type: "f", value: bumpScale };
	
	return new THREE.ShaderMaterial({
		    uniforms: uniforms,
			vertexShader:  phongShader.vertexShader, //document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: phongShader.fragmentShader, //document.getElementById( 'fragmentShader' ).textContent,
		  	lights:true,
    		fog: true,
			side: THREE.DoubleSide
		});
}






STLGenerator.lambertMaterial = new THREE.MeshLambertMaterial({
						        ambient: new THREE.Color( 0xff0000 ),
						        color: new THREE.Color( 0xffffff ),
						        specular: new THREE.Color( 0x00ff00 ),
						        // emissive: new THREE.Color( 0x0000ff ),
						        side: THREE.DoubleSide,
						        shininess: 0
						      });