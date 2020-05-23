import { useState, useEffect } from "react";
import { delay } from '../utils';

import useGlobal from '../store';

export function usePlayerController(initialPosition = [0, 0.5, 0], initialRotation = [0, 0, 0], availablePosition) {
    const [state, actions] = useGlobal();
  
    const [arrayOfChanges, setArrayOfChanges] = useState([]);

    const availableXYpositions = availablePosition.map(pos => [pos[0], pos[2]]);

    useEffect(() => {
      if (arrayOfChanges.length > 0) {
        const type  = arrayOfChanges[0];
        switch (type) {
          case 'front':
            delay(1000).then(() => actions.player.goFront(availableXYpositions));
            break;
          case 'back':
            delay(1000).then(() => actions.player.goBack(availableXYpositions));
            
            break;
          case 'left':
            delay(1000).then(() => actions.player.turnLeft());
            
            break;
          case 'right':
            delay(1000).then(() => actions.player.turnRight());
            
            break;
        
          default:
            break;
        }
      }
    }, [arrayOfChanges]);

    useEffect(() => {
      setArrayOfChanges(arrayOfChanges.slice(1));
    }, [state.player]);

    return {
      reset: () => {
        actions.player.setPlayer(initialPosition, initialRotation);
      },

      setChanges: (arr) => {
        setArrayOfChanges(arr);
      },

      goFront: () => {
        return actions.player.goFront(availableXYpositions)
      },
      goBack: () => {
        return actions.player.goBack(availableXYpositions)
      },
      turnRight: () => {
        return actions.player.turnRight()
      },
      turnLeft: () => {
        return actions.player.turnLeft()
      },
    };
  }