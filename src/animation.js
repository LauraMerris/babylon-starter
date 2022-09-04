import { Animation } from "@babylonjs/core";
 
 // creates an animation to raise the mesh by the specified amount
 const raiseYAnimation = (start, end) => {
    const yMovementAnimation = new Animation("yMovementAnimation", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const yMovementAnimationKeys = [];

    yMovementAnimationKeys.push({
        frame:0,
        value:start
    });

    yMovementAnimationKeys.push({
        frame:30,
        value:((start- end)/2)
    });

    yMovementAnimationKeys.push({
        frame:60,
        value:end
    });

    yMovementAnimation.setKeys(yMovementAnimationKeys);
    return yMovementAnimation;
}

export { raiseYAnimation }