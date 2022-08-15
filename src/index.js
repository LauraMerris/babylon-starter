import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, DynamicTexture, Quaternion, Vector3, HemisphericLight, DeviceType, Mesh, MeshBuilder, DeviceSourceManager, SceneLoader, StandardMaterial, Texture, Color3, Animation, Tools, Space, Axis, AxesViewer } from "@babylonjs/core";
import './style.css';
import { showWorldAxis } from "../utilities/axes";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.id = "renderCanvas";
        document.body.appendChild(canvas);

        let assetsHostUrl = "http://127.0.0.1:8181/";

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);


        const createScene = () => {
            var scene = new Scene(engine);
            showWorldAxis(scene, 5);
            var deviceSourceManager = new DeviceSourceManager(scene.getEngine());

            // camera and light
            var camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 20, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);   
           
            var light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    
            
           /* add the ground */
            var ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);


            /* create player character */
            const box = MeshBuilder.CreateBox("box", {width:0.5, height:1, depth:0.5}, scene);
            const nose = MeshBuilder.CreateBox("nose", {width:0.1, height:0.1, depth:0.1}, scene);

            const boxMat = new StandardMaterial("boxMat");
            boxMat.diffuseColor = new Color3(1, 0, 0);
            box.material = boxMat;

            const noseMat = new StandardMaterial("noseMat");
            noseMat.diffuseColor = new Color3(0, 0, 1);
            nose.material = noseMat;

            nose.position.y = 0.7;
            nose.position.z = 0.3;
            box.position.y = 0.5;

            const person = Mesh.MergeMeshes([box,nose], true, false, null, false, true);

            let moveSpeed = 0.006;
            

            // per-render updates
            scene.onBeforeRenderObservable.add(()=>{

                // down = 83
                // up = 87
                // right = 68
                // left = 65

                //up -> 38
                //down -> 40
                //left -> 37
                //right -> 39

                // get keys or input
                // translate to horizontal and vertical input
                // inputX, inputY

                // construct movement vector
                // ignore y for the time being
                // Vector3 (inputX, 0, inputZ)
                // clamp magnitude of movement vector (e.g. you don't want additive movement in diagonal direction)
                // person.position is moved (movement vector * scene.deltaTime * playerSpeed)
                
                let vertical = 0;
                let horizontal = 0;
                let rotation = 0;

                if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard)){
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(65) == 1){
                        //left
                        horizontal = -1;
                    } else if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(68) == 1){
                        // right
                        horizontal = 1;
                    } else {
                        horizontal = 0;
                    }

                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(87) == 1){
                        //up
                        vertical = 1;
                    } else if(deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(83) == 1){
                        //down
                        vertical = -1;
                    } else {
                        vertical = 0;
                    }

                    let scaleFactor = 0.005;
                    let delta = scene.deltaTime;
                    let inputVector = new Vector3(horizontal, 0, vertical).normalize();

                    let movementVector = inputVector.scaleInPlace(scaleFactor * delta);
                    person.moveWithCollisions(movementVector);
                    
                    /* handle rotation change */
                    if (inputVector.length() == 0){
                        return;
                    }

                    /* calculate the angle between the positive z axis and the vector of movement 
                       rotate the player in that direction */
                    let targetAngle = Math.atan2(horizontal, vertical);
                    person.rotation.y = (targetAngle);
                   
                }
                      
            });

            return scene;
        };


        const scene = createScene();

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", function() {
            engine.resize();
        });
    }
}
new App();