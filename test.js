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
	
	var light = new Three.PointLight(0x444444);
	light.position = camera.position;
	scene.add(light);
	
	var model = null, skins = [], loader = new Three.ColladaLoader();
	loader.load('export.dae', function (collada) {
		model = collada.scene;
		skins = collada.skins;
		collada.scene.rotation.x = Math.PI;
		scene.add(collada.scene);
	});
	
	function morph(skin, percent) {
		var influences = skin.morphTargetInfluences;
		var influencesCount = influences.length;
		for (var t = 0; t < influencesCount; ++ t) influences[t] = 0;
		influences[Math.floor(percent * influencesCount)] = 1;
	}
	
	var frame = 0, speed = 1/30;
	(function animate() {
		for (var t = 0, T = skins.length; t < T; ++t)
			morph(skins[t], frame);
		frame = (frame + speed) % 1;
		window.requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}());
	
	window.onload = function () { window.onresize(); document.body.appendChild(renderer.domElement); };
	window.onresize = function () { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); };
	
})(THREE);
