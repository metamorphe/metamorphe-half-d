// OBJECTIZED - THREEJS WEBGL SETUP
// Pass the jquery DOM element that holds the scene. 

var lambertMaterial = new THREE.MeshPhongMaterial({
						        // light
						        // specular: '#a9fcff',
						        // intermediate
						        // color: '#00abb1',
						        ambient: new THREE.Color( 0xffffff ),
						        // dark
						        specular: new THREE.Color( 0x111111 ),
						        emissive: new THREE.Color( 0x000000 ),
						        side: THREE.DoubleSide,
						        shininess: 30
						      });



function WebEnv(dom){
	this.container, this.scene, this.camera, this.renderer, this.controls, this.stats;
	this.keyboard = new KeyboardState();
	this.clock = new THREE.Clock();
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
		this.scene.overrideMaterial = new THREE.MeshDepthMaterial();
		// CAMERA
		var SCREEN_WIDTH = $(".threejs_container").width(), SCREEN_HEIGHT = $(window).height();
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000000;
		//NEAR = 50, FAR = 130;//FAR = 200000;
		 

        // create a camera, which defines where we're looking at.
        // var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);

		this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		// this.camera = new THREE.OrthographicCamera( - ASPECT * VIEW_SIZE / 2,  ASPECT * VIEW_SIZE / 2,  VIEW_SIZE / 2,  -VIEW_SIZE / 2, -1000, 1000);
		this.scene.add(this.camera);
		this.camera.position.set(0, 50, -100);
		this.camera.lookAt(this.scene.position);	
		
		// RENDERER
		if ( Detector.webgl ) this.renderer = new THREE.WebGLRenderer( {
			antialias: true,
			logarithmicDepthBuffer: true
		});
		else  this.renderer = new THREE.CanvasRenderer(); 
		this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		container.appendChild( this.renderer.domElement );
		
		// EVENTS
		THREEx.WindowResize(this.renderer, this.camera);
		THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
		
		// CONTROLS
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );


		// FULLSCREEN
		$(window).resize(function(){
			console.log("Resized!");
			// THREEx.WindowResize(this.renderer, this.camera);
		});
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
		// var light = new THREE.PointLight(0xffffff);
		// light.position.set(1000,1000,1000);
		// this.scene.add(light);

		// var light = new THREE.PointLight(0xffffff);
		// light.position.set(0, 100, -340);
		// this.scene.add(light);

		var directionalLight = new THREE.DirectionalLight(0xFFFFFF);
      	 directionalLight.position.set(1, 1, 1).normalize();
      	this.scene.add(directionalLight);

		// SKYBOX
		var skyBoxGeometry = new THREE.CubeGeometry( 200000, 200000, 100000 );
		var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
		var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
		this.scene.add(skyBox);
	}
}

function addStats(container){
	// STATS
	var stats = new Stats();
	stats.domElement.style.position = 'relative';
	stats.domElement.style.top = '-55px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.zIndex = 100;
	$(stats.domElement).css("position", "absolute");
	container.appendChild( stats.domElement );
	return stats;
}
