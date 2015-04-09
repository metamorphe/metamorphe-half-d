// bumpmapper.js
var tc, storage, alert, depthWorker, textureNames, textureMap;

function TactileEnvironment(){
	storage = new WebStorage();
	tc = new TactileController();
	textureNames = $.map(TactileController.textures, function(el, i){
			var path_tokens = el.split('/');
			return path_tokens[path_tokens.length - 1].split(".")[0];
		});
	textureMap = {};
	alert = new UIAlert(tc.env.container);
	TactileEnvironment.configureGUI(tc);
	tc.init();
}

TactileEnvironment.configureGUI = function(tc){
	$.each(TactileController.textures, function(i, el){
			var path_tokens = el.split('/');
			var name = path_tokens[path_tokens.length - 1].split(".")[0];
			textureMap[name] = el;
	});

	var gui = new dat.GUI();

	var texture = gui.add(tc, 'texture', textureNames);

	texture.onChange(function(){
		tc.switch();
		// model.map(model.filename);
		// img_preview.swap(model.directory + model.filename);
	});

	var engineController = gui.add(tc, 'engine', ["shade", "bump"]);
	engineController.onChange(function(){ tc.switch(); });

	var magnitudeController = gui.add(tc, 'magnitude', 0, 10);
	var bhController = gui.add(tc, 'base_height', 0.01, 10);
	magnitudeController.onChange(function(){ tc.mag(); });

	bhController.onFinishChange(function(){
		tc.bh_adj();
	});
	var clear_cache = gui.add(tc, 'clear_cache');
	var clear_cache = gui.add(tc, 'clear_self');
	// export
	var exporter = gui.add(tc, 'save');

}


function workPackage(texture, geom){
	this.pixels = Filters.filterImage(Filters.grayscale, texture.image);
	this.faces = geom.faces;
	this.faceVertexUvs = geom.faceVertexUvs;
}