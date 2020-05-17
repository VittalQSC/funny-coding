import { useState, useEffect } from "react";
import { delay, isEqual } from '../utils';

export function usePlayerController(initialPosition = [0, 0.5, 0], initialRotation = [0, 0, 0], availablePosition) {
    const [player, updatePlayer] = useState({
      position: initialPosition,
      rotation: initialRotation
    });
  
    const [arrayOfChanges, setArrayOfChanges] = useState([]);

    const availableXYpositions = availablePosition.map(pos => [pos[0], pos[2]]);
    const isAvailablePosition = (position) => {
      const currXYpos = [position[0], position[2]];
      return !!availableXYpositions.find(availablePos => isEqual(availablePos, currXYpos));
    };

    const goFront = () => {
      const pis = player.rotation[1] / Math.PI;
      let [xInc, yInc] = [0, 0];
      xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
      yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
      const newPosition = [
        player.position[0] + xInc,
        player.position[1],
        player.position[2] + yInc,
      ];
      if (!isAvailablePosition(newPosition)) {
        updatePlayer({...player});
        return;
      }
      updatePlayer({
        ...player,
        position: newPosition,
      });
    };
    const goBack = () => {
      const pis = player.rotation[1] / Math.PI;
      let [xInc, yInc] = [0, 0];
      xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
      yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
      const newPosition = [
        player.position[0] - xInc,
        player.position[1],
        player.position[2] - yInc,
      ];
      if (!isAvailablePosition(newPosition)) {
        updatePlayer({...player});
        return;
      }
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

      setPosition: (position) => {
        updatePlayer({
          ...player,
          position
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