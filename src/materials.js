
import {StandardMaterial, Color3, Texture} from "@babylonjs/core";

const materialLibrary = (scene) => {

    //let buttonNotPressedMat = new StandardMaterial("buttonNotPressedMat", scene);
    //buttonNotPressedMat.diffuseColor = new Color3(0,1,0);

    let buttonPressedMat = new StandardMaterial("materialButtonPressed", scene);
    buttonPressedMat.diffuseColor = new Color3(0,1,0);

    let wallMat = new StandardMaterial("materialWall", scene);
    wallMat.diffuseColor = new Color3.FromHexString("#86592d");

    let groundMat = new StandardMaterial("materialGround", scene);
    groundMat.diffuseColor = new Color3(0,1,0);
    let groundTexture = new Texture("http://127.0.0.1:8181/grass.jpg", scene);
    groundMat.diffuseTexture = groundTexture;
    groundMat.diffuseTexture.uScale = 8;
    groundMat.diffuseTexture.vScale = 20;


    let rampMat = new StandardMaterial("materialRamp");
    rampMat.diffuseColor = new Color3(0,1,0);

    const boundaryMat = new StandardMaterial("materialBoundary");
    boundaryMat.diffuseColor = new Color3(0, 0, 1);
}

export { materialLibrary }
