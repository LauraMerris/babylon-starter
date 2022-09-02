import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, DeviceType, Mesh, MeshBuilder, DeviceSourceManager, SceneLoader, StandardMaterial, Texture, Color3, Animation, Tools, Space, Axis } from "@babylonjs/core";
import './style.css';

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
            var deviceSourceManager = new DeviceSourceManager(scene.getEngine());

            // camera and light
            var camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
            camera.attachControl(canvas, true);    
            var light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    
            
            /* using imported model */
            SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "village.glb");
            
            const box = MeshBuilder.CreateBox("box", {width:0.5, height:1, depth:0.5}, scene);
            const nose = MeshBuilder.CreateBox("nose", {width:0.1, height:0.1, depth:0.1}, scene);

            const boxMat = new StandardMaterial("boxMat");
            boxMat.diffuseColor = new Color3(1, 0, 0);
            box.material = boxMat;

            const noseMat = new StandardMaterial("noseMat");
            noseMat.diffuseColor = new Color3(1, 1, 1);
            nose.material = noseMat;


            nose.position.y = 0.7;
            nose.position.x = 0.3;
            box.position.y = 0.5;

            const person = Mesh.MergeMeshes([box,nose], true, false, null, false, true);

            scene.registerBeforeRender(() => {
                if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard)){
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(65) == 1) {
                        person.position.x += 0.1 * scene.getAnimationRatio();
                    } 
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(68) == 1) {
                            person.position.x -= 0.1 * scene.getAnimationRatio();
                    } 
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(83) == 1) {
                        person.position.z += 0.1 * scene.getAnimationRatio();
                
                    } 
                    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(87) == 1) {
                        person.position.z -= 0.1 * scene.getAnimationRatio();
                
                    }
                } 
            });

            /*
            SceneLoader.ImportMeshAsync("", assetsHostUrl, "car.glb").then(() => {
                const car = scene.getMeshByName("car");
                car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
                car.position.y = 0.16;
                car.position.x = -3;
                car.position.z = 8;
        
                const animCar = new Animation("carAnimation", "position.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        
                const carKeys = []; 
        
                carKeys.push({
                    frame: 0,
                    value: 8
                });
        
                carKeys.push({
                    frame: 150,
                    value: -7
                });
        
                carKeys.push({
                    frame: 200,
                    value: -7
                });
        
                animCar.setKeys(carKeys);
        
                car.animations = [];
                car.animations.push(animCar);
        
                scene.beginAnimation(car, 0, 200, true);
              
                //wheel animation
                const wheelRB = scene.getMeshByName("wheelRB");
                const wheelRF = scene.getMeshByName("wheelRF");
                const wheelLB = scene.getMeshByName("wheelLB");
                const wheelLF = scene.getMeshByName("wheelLF");
              
                scene.beginAnimation(wheelRB, 0, 30, true);
                scene.beginAnimation(wheelRF, 0, 30, true);
                scene.beginAnimation(wheelLB, 0, 30, true);
                scene.beginAnimation(wheelLF, 0, 30, true);
            });

            const walk = function (turn, dist) {
                this.turn = turn;
                this.dist = dist;
            }
            
            const track = [];
            track.push(new walk(86, 7));
            track.push(new walk(-85, 14.8));
            track.push(new walk(-93, 16.5));
            track.push(new walk(48, 25.5));
            track.push(new walk(-112, 30.5));
            track.push(new walk(-72, 33.2));
            track.push(new walk(42, 37.5));
            track.push(new walk(-98, 45.2));
            track.push(new walk(0, 47))

            // Dude
            SceneLoader.ImportMeshAsync("him", "https://models.babylonjs.com/Dude/", "dude.babylon", scene).then((result) => {
                var dude = result.meshes[0];
                dude.scaling = new Vector3(0.008, 0.008, 0.008);
                    
                dude.position = new Vector3(-6, 0, 0);
                dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
                const startRotation = dude.rotationQuaternion.clone();    
                    
                scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

                let distance = 0;
                let step = 0.015;
                let p = 0;

                scene.onBeforeRenderObservable.add(() => {
                    dude.movePOV(0, 0, step);
                    distance += step;
                    
                    if (distance > track[p].dist) {
                            
                        dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
                        p +=1;
                        p %= track.length; 
                        if (p === 0) {
                            distance = 0;
                            dude.position = new Vector3(-6, 0, 0);
                            dude.rotationQuaternion = startRotation.clone();
                        }
                    }
                    
                })
            });
            */

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