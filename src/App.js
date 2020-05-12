import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import './App.css';

import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import GLTFLoader from 'three-gltf-loader';
import './styles.css';
import { Scene, Vector3 } from "three";

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

function useHookWithRefCallback() {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (node) {
      node.rotation.x = 0.6;
      node.rotation.y = -0.6;
    }

    ref.current = node;
  }, [])

  return [setRef, ref]
}

function useSmoothMove(group) {
  const [newPos, move] = useState(group.current && group.current.position);
  const [newRot, rotate] = useState(group.current && group.current.rotation);
  useFrame(() => {
    if (!newPos) {
      return;
    }

    const currPos = group.current.position.clone();
    const posInc = (new Vector3(...newPos)).add(currPos.negate()).normalize();
    if (posInc.x || posInc.y || posInc.z) {
      group.current.position.multiplyScalar(10).round().add(posInc);
      group.current.position.divideScalar(10);
    }

    if (!newRot) {
      return;
    }

    const currRot = group.current.rotation.clone();
    const rotInc = (new Vector3(...newRot)).add(currRot.negate()).normalize();
    if (rotInc.x || rotInc.y || rotInc.z) {
      group.current.rotation.multiplyScalar(10).round().add(rotInc);
      group.current.rotation.divideScalar(10);
    }
  })

  return { move, rotate }
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
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

  return (<group ref={group} dispose={null} rotation={[0, 0, 0]} position={[0, 0.5, 0]} scale={[1, 1, 1]}>
      <mesh {...nodes.Cube}></mesh>
    </group>);
}

function Playground({ pos }) {
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
      <CustomBox pos={currPos}  />
    </Suspense>
  </group>);
}

function PlayerProgram() {
  return (<section style={{
    background: 'blue',
    height: 100,
    margin: '100px'
  }}>
    
    </section>);
}

function MoveFrontIcon() {
  return (<span style={{
    width: 50,
    height: 50,
    display: 'inline-block',
    background: 'orange',
    textAlign: 'center',
    verticalAllign: 'middle',
    lineHeight: 3,
  }}>
    >
  </span>);
}

function App() {
  const [playerPosition, setPlayerPosition] = useState([0, 0.5, 0]);
  return (
    <div className="App">
      <header className="App-header">Funny coding</header>
      <section>
        <Canvas colorManagement>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Playground pos={playerPosition} />
        </Canvas>
      </section>
      {/* <PlayerProgram />
      <MoveFrontIcon /> */}

      <br />
      <button onClick={() => {
        setPlayerPosition([playerPosition[0] + 1, playerPosition[1], playerPosition[2]]);
      }}>FRONT</button>
      <button onClick={() => {
        setPlayerPosition([playerPosition[0] - 1, playerPosition[1], playerPosition[2]]);
      }}>BACK</button>
      <button onClick={() => {
        setPlayerPosition([playerPosition[0], playerPosition[1], playerPosition[2] + 1]);
      }}>RIGHT</button>
      <button onClick={() => {
        setPlayerPosition([playerPosition[0], playerPosition[1], playerPosition[2] - 1]);
      }}>LEFT</button>
    </div>
  );
}

export default App;
