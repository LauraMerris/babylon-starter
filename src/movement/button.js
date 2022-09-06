// will I need to make the button and collider separately, or shall I join them together?

// move the general functions from movementSystem in to here


// create a button mesh
// assign a material
// link the collider
// add action 
const buttonSwitchOn = (button) => {
    let buttonPressedMat = new StandardMaterial("buttonPressedMat", scene);
    buttonPressedMat.diffuseColor = new Color3(0,1,0);
    button.material = buttonPressedMat;
};

const elevatorButton = MeshBuilder.CreateCylinder("cylinder", {height:0.1, diameter:0.5}, scene);
elevatorButton.position = new Vector3(3,0,3);  

let actionsOnCollision = [
() => buttonSwitchOn(elevatorButton),  
];

const elevatorCollider = createCollider(elevatorButton, "elevatorButtonCollider", 1, 1, 1, new Vector3(3,0.5,3), actionsOnCollision);

canInteract(elevatorCollider, person);

//addActions(button, actionsArray)
//find associated collider, then call
// addColliderAction(collider,actionsArray)