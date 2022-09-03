import {ActionManager, ExecuteCodeAction, PredicateCondition, MeshBuilder, Vector3} from "@babylonjs/core";
/* ---------------- interaction system --------------- */


    let playerActionTarget = "";
    let scene;

    const initActionSystem = (currentScene) => {

        scene = currentScene;
        // observable on actionTarget?

        // when player presses the action button
        // get the current target that player can act on
        // and perfom its action

        scene.actionManager = new ActionManager(scene);
        const keyListener = scene.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnKeyDownTrigger,
                    parameter: 69
                },
                function(){
                    let target = scene.getMeshByName(playerActionTarget);
                    if (!target.metadata) return;
                    target.metadata.playerAction();
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

   
    // creates collider mesh and associated action
    const createCollider = (mesh, name, width, height, depth, position, action) => {
        const collider = MeshBuilder.CreateBox(name, {width:width, height:height, depth:depth}, scene);
        collider.position = mesh.getAbsolutePosition().add(new Vector3(height/2));
        collider.isVisible = false;
        collider.metadata = {
            playerAction: action
        }
        return collider;
    }


export {initActionSystem, canInteract, createCollider};
    