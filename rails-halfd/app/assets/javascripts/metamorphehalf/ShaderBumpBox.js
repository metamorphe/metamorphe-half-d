
function ShaderBumpBox(url, mag,  h, w, d, resolution){
	this.url = url; 
	this.mag = mag;
	this.h = h; 
	this.w = w; 
	this.d = d; 
	this.resolution = resolution;
}
ShaderBumpBox.prototype = {
	load: function(callbackFN){
		var self = this;
		BumpBox.loadTexture(this.url, function(texture){
			var shaderMaterial = ShaderBumpBox.makeShaderTexture(texture, self.mag);
			self.obj = BumpBox.make(self.w, self.h, self.d, self.resolution, shaderMaterial);
			callbackFN(self);
		});
	}, 
	raise: function(mag){
		this.mag = mag;
		// this.obj.material.uniforms.bumpScale.value = this.mag;
	}
}


ShaderBumpBox.makeShaderTexture = function(texture, magnitude){
	var bumpTexture = texture;
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// bumpTexture.wrapS = bumpTexture.wrapT = THREE.ClampToEdgeWrapping; 
	// bumpTexture.minFilter = THREE.LinearFilter;

	var bumpScale   = magnitude;		
	var customUniforms = {
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpScale:	    { type: "f", value: bumpScale },
	};

	var phongShader = THREE.ShaderLib.phong;
	var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
	uniforms.bumpTexture = { type: "t", value: bumpTexture };
	uniforms.bumpScale = { type: "f", value: bumpScale };
	console.log("Generating..");
	return new THREE.MeshLambertMaterial({
			map: bumpTexture,
			bumpMap: bumpTexture,
			bumpScale: magnitude,
			ambient: new THREE.Color( 0xff0000 ),
	        color: new THREE.Color( 0xffffff ),
	        specular: new THREE.Color( 0x00ff00 ),
	        // emissive: new THREE.Color( 0x0000ff ),
	        side: THREE.DoubleSide,
	        shininess: 0,
		    uniforms: uniforms,
			// vertexShader:  phongShader.vertexShader, //document.getElementById( 'vertexShader' ).textContent,
			// fragmentShader: phongShader.fragmentShader, //document.getElementById( 'fragmentShader' ).textContent,
		  	lights: true,
    		fog: true,
			side: THREE.DoubleSide
		});
}


