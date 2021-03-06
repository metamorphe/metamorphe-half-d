	var xlineMaterial = new THREE.LineBasicMaterial({
        color: 0xff1111, 
        linewidth: 5
    });

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1111ff, 
        linewidth: 5
    });
   
    var zlineMaterial = new THREE.LineBasicMaterial({
        color: 0x11ff11, 
        linewidth: 5
    });

	  
	var point_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	

function HapticPrint(filepath, textureFile, magnitude){
	this.magnitude = magnitude;
	this.filepath = filepath;
	this.textureFile = textureFile;
	this.texture = null;
	this.stl = null;
	this.load();
}

HapticPrint.prototype = {
	update: function(){
		mag();
	},
	mag: function(){
		console.log("Setting to", this.magnitude);
		this.magnitude /= 250.0;
		
		var geometry = this.stl.geometry;
		var vertices = clone_vec_array(this.stl.geometry.original);
		var depth_map = LambertBumpBox.adjustDepthMap(this.depth_map, this.magnitude);
	    

		_.each(vertices, function(vertex, i, arr){
			vertex.add(depth_map[i]);
		});
		
    	this.stl.geometry.vertices = vertices;
		this.stl.geometry.verticesNeedUpdate = true;
    	this.stl.geometry.normalsNeedUpdate = true;
		this.stl.geometry.computeFaceNormals();
		this.stl.geometry.computeVertexNormals();
	},
	load: function(){

		// load stl
		var scope = this;
		var loader = new THREE.STLLoader();

		var line_mag = 1000;
		var geometry = new THREE.Geometry();
	    geometry.vertices.push(new THREE.Vector3(0, -1 * line_mag, 0));
	    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(0, line_mag, 0));
        var yline = new THREE.Line(geometry, lineMaterial);
        env.scene.add(yline);

        var geometry = new THREE.Geometry();
	    geometry.vertices.push(new THREE.Vector3(-1 * line_mag, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(line_mag, 0,  0));
        var xline = new THREE.Line(geometry, xlineMaterial);
        env.scene.add(xline);

        var geometry = new THREE.Geometry();
	    geometry.vertices.push(new THREE.Vector3(0, 0, -1 * line_mag));
	    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(0, 0, line_mag));
        var zline = new THREE.Line(geometry, zlineMaterial);
        env.scene.add(zline);
    

		loader.load( this.filepath, function ( bufferGeometry ) {
			var geometry = new THREE.Geometry().fromBufferGeometry( bufferGeometry );
			// var geometry = new THREE.BoxGeometry(30, 30, 30, 100, 100, 100);



			geometry.mergeVertices();
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();


			// SMOOTH
			var start = performance.now();
			var modifier = new THREE.SubdivisionModifier(1);
			modifier.modify( geometry );
			var end = performance.now();
			var time = (end - start)/1000;
			console.log('Catmull-Clark Total Execution time: ' + time.toFixed(2));
			// END SMOOTH


			geometry = assignUVsRevolve(geometry);
			geometry.computeBoundingBox();

			var dimensions = geometry.boundingBox.max.clone().sub(geometry.boundingBox.min);
			var min = geometry.boundingBox.min.clone().add(dimensions.multiplyScalar(0.5)).multiplyScalar(-1);
			centerMatrix = new THREE.Matrix4().makeTranslation(min.x, min.y, min.z);
			var mesh = new THREE.Mesh( geometry, lambertMaterial );
			
				mesh.updateMatrix(); 
				mesh.geometry.applyMatrix( centerMatrix );
				mesh.matrix.identity();
				mesh.geometry.verticesNeedUpdate = true;

				mesh.castShadow = true;
				mesh.receiveShadow = true;
			scope.stl = mesh;
			scope.stl.geometry.original = clone_vec_array(scope.stl.geometry.vertices); //Keep the original geometry
			scope.stl.material.wireframe = false;
			env.scene.add( mesh );
			dim.set(dimensions.x, dimensions.y, dimensions.z);


				// load texture
				var bumpTexture = new THREE.ImageUtils.loadTexture(scope.textureFile, THREE.UVMapping, function(texture){
					console.log("Successfully loaded texture!", scope.textureFile);
					scope.texture = texture;
					scope.texture.wrapS = scope.texture.wrapT = THREE.ClampToEdgeWrapping; 
					scope.texture.minFilter = THREE.LinearFilter;
					// UPDATE THE PHYSICAL/CPU ENGINE
					scope.depth_map = HapticPrint.getDepthMap(texture, scope.stl, scope);
					// scope.mag();
				});
		});
	},
	save: function(){
		console.log("Saving", this.filepath);
		var f = this.filepath.split('/');
		var name = f[f.length - 1].split('.')[0];
		var filename = "haptic" +  name + ".stl";
		console.log("Saving", filename);		
		AsciiStlWriter.save(this.stl.geometry, filename);
	}
}


