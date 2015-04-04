
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
		this.obj.mesh.material.bumpScale = this.mag;
	}
}


ShaderBumpBox.makeShaderTexture = function(texture, magnitude){
	var bumpTexture = texture;
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// bumpTexture.wrapS = bumpTexture.wrapT = THREE.ClampToEdgeWrapping; 
	bumpTexture.minFilter = THREE.LinearFilter;

	var bumpScale   = magnitude;		
	var phongShader = THREE.ShaderLib.lambert;

	return new THREE.MeshPhongMaterial({
		 	ambient: new THREE.Color( 0xff0000 ),
			map: bumpTexture,
			bumpMap: bumpTexture,
			bumpScale: 3,
		  	lights: true,
    		fog: true,
			side: THREE.DoubleSide,
			ambient: new THREE.Color( 0xff0000 ),
	        color: new THREE.Color( 0xffffff ),
	        specular: new THREE.Color( 0x00ff00 ),
	        shininess: 0

		});
}


