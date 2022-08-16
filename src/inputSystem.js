import { Vector3, DeviceType, getEngine } from "@babylonjs/core";

                // down = 83
                // up = 87
                // right = 68
                // left = 65

                //up -> 38
                //down -> 40
                //left -> 37
                //right -> 39

const playerInputVector = (deviceSourceManager) => {
    let vertical = 0;
    let horizontal = 0;

    if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard)){
        if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(65) == 1){
            //left
            horizontal = -1;
        } else if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(68) == 1){
            // right
            horizontal = 1;
        } else {
            horizontal = 0;
        }

        if (deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(87) == 1){
            //up
            vertical = 1;
        } else if(deviceSourceManager.getDeviceSource(DeviceType.Keyboard).getInput(83) == 1){
            //down
            vertical = -1;
        } else {
            vertical = 0;
        }

        let direction = new Vector3(horizontal, 0, vertical);

        return direction;

    }

    return new Vector3(0,0,0);
};

export { playerInputVector };