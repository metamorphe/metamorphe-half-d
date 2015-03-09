	// importScripts('/assets/three.js');


	self.addEventListener('message', function(e) {
	var data = e.data;
	var wp = e.data.wp;
	self.postMessage(extractDepthMap(wp));  
	}, false);



	function extractDepthMap(wp){
		console.log("Extracting");
		console.log(wp.pixels);
		var height = wp.pixels.height;
		var width = wp.pixels.width;
		var pixels = wp.pixels;
		var faces = wp.faces;
		var faceVertexUvs = wp.faceVertexUvs;

		var start = new Date().getTime();

		depthMap = [];

		faces.forEach(function(face, i){
			var uv1 = faceVertexUvs[0][i][0];
			var pixel1 = getPixel(pixels, uv1, width, height);

			var uv2 = faceVertexUvs[0][i][1];
			var pixel2 = getPixel(pixels, uv2, width, height);	

			var uv3 = faceVertexUvs[0][i][2];
			var pixel3 = getPixel(pixels, uv3, width, height);

			var normal = face.normal;

			var a = { x: normal.x * pixel1, 
					y: normal.y * pixel1, 
					z: normal.z * pixel1
				};
			var b = { x: normal.x * pixel2, 
				y: normal.y * pixel2, 
				z: normal.z * pixel2
			};
			var c = { x: normal.x * pixel3, 
				y: normal.y * pixel3, 
				z: normal.z * pixel3
			};

			depthMap[faces[i].a] = a; 
			depthMap[faces[i].b] = b; 
			depthMap[faces[i].c] = c; 
		});

		var end = new Date().getTime();
		var time = end - start;
		console.log('Execution time: ' + time, depthMap.length);
		return depthMap;
	}

	function getPixel(pixels, uv, w, h){
		var u = uv.y;
		var v = uv.x;

		if(u < 0 || u > 1 || v < 0 || v > 1){
			var err = new Error("Invalid UV coordinates (" + u + ", " + v + ")");
			return err.stack;
		}

		var x = (h - 1) - Math.floor(u * 1.0 * h);
		var y = (w - 1) - Math.floor(v * 1.0 * w);

		var row = x * (w * 4); 
		var col = y * 4;
		var index = row + col;

		return pixels.data[index];
	}
