function WebEnv(dom){
	this.container, this.scene, this.camera, this.renderer, this.controls, this.stats;
	this.keyboard = new KeyboardState();
	this.clock = new THREE.Clock();
	this.mesh = undefined;
	this.init(dom);
	this.animate();
}

WebEnv.prototype = {
	init: function(dom){
		var containerDOM = dom[0];
		this.container = this.setup(containerDOM);	
		this.stats = addStats(this.container);
		this.background();
	}, 
	setup: function(container){
		this.scene = new THREE.Scene();
		
		// CAMERA
		var SCREEN_WIDTH = $(".container").width(), SCREEN_HEIGHT = $(window).height() - 150;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
		this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.scene.add(this.camera);
		this.camera.position.set(0,100,400);
		this.camera.lookAt(this.scene.position);	
		
		// RENDERER
		if ( Detector.webgl ) this.renderer = new THREE.WebGLRenderer( {antialias:true} );
		else  this.renderer = new THREE.CanvasRenderer(); 
		this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		container.appendChild( this.renderer.domElement );
		
		// EVENTS
		THREEx.WindowResize(this.renderer, this.camera);
		THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
		
		// CONTROLS
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		return container;
	},
	animate: function()	{
	  	var self = this;
	    requestAnimationFrame( function(){ self.animate()} );
		this.render();		
		this.update();
	}, 
	update: function(){
		if ( this.keyboard.pressed("z") ){	  
		}		
		this.controls.update();
		this.stats.update();
	}, 
	render: function()	{
		this.renderer.render( this.scene, this.camera );
	}, 
	background: function(){	
		// LIGHT
		var light = new THREE.PointLight(0xffffff);
		light.position.set(100,250,100);
		this.scene.add(light);

		// SKYBOX
		var skyBoxGeometry = new THREE.CubeGeometry( 20000, 20000, 10000 );
		var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
		var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
		this.scene.add(skyBox);
		
	}
}