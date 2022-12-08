const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(5, 11.4, -25), scene);
    camera.speed = 5;
        camera.fov = 0.6;
        camera.inertia = 0.0;
        camera.attachControl(canvas, true);
        //camera.setTarget(BABYLON.Vector3.Zero());
    
        //set the ellipsoid around the camera
        camera.ellipsoid = new BABYLON.Vector3(6, 12, -26);
    
        camera.isPickable = false;
        camera.applyGravity = true;
        camera.enablePhysics = true;
        camera.checkCollisions = true;

    
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
        camera.keysLeft.push(65);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("public/environment/environmentSpecular.env", scene);
        var currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

        //BABYLON.SceneLoader.Append("public/", "Level1.glb", scene, function(scene) {
            //Do something
        //});
        BABYLON.SceneLoader.ImportMesh("", "public/", "Level1.glb", scene, function(newMeshes){
            camera.target = newMeshes[0];
        });
        return scene;
}