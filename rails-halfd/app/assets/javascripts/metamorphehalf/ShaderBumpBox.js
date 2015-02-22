
function ShaderBumpBox(url, mag){
	this.url = url; 
	this.mag = mag;
}
ShaderBumpBox.prototype = {
	load: function(callbackFN){
		var self = this;
		BumpBox.loadTexture(this.url, function(texture){
			var shaderMaterial = ShaderBumpBox.makeShaderTexture(texture, self.mag);
			self.obj = BumpBox.make(70, 70, 100.0, shaderMaterial);
			callbackFN(self);
		});
	}, 
	raise: function(mag){
		this.mag = mag;
		this.obj.material.uniforms.bumpScale.value = this.mag;
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
	
	return new THREE.ShaderMaterial({
		    uniforms: uniforms,
			vertexShader:  phongShader.vertexShader, //document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: phongShader.fragmentShader, //document.getElementById( 'fragmentShader' ).textContent,
		  	lights: true,
    		fog: true,
			side: THREE.DoubleSide
		});
}


