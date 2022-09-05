import { Vector3, MeshBuilder, StandardMaterial, Curve3, Color3, Texture } from "@babylonjs/core";
import * as earcut from "earcut";
import { materialLibrary } from "../materials";

const createWorld = (scene) => {

    /*
    const wallMat = materials.wall(scene);
    const groundMat = materials.ground(scene);
    const rampMat = materials.ramp(scene);
    */
    /*
    let groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0,1,0);

    const rampMat = new StandardMaterial("rampMat");
    rampMat.diffuseColor = new Color3(0,1,0);
*/

    let wallMat = scene.getMaterialByName("materialWall");
    let groundMat = scene.getMaterialByName("materialGround");
    let rampMat = scene.getMaterialByName("materialRamp");
    let boundaryMat = scene.getMaterialByName("materialBoundary");

    /* add the ground */
    let ground = MeshBuilder.CreateGround("ground", {width: 8, height: 20}, scene);   
    ground.material = groundMat;
    ground.checkCollisions = true;

    /* create platforms */
    const box1 = MeshBuilder.CreateBox("plat1", {width:3, height:4, depth:2}, scene);
    const move1 = MeshBuilder.CreateBox("move1", {width:4, height:4, depth:6}, scene);
    const box2 = MeshBuilder.CreateBox("plat2",{width:6,height:4,depth:4}, scene);
    const raise1 = MeshBuilder.CreateBox("raise1",{width:2,height:2,depth:6},scene);
    const raise2 = MeshBuilder.CreateBox("raise2",{width:6,height:2,depth:4},scene);
    const raise3 = MeshBuilder.CreateBox("raise3",{width:2,height:2,depth:6},scene);

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

    box1.position = new Vector3(-2.5,2,-5);
    move1.position = new Vector3(0, 0, -1);
    box2.position = new Vector3(-1,2,8);
    raise1.position = new Vector3(3,1,7);
    raise2.position = new Vector3(-1,1,4);
    raise3.position = new Vector3(-3,1,-1);

    /* create initial slope */
    let slope = [
        new Vector3(0,0,1),
        new Vector3(0,0,0),
        new Vector3(3,0,0),
    ];

    let hermite = Curve3.CreateHermiteSpline(
        new Vector3(3,0,0),
        new Vector3(-1.25,0,0),
        new Vector3(1.25,0,1),
        new Vector3(-1.5,0,0),
        60);

    slope.push(...hermite.getPoints());

    let starterSlope = MeshBuilder.ExtrudePolygon("starterSlope",{shape:slope, depth:4}, scene, earcut);
    starterSlope.rotation.x = -Math.PI / 2;
    starterSlope.position = new Vector3(-4,0,-10);
    starterSlope.checkCollisions = true;

    /* ------- create secret area ------- */

    /* -- doorway rhs -- */
    let pointsDoorway = [
        new Vector3(0,0,4),
        new Vector3(0,0,3),
        new Vector3(1.75,0,3),
        new Vector3(1.75,0,0),
        new Vector3(2,0,0),
        new Vector3(2,0,4)
    ];          

    /* -- create peekaboo wall -- */
    let pointsWall = [
        new Vector3(0,0,3),
        new Vector3(0,0,2),
        new Vector3(1,0,2),
        new Vector3(1,0,1),
        new Vector3(1,0,0),
        new Vector3(0,0,0),
        new Vector3(3,0,0),
        new Vector3(3,0,3),
    ];

    let polygon = MeshBuilder.ExtrudePolygon("secret1", {shape:pointsDoorway, depth:3}, scene, earcut);
    polygon.rotation.x = -Math.PI / 2;
    polygon.rotation.y = -Math.PI / 2;
    polygon.position = new Vector3(2,0,-6);
    polygon.checkCollisions = true;

    let wall = MeshBuilder.ExtrudePolygon("wall", {shape:pointsWall, depth:0.25}, scene, earcut);
    wall.rotation.x = -Math.PI / 2;
    wall.position = new Vector3(-1,0,-6);
    wall.checkCollisions = true;

    /* ------- ramp --------*/
    const ramp1 =  MeshBuilder.CreateBox("ramp1", {width:1, height:1, depth:1.75}, scene);
    ramp1.material = rampMat;
    ramp1.checkCollisions = true;
    ramp1.position = new Vector3(-0.5,0.5,-5.125);

    let pointsRamp = [
        new Vector3(0,0,0),
        new Vector3(2,0,0),
        new Vector3(0,0,1),
    ];

    let ramp2 = MeshBuilder.ExtrudePolygon("ramp2", {shape:pointsRamp, depth:1.5}, scene, earcut);
    ramp2.rotation.x = -Math.PI / 2;
    ramp2.position = new Vector3(0,0,-5.75);
    ramp2.material = rampMat;
    ramp2.checkCollisions = true;

    /* ground boundaries */
    const boundary1 = MeshBuilder.CreateBox("boundary1", {width:10, height:10, depth:0.5}, scene);
    const boundary2 = MeshBuilder.CreateBox("boundary2", {width:10, height:10, depth:0.5}, scene);
    const boundary3 = MeshBuilder.CreateBox("boundary3", {width:0.5, height:10, depth:22}, scene);
    const boundary4 = MeshBuilder.CreateBox("boundary4", {width:0.5, height:10, depth:22}, scene);

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

};

export {createWorld};