var wp;

HapticPrint.getDepthMap = function(texture, stl, scope){
	console.log("Obtaining Depth Map");
	var start = performance.now();
	scope.wp = new workPackage(texture, stl.geometry);
	depth_map = extractDepthMap(scope.wp);

	var end = performance.now();
	var time = (end - start)/1000;
	console.log('Depth Map Total Execution time: ' + time.toFixed(2));
	return depth_map;
}

HapticPrint.adjustDepthMap = function(depthMap, magnitude){
	var new_depth = [];

	for(var i in depthMap){
		new_depth[i] = depthMap[i].clone().multiplyScalar(magnitude);
	}
	return new_depth;
}

assignUVsRevolve = function( geometry ){

    geometry.computeBoundingBox();

    max     = geometry.boundingBox.max;
    min     = geometry.boundingBox.min;
    

    var sphereGeom = new THREE.SphereGeometry( 3, 32, 32 );
	var originSphere = new THREE.Mesh( sphereGeom, point_material );
	env.scene.add( originSphere );
	
    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);


    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    var i_x = function(){ return new THREE.Vector3(1, 0, 0);}
    var i_y = function(){ return new THREE.Vector3(0, 1, 0);}
    var i_z = function(){ return new THREE.Vector3(0, 0, 1);}

    var angs = [];
    var uvs_arr = []
    for (i = 0; i < geometry.faces.length ; i++) {
      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      
      uvs = _.map([v1, v2, v3], function(el, i, arr){
      		var onPlane = el.clone().projectOnPlane(i_x());
      	// var onPlane = el.clone().projectOnPlane(i_x());
	      onPlane = onPlane.normalize();
	      var V_A = onPlane;
	      var V_B = i_y();
	      var V_N = i_x();

	      angle =  V_A.angleTo(V_B);
	      normal =  V_A.cross(V_B);
	      sign = Math.sign(V_N.dot(normal));
	      angle *= sign
	      angle += Math.PI;
	      angs.push(angle / (2 * Math.PI));
	      return angle / (2 * Math.PI);
	  });
      uvs_arr.push(uvs);
    }
    console.log("angs", _.min(angs), _.max(angs));

    ang_min = _.min(angs);
    ang_max = _.max(angs);
    ang_range = ang_max - ang_min;
    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      uvs = uvs_arr[i];
      v1_u = ( v1.x + offset.x ) / range.x;
      v2_u = ( v2.x + offset.x ) / range.x;
      v3_u = ( v3.x + offset.x ) / range.x;

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(  v1_u , (uvs[0] - ang_min) / ang_range ),
        new THREE.Vector2(  v2_u , (uvs[1] - ang_min) / ang_range ),
        new THREE.Vector2(  v3_u , (uvs[2] - ang_min) / ang_range )
      ]);

	// ( v1.y + offset.y ) / range.y
	// ( v2.y + offset.y ) / range.y
	// ( v3.y + offset.y ) / range.y
    }
    
    // console.log("angs", angs);

    geometry.uvsNeedUpdate = true;
    return geometry;
}

assignUVsXY = function( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.y + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.y + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;
    return geometry;
}
