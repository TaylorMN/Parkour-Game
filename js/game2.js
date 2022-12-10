//const { Vector3 } = require("@babylonjs/core/Maths/math");

const createScene = () => {
    const keys = {
        jump: 0,
        left: 0,
        right: 0,
        forward: 0,
        back: 0
      }
    const scene = new BABYLON.Scene(engine);
    
    // This is the function that will do something when pointerlock is exited
    let lockRelease = () => {
      if(document.pointerLockElement !== canvas && document.mozPointerLockElement !== canvas) {
          console.log("DO SOMETHING");
      }
  };
  
  let lockEnable = () => {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;

      if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
      }

      canvas.removeEventListener("pointerup", lockEnable);
  };

  // Listen for pointerlock and do something
  if ("onpointerlockchange" in document) {
      document.addEventListener("pointerlockchange", lockRelease);
  } 
  else if ("onmozpointerlockchange" in document) {
      document.addEventListener("mozpointerlockchange", lockRelease);
  }

  canvas.addEventListener("pointerup", lockEnable);

  // Clear out any custom event listeners
  scene.getEngine().onDisposeObservable.add(() => {
      document.removeEventListener("pointerlockchange", lockRelease);
      document.removeEventListener("mozpointerlockchange", lockRelease);
      canvas.removeEventListener("pointerup", lockEnable);
  });
    //var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    //var physicsPlugin = new BABYLON.CannonJSPlugin();

    //scene.enablePhysics(gravityVector, physicsPlugin);
    //scene.collisionsEnabled();
    scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
    scene.getPhysicsEngine().setTimeStep(.05);

    const camera = new BABYLON.ArcRotateCamera('arcCamera1', 5, 11.4, -25, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, false)
    camera.setPosition(new BABYLON.Vector3(5.2, 12, -27.5))
    camera.checkCollisions = true
    camera.applyGravity = true
    camera.fov = .9

    camera.lowerRadiusLimit = 2
    camera.upperRadiusLimit = 20

    camera.keysLeft = []
    camera.keysRight = []
    camera.keysUp = []
    camera.keysDown = []

    const player = BABYLON.Mesh.CreateBox('box', 1.25, scene)
    player.position.x = -5.2
    player.position.y = 12.09
    player.position.z = -24.2
    player.checkCollisions = true
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 100, restitution: 0.35 }, scene);
    camera.setTarget(player)
    //camera.followMesh = player;

    let speed = .05
    var jumpSound = new BABYLON.Sound("music", "./mp3/jump.wav", scene);  

    player.update = function() {
        var cameraForwardRayPosition = camera.getForwardRay().direction
        var cameraForwardRayPositionWithoutY = new BABYLON.Vector3(cameraForwardRayPosition.x, 0, cameraForwardRayPosition.z)
        if (keys) {
            if (keys.jump) {
                player.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0.3, 0), player.getAbsolutePosition())
                 jumpSound.play();
              }
            if (keys.left) {
                player.locallyTranslate(new BABYLON.Vector3(-speed, 0, 0))
              }
            if (keys.right) {
                player.locallyTranslate(new BABYLON.Vector3(speed, 0, 0))
              }
            if (keys.forward) {
                player.lookAt(player.position.add(cameraForwardRayPositionWithoutY), 0, 0, 0)
                player.position = player.position.add(new BABYLON.Vector3(cameraForwardRayPosition.x * speed, 0, cameraForwardRayPosition.z * speed))
              }
            if (keys.back) {
                player.lookAt(player.position.add(cameraForwardRayPositionWithoutY), 0, 0, 0)
                player.position = player.position.add(new BABYLON.Vector3(-cameraForwardRayPosition.x * speed, 0, -cameraForwardRayPosition.z * speed))
              }
        }
    }

    engine.runRenderLoop(() => {
        if (player != null) {
          player.update()
        }
      })
    
      window.addEventListener('keydown', handleKeyDown, false)
      window.addEventListener('keyup', handleKeyUp, false)

     
    let action = 16
  function handleKeyDown (evt) {
    if (evt.keyCode == 32) keys.jump = 1 // space
    // if (evt.keyCode == 81) keys.left = 1 // q
    // if (evt.keyCode == 69) keys.right = 1 // e
    if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 1 // A
    if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 1 // D
    if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 1 // W
    if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 1 // S
    if (evt.keyCode == 16) speed = 0.1 // shift

    if (action !== evt.keyCode) {
        action = evt.keyCode
        console.log(action)
    }
}

