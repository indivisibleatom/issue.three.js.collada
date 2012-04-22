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
	
	var skins = [];
	
	new Three.ColladaLoader().load('export.dae', function (collada) {
		skins = collada.skins;
		
		collada.scene.rotation.x = Math.PI;
		
		Three.SceneUtils.traverseHierarchy(collada.scene, function (node) {
			var material;
			if ((material = node.material)) {
				node.material = new Three.MeshBasicMaterial({
					map: material.map, morphTargets: material.morphTargets
				});
			}
		});
		
		scene.add(collada.scene);
	});
	
	function morph(skin, frame) {
		var influences = skin.morphTargetInfluences;
		var influencesCount = influences.length;
		for (var t = 0; t < influencesCount; ++ t) influences[t] = 0;
		influences[Math.floor(frame) % influencesCount] = 1;
	}
	
	var frame = 0, fps = 15;
	var clock = new Three.Clock();
	(function animate() {
		var currentFrame = Math.floor(frame);
		for (var t = 0, T = skins.length; t < T; ++t)
			morph(skins[t], currentFrame);
		frame = frame + clock.getDelta() * fps;
		window.requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}());
	
	window.onload = function () { window.onresize(); document.body.appendChild(renderer.domElement); };
	window.onresize = function () { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); };
	
})(THREE);
