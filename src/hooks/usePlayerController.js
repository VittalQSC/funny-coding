import { useState, useEffect } from "react";
import { delay } from '../utils';

export function usePlayerController(initialPosition = [0, 0.5, 0], initialRotation = [0, 0, 0]) {
    const [player, updatePlayer] = useState({
      position: initialPosition,
      rotation: initialRotation
    });
  
    const [arrayOfChanges, setArrayOfChanges] = useState([]);

    const goFront = () => {
      console.log('FRONT', player.position);
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
    };
    const goBack = () => {
      console.log('BACK', player.position);
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
    };

    const turnRight = () => {
      const newRot = [...player.rotation];
      newRot[1] += -Math.PI / 2;
      newRot[1] = newRot[1] % (2 * Math.PI); 
      updatePlayer({
        ...player,
        rotation: newRot
      });
    };

    const turnLeft = () => {
      const newRot = [...player.rotation];
      newRot[1] += Math.PI / 2;
      newRot[1] = newRot[1] % (2 * Math.PI);
      updatePlayer({
        ...player,
        rotation: newRot
      });
    };

    useEffect(() => {
      if (arrayOfChanges.length > 0) {
        const type  = arrayOfChanges[0];
        switch (type) {
          case 'front':
            delay(1000).then(goFront);
            break;
          case 'back':
            delay(1000).then(goBack);
            
            break;
          case 'left':
            delay(1000).then(turnLeft);
            
            break;
          case 'right':
            delay(1000).then(turnRight);
            
            break;
        
          default:
            break;
        }
      }
    }, [arrayOfChanges]);

    useEffect(() => {
      setArrayOfChanges(arrayOfChanges.slice(1));
    }, [player]);

    return {
      player,
      
      reset: () => {
        updatePlayer({
          position: initialPosition,
          rotation: initialRotation,
        });
      },

      setChanges: (arr) => {
        setArrayOfChanges(arr);
      },

      goFront,
      goBack,
      turnRight,
      turnLeft,
    };
  }