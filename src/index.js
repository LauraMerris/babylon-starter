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
            let gravity = new Vector3(0, -0.1, 0);
            let scaleFactor = 0.005; //speed

            let scene = new Scene(engine);
            //showWorldAxis(scene, 2, new Vector3(-9,0,8));
            let deviceSourceManager = new DeviceSourceManager(scene.getEngine());

            // camera and light
            let camera = new ArcRotateCamera("Camera", -Math.PI /2, Math.PI / 3, 20, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);   
           
            let light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
            
           
           /* add the ground */
            let ground = MeshBuilder.CreateGround("ground", {width: 8, height: 20}, scene);
            //let ground = MeshBuilder.CreateGroundFromHeightMap("ground", "https://assets.babylonjs.com/textures/heightMap.png", {width:20, height:20, subdivisions:10,maxHeight:3}); 
            ground.checkCollisions = true;

            /* ground boundaries */
            const boundary1 = MeshBuilder.CreateBox("boundary1", {width:10, height:10, depth:0.5}, scene);
            const boundary2 = MeshBuilder.CreateBox("boundary1", {width:10, height:10, depth:0.5}, scene);
            const boundary3 = MeshBuilder.CreateBox("boundary1", {width:0.5, height:10, depth:22}, scene);
            const boundary4 = MeshBuilder.CreateBox("boundary1", {width:0.5, height:10, depth:22}, scene);

            const boundaryMat = new StandardMaterial("boundaryMat");
            boundaryMat.diffuseColor = new Color3(0, 0, 1);
            boundary1.material = boundaryMat;
            boundary2.material = boundaryMat;
            boundary3.material = boundaryMat;
            boundary4.material = boundaryMat;

            boundary1.position = new Vector3(0, 4, 10.25);
            boundary2.position = new Vector3(0, 4, -10.25);
            boundary3.position = new Vector3(-4.25,4,0);
            boundary4.position = new Vector3(4.25,4,0);

            boundary1.isVisible = false;
            boundary2.isVisible = false;
            boundary3.isVisible = false;
            boundary4.isVisible = false;


            boundary1.checkCollisions = true;
            boundary2.checkCollisions = true;
            boundary3.checkCollisions = true;
            boundary4.checkCollisions = true;

             /* add an elevated platform */
             
             /*
             const platform = MeshBuilder.CreateBox("platform", {width:4, height:4, depth:1}, scene);
             platform.checkCollisions = true;
             platform.position.x = -4;
             platform.rotation.x = Math.PI / 4;
             platform.position.y = 1;
 
             const platformMat = new StandardMaterial("platformMat");
             platformMat.diffuseColor = new Color3(0,1,1);
             platform.material = platformMat;
            */

            /* create player character */
            const capsule = MeshBuilder.CreateCapsule("capsule", {height:1, radius:0.25}, scene);
            const nose = MeshBuilder.CreateBox("nose", {width:0.1, height:0.1, depth:0.1}, scene);

            const capsuleMat = new StandardMaterial("capMat");
            capsuleMat.diffuseColor = new Color3(1,0,0);
            capsuleMat.material = capsuleMat;

            const noseMat = new StandardMaterial("noseMat");
            noseMat.diffuseColor = new Color3(0, 0, 1);
            nose.material = noseMat;

            nose.position.y = 0.7;
            nose.position.z = 0.3;
            capsule.position.y = 0.5;

            const person = Mesh.MergeMeshes([capsule,nose], true, false, null, false, true);

            /* create platforms */
            const box1 = MeshBuilder.CreateBox("plat1", {width:6, height:4, depth:2}, scene);
            const move1 = MeshBuilder.CreateBox("move1", {width:4, height:4, depth:6}, scene);
            const box2 = MeshBuilder.CreateBox("plat2",{width:6,height:4,depth:4}, scene);
            const raise1 = MeshBuilder.CreateBox("raise1",{width:2,height:2,depth:6},scene);
            const raise2 = MeshBuilder.CreateBox("raise2",{width:6,height:2,depth:4},scene);
            const raise3 = MeshBuilder.CreateBox("raise3",{width:2,height:2,depth:6},scene);

            const wallMat = new StandardMaterial("wallMat");
            wallMat.diffuseColor = new Color3.FromHexString("#86592d");

            box1.material = wallMat;
            move1.material = wallMat;
            box2.material = wallMat;
            raise1.material = wallMat;
            raise2.material = wallMat;
            raise3.material = wallMat;

            box1.checkCollisions = true;
            move1.checkCollisions = true;
            box2.checkCollisions = true;
            raise1.checkCollisions = true;
            raise2.checkCollisions = true;
            raise3.checkCollisions = true;

            box1.position = new Vector3(-1,2,-5 );
            move1.position = new Vector3(0, 0, -1);
            box2.position = new Vector3(-1,2,8);
            raise1.position = new Vector3(3,1,7);
            raise2.position = new Vector3(-1,1,4);
            raise3.position = new Vector3(-3,1,-1);

            /* initial positions */
            /* the ellipsoid is the collider on the person - this needs to match the boundary of the shape so that 
            the person doesn't hover above surfaces, e.g. on a slope
            By default the ellipsoid is centred on the bottom of the person mesh */
            person.position = new Vector3(-3,0,-8);
            person.ellipsoid = new Vector3(0.25, 0.5, 0.25);
            person.ellipsoidOffset = new Vector3(0, 0.5, 0);


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
                    let piv = playerInputVector(deviceSourceManager); // input vector in x/z plane
                    
                    let inputVector = piv.normalize();

                    let cameraVector = camera.getDirection(piv);

                    // zero the y direction as this is not player controlled
                    cameraVector.y = 0;

                    // normalize the vector so that speed is not faster on diagonal movement
                    let cameraVectorNorm = cameraVector.normalize();

                    //let movementVector = inputVector.scaleInPlace(scaleFactor * delta);
                    let movementVector = cameraVectorNorm.scaleInPlace(scaleFactor * delta);
                    //let movementVector = inputVector.scaleInPlace(scaleFactor * delta);

                    person.moveWithCollisions(movementVector.add(gravity));

                    /* handle rotation change */

                    /* calculate the angle between the positive z axis and the vector of movement 
                       rotate the player in that direction */
                    /* this works because the angle Math.atan2(inputVector.z, inputVector.x) is the angle between x axis and (x,z) 
                       and switching the arguments to Math.atan2(inputVector.x, inputVector.z) gives the angle between the z axis and (z,x)
                       these angles are the same as (x, z) is reflective symmetrical to (z,x) along x=z. ??????????? */

                    if (piv.length() != 0){
                        let targetAngle = Math.atan2(cameraVectorNorm.x, cameraVectorNorm.z);
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