function handleKeyUp (evt) {
    if (evt.keyCode == 32) keys.jump = 0
    // if (evt.keyCode == 81) keys.left = 0 // q
    // if (evt.keyCode == 69) keys.right = 0 // e
    if (evt.keyCode == 65 || evt.key == 'ArrowLeft') keys.left = 0
    if (evt.keyCode == 68 || evt.key == 'ArrowRight') keys.right = 0
    if (evt.keyCode == 87 || evt.key == 'ArrowUp') keys.forward = 0
    if (evt.keyCode == 83 || evt.key == 'ArrowDown') keys.back = 0
    if (evt.keyCode == 16) speed = 0.05

    action = evt.keyCode
    console.log(action)
  }



    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("public/environment/environmentSpecular.env", scene);
    var currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

    var atmosphere = new BABYLON.Sound("Ambient", "./mp3/autumn-sky-meditation-7618.mp3", scene, null, {
        loop: true,
        autoplay: true
    });


    //BABYLON.SceneLoader.ImportMesh("", "public/", "Level1V2.glb", scene, function(newMeshes) {
        //let mesh = newMeshes[0];
        //mesh.alwaysSelectAsActiveMesh = true;
        //mesh.checkCollisions = true;
        //mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 10, restitution: 0.7}, scene);
        //camera.target = player;
    //});



    BABYLON.SceneLoader.ImportMesh("", "./", "CAMP.glb", scene, function(newMeshes) {
      let mesh = newMeshes[0];
      mesh.position.x = -30
      mesh.position.y = 10.2
      mesh.position.z = -29.2
    })

    const particleSystem = new BABYLON.ParticleSystem("particles", 2000);
    particleSystem.particleTexture = new BABYLON.Texture("image/flame.png");
    particleSystem.emitter = new BABYLON.Vector3(-30, 11.5, -29);
    particleSystem.start();

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "image/heightMap.png", 100, 100, 100, 0, 10, scene, false, () => {
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 0.0, restitution: 0.7  })
    })
    ground.material = new BABYLON.GridMaterial('groundMaterial', scene)
    ground.position.y = 10
    ground.position.x = 0
    ground.checkCollisions = true

    

    const coin = BABYLON.Mesh.CreateBox('box', 0.25, scene)
    coin.position.x = -5.2
    coin.position.y = 12.09
    coin.position.z = -28.2
    coin.checkCollisions = true
    coin.physicsImpostor = new BABYLON.PhysicsImpostor(coin, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 100, restitution: 0.35 }, scene);
    const cMaterial = new BABYLON.StandardMaterial('material', scene);
    cMaterial.emissiveColor = new BABYLON.Color3(0.255, 0.215, 0);
    coin.material = cMaterial;

    const coin2 = BABYLON.Mesh.CreateBox('box', 0.25, scene)
    coin2.position.x = 0
    coin2.position.y = 12.09
    coin2.position.z = -28.2
    coin2.checkCollisions = true
    coin2.physicsImpostor = new BABYLON.PhysicsImpostor(coin2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 100, restitution: 0.35 }, scene);
    cMaterial.emissiveColor = new BABYLON.Color3(0.255, 0.215, 0);
    coin2.material = cMaterial;

    const coin3 = BABYLON.Mesh.CreateBox('box', 0.25, scene)
    coin3.position.x = -15.2
    coin3.position.y = 12.09
    coin3.position.z = -28.2
    coin3.checkCollisions = true
    coin3.physicsImpostor = new BABYLON.PhysicsImpostor(coin3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 100, restitution: 0.35 }, scene);
    cMaterial.emissiveColor = new BABYLON.Color3(0.255, 0.215, 0);
    coin3.material = cMaterial;

    var counter = 0;
  
     player.physicsImpostor.registerOnPhysicsCollide(coin.physicsImpostor, function(main, collided){
       coinSound.play();
       coin.dispose();
     });
     player.physicsImpostor.registerOnPhysicsCollide(coin2.physicsImpostor, function(main, collided){
      //yada = true;
      coinSound.play();
      coin2.dispose();
    });
    player.physicsImpostor.registerOnPhysicsCollide(coin3.physicsImpostor, function(main, collided){
      //yada = true;
      coinSound.play();
      coin3.dispose();
    });
    // if (yada = true){
    //   counter++;
    //   coin.dispose();
      var coinSound = new BABYLON.Sound("Coin", "./mp3/coin.wav", scene);
    // }
        // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var rect1 = new BABYLON.GUI.Rectangle();
    rect1.width = 0.1;
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "Orange";
    rect1.thickness = 4;
    rect1.background = "green";
    advancedTexture.addControl(rect1);

    var label = new BABYLON.GUI.TextBlock();
    label.text = "Coins:  " + counter + "/3";
    rect1.addControl(label);
    rect1.linkWithMesh(player);
    rect1.linkOffsetY = -310;
    rect1.linkOffsetX = 580;

   
    

    

    



    //scene.debugLayer.show();
    return scene;

};