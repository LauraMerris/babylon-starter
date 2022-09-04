import {ActionManager, ExecuteCodeAction, PredicateCondition, MeshBuilder, Vector3, CombineAction, Action} from "@babylonjs/core";

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



    // call on any collider (mesh) that can be interacted with by (person) when pressing the action button
    // assumes only one action target is available at once
    // collider mesh must have the playerAction property in its metadata
    const canInteract = (mesh, person) => {
        mesh.actionManager = new ActionManager(scene);
        mesh.actionManager.registerAction(new ExecuteCodeAction({trigger: ActionManager.OnIntersectionEnterTrigger,parameter: person},() =>{playerActionTarget = mesh.name;}));
        mesh.actionManager.registerAction(new ExecuteCodeAction({trigger: ActionManager.OnIntersectionExitTrigger,parameter: person}, () => {playerActionTarget = "";}));
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
    