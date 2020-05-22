import { isEqual } from '../utils';

const isAvailablePosition = (position, availableXYpositions) => {
    const currXYpos = [position[0], position[2]];
    return !!availableXYpositions.find(availablePos => isEqual(availablePos, currXYpos));
};

export function setPlayer(store, position, rotation) {
    store.setState({
        ...store.state,
        player: {
            ...store.player,
            position,
            rotation
        }
    })
}

export const goFront = (store, availableXYpositions) => {
    const pis = store.state.player.rotation[1] / Math.PI;
    let [xInc, yInc] = [0, 0];
    xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
    yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
    const newPosition = [
      store.state.player.position[0] + xInc,
      store.state.player.position[1],
      store.state.player.position[2] + yInc,
    ];
    if (!isAvailablePosition(newPosition, availableXYpositions)) {
        store.setState({ ...store });
      return;
    }
    store.setState({
        ...store.state,
        player: {
            ...store.state.player,
            position: newPosition,
        }
    });
};

export const goBack = (store, availableXYpositions) => {
    const pis = store.state.player.rotation[1] / Math.PI;
    let [xInc, yInc] = [0, 0];
    xInc = (pis % 1 === 0) ? (pis % 2 ? -1 : 1) : 0;
    yInc = (pis % 1 !== 0) ? (((pis + 0.5) % 2) ? -1 : 1) : 0;
    const newPosition = [
      store.state.player.position[0] - xInc,
      store.state.player.position[1],
      store.state.player.position[2] - yInc,
    ];
    if (!isAvailablePosition(newPosition, availableXYpositions)) {
      store.setState({ ...store });
      return;
    }
    store.setState({
        ...store.state,
        player: {
          ...store.state.player,
          position: newPosition
        },
    });
};

export const turnRight = (store) => {
    const newRot = [...store.state.player.rotation];
    newRot[1] += -Math.PI / 2;
    newRot[1] = newRot[1] % (2 * Math.PI); 
    store.setState({
        ...store.state,
        player: {
            ...store.state.player,
            rotation: newRot
        }
    });
};

export const turnLeft = (store) => {
    const newRot = [...store.state.player.rotation];
    newRot[1] += Math.PI / 2;
    newRot[1] = newRot[1] % (2 * Math.PI);
    store.setState({
        ...store.state,
        player: {
            ...store.state.player,
            rotation: newRot
        }
    });
  };