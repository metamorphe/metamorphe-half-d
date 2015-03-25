function Ruler(){
}
Ruler.pts2in = function(v){
	return parseFloat(v)/72;
}
Ruler.pts2mm = function(v){
	return parseFloat(v)/2.83464567;
}
Ruler.mm2pts = function(v){
	return 2.83464567 * parseFloat(v);
}
Ruler.in2pts = function(v){
	return parseFloat(v) * 72;
}


function TextureGenerator(config){
	this.config = config;
	var self = this;
	this.load($('#flui-generator'));
	

	// this.set_path(config.svg_path.url, function(){
	// 	if(self.config.mode == "LaserCut-Ready") self.cut_print();
	// 	else self.pretty_print();
 //    });
}
TextureGenerator.CUT_STYLE = function(fill){
	return {
			    strokeColor: 'red',
			    closed: true, 
			    fillColor: fill,
			    strokeWidth: 0.5
		}
}
TextureGenerator.PRETTY_STYLE = function(fill, outer){
	return {
			    strokeColor: 'black',
			    strokeWidth: outer ? 5 : 1,
			    closed: true, 
			    fillColor: fill
		}
}
TextureGenerator.prototype = {
	load: function(c){
		// this.adjust();
		this.canvas = DOM.tag("canvas")
				.prop('resize', true)
				.height(c.height())
				.width(c.width());

		c.append(this.canvas);	

		this.paper = new paper.PaperScope();
		this.paper.setup(this.canvas[0]);
		
		this.height = this.paper.view.size.height;
		this.width = this.paper.view.size.width;
		this.paper.view.zoom = 0.3;



		// TEMPLATE BOLT
		var isHexy = false;
		var shape = isHexy ? "hex" : "circle";
		var type = shape;
		var template = TextureGenerator.bolt(this.paper, 0, 0, 3, type);

		var position = new paper.Point(100, 100);


		template.position = position;
		var myCircle = new paper.Path.Circle(new paper.Point(100, 70), 50);
		myCircle.fillColor = 'black';

		return this;
	},
	adjust: function(){
		conversion = this.config.unit == "mm" ? Ruler.mm2pts : Ruler.in2pts;
		this.config.bold_d = conversion(this.config.bold_d);
		this.config.trim_w = conversion(this.config.trim_w);
		this.config.spacing = conversion(this.config.spacing);
	},
	export: function(){
		var prev = this.paper.view.zoom;
		this.paper.view.zoom = 1;
		if(this.config.mode == "LaserCut-Ready")
		$.each(factory.paper.project.activeLayer.children, function(i, v){ console.log(v.style.strokeWidth); v.style.strokeWidth=0.001;});
		
		var svg = this.paper.project.exportSVG({asString: true});
		this.paper.view.zoom = prev;

		if(this.config.mode == "LaserCut-Ready")
		$.each(factory.paper.project.activeLayer.children, function(i, v){ console.log(v.style.strokeWidth); v.style.strokeWidth=0.5;});
		return svg;
	},
	
	set_path: function(filename, ready){
		// console.log('Loading path', filename);
		var self = this;
		$('#svg-loader').load(filename, function(){
			console.log('Loading path', filename);
			var loader = paper.project.importSVG($('svg')[0]);

			self.path = loader.bringToFront().children[0];
			if(self.config.mode == "LaserCut-Ready") water = TextureGenerator.CUT_STYLE("#FFFFFF");
			else water = TextureGenerator.PRETTY_STYLE("#00A8E1", false);
			
			self.path.style = water; 
			self.path.bringToFront();



			self.path.onFrame = function(event) {
				var b = self.boundary.bounds;
				if(self.config.unit == "mm")
					var s = "w: " + Ruler.pts2mm(b.width).toFixed(2) + self.config.unit + ", " + "h: " + Ruler.pts2mm(b.height).toFixed(2) + " " + self.config.unit + ", n=" + self.num_of_bolts; 
				else if(self.config.unit == "in")
					var s = "w: " + Ruler.pts2in(b.width).toFixed(2) + self.config.unit + ", " + "h: " + Ruler.pts2in(b.height).toFixed(2) + " " + self.config.unit + ", n=" + self.num_of_bolts; 
				$('#dimensions').html(s);
			}
			// console.log(self.num_of_bolts);
			ready();
		});
	},
	expand_path: function(path, direction, length, style, fill){
		// HOLE PATH
		var pts = [];
		for(var i = 0; i < path.length; i += 5){
			var pt = path.getLocationAt(i).point;
		    if(i-1 > 0) var normal_a = path.getNormalAt(i-1);
			else var normal_a = path.getNormalAt(path.length);
			if(i + 1 >= path.length) var normal_b = path.getNormalAt(1);
			else var normal_b = path.getNormalAt(i+1);
			normal_c = normal_a.add(normal_b);
			normal_c.length = length  * direction;
			pts.push(pt.add(normal_c));
		}
		style.segments = pts;
		var new_path = new this.paper.Path(style).sendToBack();
		return new_path;
	},
	trim_draw: function(path, trim_width, inside, ex1, ex2, ex3){
		var direction = path.clockwise ? 1 : -1;
		if(inside) direction = direction * -1;
		
		var backing;
		if(this.config.mode == "LaserCut-Ready") backing = TextureGenerator.CUT_STYLE("#FFFFFF");
		else backing = TextureGenerator.PRETTY_STYLE("#885B35", true);

		// ADD OUTSIDE PATH
		var boundary = this.expand_path(path, direction, trim_width, backing);
		var temp = boundary.clone();
		var clean_boundary = temp.intersect(boundary).sendToBack();
		boundary.remove();
		temp.remove();
		this.boundary = clean_boundary;
		return clean_boundary;
	},
	bolt_draw: function(path, trim_width, inside, bolt_width, min_spacing, type){
		var backing;
		if(this.config.mode == "LaserCut-Ready") backing = TextureGenerator.CUT_STYLE("#FFFFFF");
		else backing = TextureGenerator.PRETTY_STYLE("#885B35", true);
		var group = new this.paper.Group();

		var direction = path.clockwise ? 1 : -1;
		if(inside) direction = direction * -1;
		console.log(this);
		var layer = this.trim_draw(path, trim_width, inside);
		layer.position = path.position;
		// HOLE_GENERATOR
		var h_path = this.expand_path(path, direction, trim_width/2, backing );

		// CALCULATE BOLT SPACING
		var n = Math.floor(h_path.length / (bolt_width + min_spacing));
		var spacing = (h_path.length / n) - bolt_width;
		this.num_of_bolts = n;
		
		// TEMPLATE BOLT
		var template = TextureGenerator.bolt(this.paper, 0, 0, bolt_width, type);
		var copy = template;
		
		for(var i = 0; i < h_path.length; i += (spacing + bolt_width)){
			if(i-1 > 0) var normal_a = h_path.getNormalAt(i-1);
			else var normal_a = h_path.getNormalAt(h_path.length);
			
			if(i + 1 >= h_path.length) var normal_b = h_path.getNormalAt(1);
			else var normal_b = h_path.getNormalAt(i+1);

			var normal_c = normal_a.add(normal_b);
			normal_c.length = 0;

			var pt = h_path.getLocationAt(i).point;

			final_pt = pt.add(normal_c);
			copy.position = final_pt;
			group.addChild(copy);
			copy = template.clone();
		}
		group.position = path.position;

		h_path.remove();

		return {layer: layer, holes: this.group}

	},
	pretty_print: function(){

		var flui = this.path.translate(new this.paper.Point(0, 0));
			this.flui = this.flui_print(flui, false, true, false);
			this.paper.view.zoom = 0.60;
	},

	cut_print: function(){
		var spacing = { x: 15 + 2 * this.config.trim_w + this.path.bounds.width, y: 15 + 2 * this.config.trim_w + this.path.bounds.height};

		this.path.position = new paper.Point(0, 0);
		

		var temp = this.path;

		var load_ring = temp.clone().translate(new paper.Point(0, 100));
			this.load_ring = this.flui_print(load_ring, false, true, false);

		var flex = load_ring.clone().translate(new paper.Point(spacing.x, 0));
			this.flui_print(flex, true, true, false);
			
		var nut_plate = flex.clone().translate(new paper.Point(spacing.x, 0));	
			this.flui_print(nut_plate, false, true, true);



		this.path.remove();

	}, 
	flui_print: function(base_path, isSolid, isHoly, isHexy){
		var draw; 
		var layer;
		if(isHoly) this.draw = this.bolt_draw;
		else this.draw = this.trim_draw;

		var shape = isHexy ? "hex" : "circle";

		if(typeof base_path.children !== "undefined")
			for(var i in base_path.children){
      			if(i == 0) layer = this.draw(base_path.children[i], this.config.trim_w, false, this.config.bold_d, this.config.spacing, shape);
      			else layer = this.draw(base_path.children[i], this.config.trim_w, true, this.config.bold_d, this.config.spacing, shape);
      		}
      	else
      		layer = this.draw(base_path, this.config.trim_w, false,  this.config.bold_d, this.config.spacing, shape);
      	
      	if(isSolid) base_path.remove();
      	return layer;
	},
}

TextureGenerator.bolt = function(paper, x, y, size, type){
	style = TextureGenerator.CUT_STYLE("#FFFFFF", false);

	var boltCircle;
	if(type == "circle") boltCircle = new paper.Path.Circle(new paper.Point(x, y), size/2);
	else boltCircle =  new paper.Path.RegularPolygon(new paper.Point(x, y), 6, size);
	
	boltCircle.style = style;
	return boltCircle;
}
