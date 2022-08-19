import { Engine, Scene, ArcRotateCamera, DynamicTexture, Quaternion, Vector3, HemisphericLight, DeviceType, Mesh, MeshBuilder, DeviceSourceManager, SceneLoader, StandardMaterial, Texture, Color3, Animation, Tools, Space, Axis, AxesViewer } from "@babylonjs/core";

const showWorldAxis = (scene, size, origin) => {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };

    var axisX = Mesh.CreateLines("axisX", [ 
      Vector3.Zero().add(origin), 
      new Vector3(size, 0, 0).add(origin), 
      new Vector3(size * 0.95, 0.05 * size, 0).add(origin), 
      new Vector3(size, 0, 0).add(origin), 
      new Vector3(size * 0.95, -0.05 * size, 0).add(origin)
      ], scene);
    axisX.color = new Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new Vector3(0.9 * size, 0.05 * size, 0).add(origin);
   
    var axisY = Mesh.CreateLines("axisY", [
        Vector3.Zero().add(origin), 
        new Vector3(0, size, 0).add(origin), 
        new Vector3( -0.05 * size, size * 0.95, 0).add(origin), 
        new Vector3(0, size, 0).add(origin), 
        new Vector3( 0.05 * size, size * 0.95, 0).add(origin)
        ], scene);
    axisY.color = new Color3(0, 1, 0);
    
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size).add(origin);

    var axisZ = Mesh.CreateLines("axisZ", [
        Vector3.Zero().add(origin), 
        new Vector3(0, 0, size).add(origin), 
        new Vector3( 0 , -0.05 * size, size * 0.95).add(origin),
        new Vector3(0, 0, size).add(origin), 
        new Vector3( 0, 0.05 * size, size * 0.95).add(origin)
        ], scene);
    axisZ.color = new Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);    
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size).add(origin);

};

export { showWorldAxis };