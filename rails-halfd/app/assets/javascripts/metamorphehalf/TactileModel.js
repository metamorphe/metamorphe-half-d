
function TactileModel(texture, h, w, d, resolution, mag, shape){
	this.name = texture;
	this.path = textureMap[texture];
	this.shape = shape;
	this.shade = new ShaderBumpBox(texture, mag, h, w, d, resolution, shape);   
	this.bump = new LambertBumpBox(texture, mag,  h, w, d, resolution, shape);
}

TactileModel.prototype = {
	load: function(engine, fn, tc){
		// load routine for model
		var self = this;
		this[engine].load(function(){
			console.log("Passing back", engine, self.name);	
			fn(tc, self);
		});
	}, 
	mag: function(engine, mag){
		// this[engine].position.x = mag;
		this[engine].raise(mag);
	},
	save: function(name){
		console.log("Saved!");
		this.bump.save(name);
	}
}
