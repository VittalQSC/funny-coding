import React from "react";
import useGlobalHook from '../hooks/useGlobalHook';

import * as actions from "../actions";

const initialState = { player: { position: [0, 0.5, 0], rotation: [0, 0, 0] } };

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
