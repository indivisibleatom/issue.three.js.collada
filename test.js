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

	var light = new Three.AmbientLight(0xdddddd);
	light.position = camera.position;
	scene.add(light);

	var animations = [];

	new Three.ColladaLoader().load('export.dae', function (collada) {
		collada.scene.rotation.x = Math.PI;

		// Fix materials
		0 && Three.SceneUtils.traverseHierarchy(collada.scene, function (node) {
			var material;
			if ((material = node.material)) {
				node.material = new Three.MeshBasicMaterial({
					map: material.map, morphTargets: material.morphTargets
				});
			}
		});

		// Set animations
		var animationHandler = Three.AnimationHandler;
		collada.animations.forEach(function (animationData) {
			animationHandler.add(animationData);

			var animation = new Three.KeyFrameAnimation(animationData.node, animationData.name);
			animation.timeScale = 1;
			animation.play(false, 0);
			animations.push(animation);
		});

		scene.add(collada.scene);
	});

	var clock = new Three.Clock();
	(function animate() {
		window.requestAnimationFrame(animate);
		var delta = clock.getDelta();
		animations.forEach(function (a) { a.update(delta); });
		renderer.render(scene, camera);
	}());

	window.onload = function () { window.onresize(); document.body.appendChild(renderer.domElement); };
	window.onresize = function () { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); };

})(THREE);
