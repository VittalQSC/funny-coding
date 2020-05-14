import { useState } from "react";
import { useFrame } from "react-three-fiber";
import { Vector3 } from "three";

export function useSmoothMove(group) {
    const [newPos, move] = useState(group.current && group.current.position);
    const [newRotation, rotate] = useState(
      group.current && group.current.rotation
    );
    useFrame(() => {
      if (newPos) {
        const currPos = group.current.position.clone();
        const posInc = (new Vector3(...newPos)).add(currPos.negate()).normalize();
        if (posInc.x || posInc.y || posInc.z) {
          group.current.position.multiplyScalar(10).round().add(posInc);
          group.current.position.divideScalar(10);
        }
      }
  
      if (newRotation) {
        let y = newRotation[1];
  
        if (Math.abs(y - group.current.rotation.y) > Math.abs(y + 2 * Math.PI - group.current.rotation.y)) {
          y += 2 * Math.PI;
        }
        if (Math.abs(y - group.current.rotation.y) > Math.abs(y - 2 * Math.PI - group.current.rotation.y)) {
          y -= 2 * Math.PI;
        }
  
        const c = (y - group.current.rotation.y > 0 ? 1 : -1)
        const inc = c * Math.PI / 20;
        group.current.rotation.y += inc;
        if (c * (y - group.current.rotation.y) < 0) {
          group.current.rotation.y = y % (2 * Math.PI);
        }
      }
    })
  
    return { move, rotate }
}