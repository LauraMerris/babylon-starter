import {ActionManager, ExecuteCodeAction, PredicateCondition, MeshBuilder, Vector3, CombineAction, Action, StandardMaterial, Color3, Mesh} from "@babylonjs/core";

    let playerActionTarget = "";
    let scene;

    const initActionSystem = (currentScene) => {

        scene = currentScene;

        // we attach one actionManager to the scene to listen for action key down (e by default)
        // find the current target stored in a global variable
        // target has a function stored in metadata that defines the action to take - playerAction

        scene.actionManager = new ActionManager(scene);
        const keyListener = scene.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnKeyDownTrigger,
                    parameter: 69
                },
                function(){
                    let target = scene.getMeshByName(playerActionTarget);
                    if (!target.metadata || !target.metadata.playerAction.length) return;
                    for (let i = 0; i < target.metadata.playerAction.length; i++){
                        target.metadata.playerAction[i]();
                    }
                },
                new PredicateCondition(
                    scene.actionManager,
                    function(){
                        // there must be an action target defined
                        return (playerActionTarget);
                    }
                )
            )
        );
    }


    const showPrompt = (mesh) => {
        let disc = scene.getMeshByName("buttonDisc");
        if (disc === null){
            disc = MeshBuilder.CreateDisc("buttonDisc", {radius:0.5}, scene);
            let mat = new StandardMaterial("promptMat", scene);
            mat.diffuseColor = new Color3(0,0,0);
            disc.material = mat;
            disc.billboardMode = Mesh.BILLBOARDMODE_ALL;    
        } else {
            disc.isVisible = true;
        }

        let meshPos = mesh.getAbsolutePosition();
        let discOffset = new Vector3(0,2,0);
        disc.position = meshPos.add(discOffset);
    };

    const hidePrompt = () => {
        let disc = scene.getMeshByName("buttonDisc");
        disc.isVisible = false;
    };

    // call on any collider (mesh) that can be interacted with by (person) when pressing the action button
    // assumes only one action target is available at once
    // collider mesh must have the playerAction property in its metadata
    const canInteract = (mesh, person) => {
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(new ExecuteCodeAction({trigger: ActionManager.OnIntersectionEnterTrigger,parameter: person},() =>{
            playerActionTarget = mesh.name;
            showPrompt(mesh);
        }));
        mesh.actionManager.registerAction(new ExecuteCodeAction({trigger: ActionManager.OnIntersectionExitTrigger,parameter: person}, () => {
            playerActionTarget = "";
            hidePrompt();
        }));
    }

   
    // creates collider mesh and associated actions
    const createCollider = (mesh, name, width, height, depth, position, actionArray) => {
        const collider = MeshBuilder.CreateBox(name, {width:width, height:height, depth:depth}, scene);
        collider.position = mesh.getAbsolutePosition().add(new Vector3(height/2));
        collider.isVisible = false;
        collider.metadata = {
            playerAction: [...actionArray],
        }
        return collider;
    }

    const addColliderAction = (collider, arr) => {
        collider.metadata.playerAction.push(...arr);
    }


export {initActionSystem, canInteract, createCollider};
    