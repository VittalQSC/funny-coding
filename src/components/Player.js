import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import useGlobal from "../store";

import { useSmoothMove } from '../hooks/useSmoothMove';

import { delay } from '../utils';

export function Player({ ...props}) {
    const speed = 0.75;
    const group = useRef();
    const { nodes, materials, animations } = useLoader(GLTFLoader, '/box.glb');
  
    const [state] = useGlobal();
  
    const [mixer] = useState(() => new THREE.AnimationMixer());
    useFrame((state, delta) => {
      mixer.update(delta * speed);
    })
  
    const { move, rotate } = useSmoothMove(group);
  
    useEffect(() => {
      const animationAction = mixer.clipAction(animations[0], group.current);
      animationAction.loop = THREE.LoopOnce;
      animationAction.reset().play();
      delay(200).then(() => move(state.player.position));
    }, [state.player.position]);
  
    useEffect(() => {
      rotate(state.player.rotation);
    }, [state.player.rotation])
  
    return (<group ref={group} dispose={null} rotation={[0, 0, 0]} position={[0, 0.5, 0]} scale={[1, 1, 1]}>
        <mesh {...nodes.Cube}></mesh>
      </group>);
  }