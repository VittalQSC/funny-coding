import * as playerActions from './playerActions'
export const setPlayer = (store, position, rotation) => {
    store.setState({
        player: {
            position,
            rotation
        }
    });
};

export const player = playerActions;