// under
	var boxGeo = new THREE.BoxGeometry(1000, 20, 1000, 100, 100, 1);
	boxU = new THREE.Mesh(boxGeo, STLGenerator.lambertMaterial);
	boxU.position.y = -100;
	
	// top
	var boxGeo = new THREE.BoxGeometry(1000, 200, 20, 1, 1, 1);
	boxT = new THREE.Mesh(boxGeo, STLGenerator.lambertMaterial);
	boxT.position.y = -10;
	boxT.position.z = -500;
	
	// bottom
	var boxGeo = new THREE.BoxGeometry(1000, 200, 20, 1, 1, 1);
	boxB = new THREE.Mesh(boxGeo, STLGenerator.lambertMaterial);
	boxB.position.y = -10;
	boxB.position.z = 500;
	
	// right
	var boxGeo = new THREE.BoxGeometry(20, 200, 1020, 1, 1, 1);
	boxR = new THREE.Mesh(boxGeo, STLGenerator.lambertMaterial);
	boxR.position.y = -10;
	boxR.position.x = 500;
	

	// left
	var boxGeo = new THREE.BoxGeometry(20, 200, 1020, 1, 1, 1);
	boxL = new THREE.Mesh(boxGeo, STLGenerator.lambertMaterial);
	boxL.position.y = -10;
	boxL.position.x = -500;
	
	var borders = [boxB, boxR, boxU, boxL, boxT]
	var totalGeom = new THREE.Geometry()

	for(var i in borders){
		var border = borders[i];
		border.updateMatrix();
		totalGeom.merge(border.geometry, border.matrix);
	}

	var border = new THREE.Mesh(totalGeom, STLGenerator.lambertMaterial);
	this.env.scene.add(border);