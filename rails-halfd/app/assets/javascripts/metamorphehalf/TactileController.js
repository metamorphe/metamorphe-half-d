function TactileController(){
	this.texture = GET().texture || "corn";
	this.engine = GET().engine || "shade";
	this.current_model;
	this.magnitude = GET().mag || 5.0;
	this.loaded = {};
	this.env = new WebEnv($("#ThreeJS"));
	this.preview;
	this.base_height = GET().bh || 2;
	this.width = GET().w || 70;
	this.height = GET().h || 70;
	this.resolution = GET().r || 150;
}


TactileController.prototype = {
	init: function(){
		var self = this;
		this.load();
		this.preview = new ImagePreview(this.env.container, textureMap[this.texture]);
		this.dim = new DimensionsPreview(this.env.container);

	},
	load:function(){
		console.log("Loading", this.texture, "on", this.engine);
		var self = this;

		var model = this.loaded[this.texture];
		if(typeof model === "undefined") model = new TactileModel(textureMap[this.texture], 
			this.width, this.height, this.base_height, this.resolution, self.magnitude);
		model.load(this.engine, this.add, self);
	},
	bh_adj: function(){
		var self = this;
		var model = new TactileModel(textureMap[this.texture], 
			this.width, this.height, this.base_height, this.resolution, self.magnitude);
		model.load(this.engine, this.add, self);
	},
	add: function(tc, model){
		console.log("Added " + model.name);
		tc.clear();
		tc.current_model = model;
		tc.env.scene.add(tc.current_model[tc.engine].obj.mesh);
		tc.preview.swap(textureMap[tc.texture]);
		tc.mag();
		if(tc.engine == "bump"){
			alert.hide();
			tc.update_dim();
		}
		hist = generateURL();
		history.pushState({}, hist.title, hist.href);

	}, 
	switch: function(){
		console.log("Switching to", textureMap[this.texture]);
		var self = this;
		UIAlert.sync(function(){
			if(self.engine == "shade")
				alert.flash("Switching to: " + textureMap[self.texture], 1500);
			if(this.engine == "bump")
				alert.notice("Calculating " + self.texture +  " model ...");
			}, function(){
				self.load();
			});
	},
	mag: function(){
		this.current_model.mag(this.engine, this.magnitude);
		this.update_dim();
	},
	update_dim: function(){
		if(this.engine == "bump"){
			var dimensions =  this.current_model.bump.dimensions();
			this.dim.set(dimensions.x, dimensions.y, dimensions.z);
		}
	},
	clear: function(){
		console.log("Clearing the stage.");
		if(typeof this.current_model === "undefined") return; 
		if(typeof this.current_model.bump.obj !== "undefined")
			this.env.scene.remove(this.current_model.bump.obj.mesh);
		if(typeof this.current_model.shade.obj !== "undefined")
			this.env.scene.remove(this.current_model.shade.obj.mesh);
		console.log("Cleared the stage.");
	}, 
	save: function(){
		// TODO: trigger change with controller
		// this.engine = "bump";
		// tc.switch();
		var self = this;
		this.current_model.save(this.texture);
		alert.flash("Model saved!", 1000);
	}, 
	clear_cache: function(){
		storage.clear();
		alert.flash("Cleared cache", 1000);
	}, 
	clear_self: function(){
		storage.remove(this.current_model.name);
		alert.flash("Cleared self from cache", 1000);
	}
}