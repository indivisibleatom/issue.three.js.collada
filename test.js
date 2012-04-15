(function (Three) {
	
	var renderer = new Three.WebGLRenderer();
	renderer.domElement.style.background = '#888';
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.left = 0;
	renderer.domElement.style.top = 0;
	
	var scene = new Three.Scene();
	scene.add(new Three.AxisHelper());
	
	var camera = new Three.PerspectiveCamera(60, 1, .1, 10000);
	camera.position.x = camera.position.y = camera.position.z = 1000;
	camera.lookAt(new Three.Vector3(0, 0, 0));
	scene.add(camera);
	
	/* // Add a '/' at the start of this line to switch activated blocks
	    var loader = new Three.JSONLoader();
	    loader.load('export.js', function (geometry) {
			var mesh = new Three.Mesh(geometry, new Three.MeshBasicMaterial({ color : 0xffffff }));
			scene.add(mesh);
		});
	/*/
	    var loader = new Three.ColladaLoader();
	    loader.convertUpAxis = true;
	    loader.load('export.dae', function (collada) {
			scene.add(collada.scene);
		});
	//*/
	
	(function animate() {
		window.requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}());
	
	window.onload = function () { window.onresize(); document.body.appendChild(renderer.domElement); };
	window.onresize = function () { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); };
	
})(THREE);
