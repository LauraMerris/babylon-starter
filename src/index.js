import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, CubeTexture, DynamicTexture, Quaternion, Vector3, HemisphericLight, DeviceType, Mesh, MeshBuilder, DeviceSourceManager, SceneLoader, StandardMaterial, Texture, Color3, Animation, Tools, Space, Axis, AxesViewer, Color4, ExecuteCodeAction, ActionManager, Curve3 } from "@babylonjs/core";
import './style.css';
import { showWorldAxis } from "../utilities dev/axes";
import { playerInputVector} from "./inputSystem";
import { createWorld } from "./models/worldData";
import {createCharacter} from "./models/person";

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
            let scaleFactor = 0.003; //speed

            let scene = new Scene(engine);
            //scene.debugLayer.show();

            let deviceSourceManager = new DeviceSourceManager(scene.getEngine());

            /* skybox */
            scene.clearColor = new Color3.Black;
            var skybox = MeshBuilder.CreateBox("skyBox", {size:100}, scene);
	        var skyboxMaterial = new StandardMaterial("skyBox", scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new CubeTexture("http://127.0.0.1:8181/skybox/skybox", scene);
    
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            skybox.material = skyboxMaterial;			

            // camera and light
            let camera = new ArcRotateCamera("Camera", -Math.PI /2, Math.PI / 3, 20, Vector3.Zero(), scene);
            camera.upperBetaLimit = 80 * (Math.PI / 180);
            camera.attachControl(canvas, true);   
           
            let light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
            
            createWorld(scene);
            let person = createCharacter(scene);

            let elevatorFaceColors = new Array(6);
            elevatorFaceColors[1] = new Color4.FromHexString("#ede728");


            /* create elevator */
            const elevator = MeshBuilder.CreateBox("elevator",{width:2,height:2,depth:2, faceColors:elevatorFaceColors}, scene);       
            elevator.position = new Vector3(3,-1.05,3);
            elevator.metadata = {
                isRaised:false
            };
            elevator.checkCollisions = true;

            // elevator bottom hit box
            const elevatorLowerTrigger = MeshBuilder.CreateBox("elevatorLowerTrigger", {width:2,height:0.25,depth:0.45},scene);
            elevatorLowerTrigger.position = new Vector3(3,-2,2);
            elevatorLowerTrigger.setParent(elevator);
            elevatorLowerTrigger.isVisible = false;

            elevatorLowerTrigger.actionManager = new ActionManager(scene);

            // bottom trigger point reached
            const initiateLadderClimb = () => {
                if (!elevator.metadata.isRaised) return;
                if (!person.metadata.isClimbing == true){
                    // and assuming the ladder is up
                    // remove player control
                    // animate getting on, then snap to point
                    person.position = new Vector3(3,0.25,1.75);
                    person.metadata.isClimbing = true;
                    person.rotation.y = 0;
                    console.log('got on at the bottom');
                    // restore player control
                } else {
                    // remove player control
                    // animate getting off ladder, then
                    person.position = new Vector3(3,0,1.4);
                    person.metadata.isClimbing = false;
                    person.rotation.y = Math.PI;
                    console.log('getting off the ladder at the bottom');
                    // restore player control
                }
               
            }

            // is it possible to pass parameter to the subsequent function?
            elevatorLowerTrigger.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: person
                    },
                    initiateLadderClimb
                )
            );

             // elevator top hit box
             const elevatorUpperTrigger = MeshBuilder.CreateBox("elevatorUpperTrigger", {width:2,height:0.25,depth:0.45},scene);
             elevatorUpperTrigger.position = new Vector3(3,0.5,1.70);
             elevatorUpperTrigger.setParent(elevator);
             elevatorUpperTrigger.isVisible = false;

             elevatorUpperTrigger.actionManager = new ActionManager(scene);

             // top trigger point reached
             const endLadderClimb = () => {
                if (!elevator.metadata.isRaised) return;
                if (person.metadata.isClimbing == true){
                    // and assuming the ladder is up
                    // remove player control
                    // animate getting off ladder at top then, snap to point
                    person.position = new Vector3(3,2,2.3);
                    person.metadata.isClimbing = false;
                    person.rotation.y = 0;
                    console.log('got off at the top');
                    // restore player control
                } else {
                    // remove player control
                    // animate getting on ladder at top then 
                    person.position = new Vector3(3,1.35,1.75);
                    person.metadata.isClimbing = true;
                    person.rotation.y = 0;
                    console.log('getting on the ladder at the top');
                    // restore player control
                }
               
            }

             // is it possible to pass parameter to the subsequent function?
             elevatorUpperTrigger.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: person
                    },
                    endLadderClimb
                )
            );

            /* triggered actions */
            let elevatorMoving = false;
            const elevatorAnimation = new Animation("elevatorAnimation", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
            const elevatorKeys = [];

            elevatorKeys.push({
                frame:0,
                value:-1.05
            });

            elevatorKeys.push({
                frame:30,
                value:0.5
            });

            elevatorKeys.push({
                frame:60,
                value:1
            });

            elevatorAnimation.setKeys(elevatorKeys);

            elevator.animations.push(elevatorAnimation);

            const unParentPerson = () => {
                elevator.metadata.isRaised = true;
                person.setParent(null);
            };

            const makeElevatorRise = () => {
                /* animate lever first */
                person.setParent(elevator);
                const anim = scene.beginAnimation(elevator,0,60, false,1,unParentPerson);
            };

            // per-render updates
            scene.onBeforeRenderObservable.add(()=>{
 
                // construct movement vector
                // ignore y for the time being
                // Vector3 (inputX, 0, inputZ)
                // clamp magnitude of movement vector (e.g. you don't want additive movement in diagonal direction)
                // person.position is moved (movement vector * scene.deltaTime * playerSpeed)

                // movementSystem.movePlayer();

                    let delta = scene.deltaTime;
                    let piv = playerInputVector(deviceSourceManager); // input vector in x/z plane
                    
                    let inputVector = piv.normalize();

                    if (person.metadata.isClimbing){
                        if (inputVector.z > 0){
                            person.moveWithCollisions(new Vector3(0,0.015,0));
                        } else if(inputVector.z < 0){
                            person.moveWithCollisions(new Vector3(0,-0.015,0));
                        }
                        return;
                    }


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

                    // spacebar triggers elevator animation
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard)){
                        if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(32) == 1){
                            if (!elevatorMoving){
                                elevatorMoving = true;
                                makeElevatorRise();
                            }
                        }
                        
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