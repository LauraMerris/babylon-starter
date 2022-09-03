 import { MeshBuilder, StandardMaterial, Color3, Vector3, Mesh } from "@babylonjs/core";

 // mesh, material, position, collider
 const createCharacter = (scene) => {

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

    /* player position
    the ellipsoid is the collider on the person - this needs to match the boundary of the shape so that 
    the person doesn't hover above surfaces, e.g. on a slope
    By default the ellipsoid is centred on the bottom of the person mesh */
    const person = Mesh.MergeMeshes([capsule,nose], true, false, null, false, true);
    person.position = new Vector3(-3,1,-8);
    person.ellipsoid = new Vector3(0.25, 0.5, 0.25);
    person.ellipsoidOffset = new Vector3(0, 0.5, 0);

    person.metadata = {
      isClimbing:false,
      playerControlled:true
    };

    return person;

 };
 
 export {createCharacter};