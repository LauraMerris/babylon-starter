import { Vector3 } from "@babylonjs/core";

const convertToXZPlane = (arr) => {
    return arr.map((point) => {
        return new Vector3(point.x,0,point.y);
    });
};

export {convertToXZPlane};