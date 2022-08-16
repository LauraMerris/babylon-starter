import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, DynamicTexture, Quaternion, Vector3, HemisphericLight, DeviceType, Mesh, MeshBuilder, DeviceSourceManager, SceneLoader, StandardMaterial, Texture, Color3, Animation, Tools, Space, Axis, AxesViewer } from "@babylonjs/core";
import './style.css';
import { showWorldAxis } from "../utilities/axes";
import { playerInputVector} from "./inputSystem";

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
            let scene = new Scene(engine);
            showWorldAxis(scene, 5);
            let deviceSourceManager = new DeviceSourceManager(scene.getEngine());

            // camera and light
            let camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 20, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);   
           
            let light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    
            
           /* add the ground */
            let ground = MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);


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

            let scaleFactor = 0.005;

            // entity person
            // components: hasMesh, moveable (speed), playerControlled

            // entity ground
            // components: hasMesh

            // init
            // drawSystem: draw all entities with component hasMesh

            // playerInputSystem
            // getsInput, gets entities with PlayerControlled component 
            // moves them

            // per-render updates
            scene.onBeforeRenderObservable.add(()=>{

                // construct movement vector
                // ignore y for the time being
                // Vector3 (inputX, 0, inputZ)
                // clamp magnitude of movement vector (e.g. you don't want additive movement in diagonal direction)
                // person.position is moved (movement vector * scene.deltaTime * playerSpeed)
                

                    let delta = scene.deltaTime;
                    let piv = playerInputVector(deviceSourceManager);
                    
                    if (piv.length() == 0){
                        return;
                    }

                    let inputVector = piv.normalize();

                    let movementVector = inputVector.scaleInPlace(scaleFactor * delta);
                    person.moveWithCollisions(movementVector);
                    
                    /* handle rotation change */

                    /* calculate the angle between the positive z axis and the vector of movement 
                       rotate the player in that direction */
                    let targetAngle = Math.atan2(inputVector.x, inputVector.z);
                    person.rotation.y = (targetAngle);
                
                          
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