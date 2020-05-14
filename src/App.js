import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import './App.css';

import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import GLTFLoader from 'three-gltf-loader';
import './styles.css';

import { usePlayerController } from './hooks/usePlayerController'
import { useHookWithRefCallback } from './hooks/useHookWithRefCallback'
import { useSmoothMove } from './hooks/useSmoothMove'

import { delay } from './utils'

function Box({ isExpanded, ...props}) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      rotation={[0, 0, 0]}
      scale={(active || isExpanded) ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "hotpink" : "orange"}
      />
    </mesh>
  );
}

function CustomBox({ pos, rot, ...props}) {
  const speed = 0.75;
  const group = useRef();
  const { nodes, materials, animations } = useLoader(GLTFLoader, '/box.glb');

  const [mixer] = useState(() => new THREE.AnimationMixer());
  useFrame((state, delta) => {
    mixer.update(delta * speed);
  })

  const { move, rotate } = useSmoothMove(group);

  useEffect(() => {
    const animationAction = mixer.clipAction(animations[0], group.current);
    animationAction.loop = THREE.LoopOnce;
    animationAction.reset().play();
    delay(200).then(() => move(pos));
  }, [pos]);

  useEffect(() => {
    rotate(rot);
  }, [rot])

  return (<group ref={group} dispose={null} rotation={[0, 0, 0]} position={[0, 0.5, 0]} scale={[1, 1, 1]}>
      <mesh {...nodes.Cube}></mesh>
    </group>);
}

function Playground({ pos, rot }) {
  const [setRef] = useHookWithRefCallback();
  const [currPos, setCurrPos] = useState(pos)

  useEffect(() => {
    setCurrPos(pos);
  }, [pos])
  return (<group ref={setRef}>
    <Box position={[0, 0, 0]} />
    <Box position={[1, 0, 0]} />
    <Box position={[2, 0, 0]} />
    <Box position={[0, 0, 1]} />
    <Suspense fallback={null}>
      <CustomBox pos={currPos} rot={rot}  />
    </Suspense>
  </group>);
}

function Board({ commandTypes }) {

  return (<div style={
    {
      background: 'lightblue',
      margin: '0, 100px',
      minHeight: 200
    }
  }>
    {
      commandTypes.map((type) => (
        <Command type={type} />
      ))
    }
  </div>);
}

function Command({ type }) {
  const color = type === 'front' ? 'orange' : 'violet'
  return (<span style={
    {
      background: color,
      display: 'inline-block',
      width: 50
    }
  }>{ type }</span>);
}

function App() {
  const {
      player,
      goFront,
      goBack,
      turnRight,
      turnLeft,
  } = usePlayerController()
  return (
    <div className="App">
      <header className="App-header">Funny coding</header>
      <section>
        <Canvas colorManagement>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Playground pos={player.position} rot={player.rotation} />
        </Canvas>
      </section>
      
      <button onClick={goFront}>FRONT</button>
      <button onClick={goBack}>BACK</button>
      <button onClick={turnRight}>RIGHT</button>
      <button onClick={turnLeft}>LEFT</button>
      <br />
      <Board commandTypes={[]} />
      <Command type={'front'} />
      <br />
      <Command type={'back'} />
    </div>
  );
}

export default App;
