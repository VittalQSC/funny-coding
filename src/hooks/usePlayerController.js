import { useState } from "react";

export function usePlayerController(initialPosition = [0, 0.5, 0], initialRotation = [0, 0, 0]) {
    const [player, updatePlayer] = useState({
      position: initialPosition,
      rotation: initialRotation
    });
  
    return {
      player,
  
      goFront: () => {
        const pis = player.rotation[1] / Math.PI;
        let [xInc, yInc] = [0, 0];
        xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
        yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
        const newPosition = [
          player.position[0] + xInc,
          player.position[1],
          player.position[2] + yInc,
        ];
        updatePlayer({
          ...player,
          position: newPosition,
        });
      },
      goBack: () => {
        const pis = player.rotation[1] / Math.PI;
        let [xInc, yInc] = [0, 0];
        xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
        yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
        const newPosition = [
          player.position[0] - xInc,
          player.position[1],
          player.position[2] - yInc,
        ];
        updatePlayer({
          ...player,
          position: newPosition
        });
      },
      turnRight: () => {
        const newRot = [...player.rotation];
        newRot[1] += Math.PI / 2;
        newRot[1] = newRot[1] % (2 * Math.PI);
        updatePlayer({
          ...player,
          rotation: newRot
        });
      },
      turnLeft: () => {
        const newRot = [...player.rotation];
        newRot[1] += -Math.PI / 2;
        newRot[1] = newRot[1] % (2 * Math.PI); 
        updatePlayer({
          ...player,
          rotation: newRot
        });
      }
    };
  }