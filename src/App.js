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
  const [newRotation, rotate] = useState(
    group.current && group.current.rotation
  );
  useFrame(() => {
    if (newPos) {
      const currPos = group.current.position.clone();
      const posInc = (new Vector3(...newPos)).add(currPos.negate()).normalize();
      if (posInc.x || posInc.y || posInc.z) {
        group.current.position.multiplyScalar(10).round().add(posInc);
        group.current.position.divideScalar(10);
      }
    }

    if (newRotation) {
      let y = newRotation[1];

      if (Math.abs(y - group.current.rotation.y) > Math.abs(y + 2 * Math.PI - group.current.rotation.y)) {
        y += 2 * Math.PI;
      }
      if (Math.abs(y - group.current.rotation.y) > Math.abs(y - 2 * Math.PI - group.current.rotation.y)) {
        y -= 2 * Math.PI;
      }

      const c = (y - group.current.rotation.y > 0 ? 1 : -1)
      const inc = c * Math.PI / 20;
      group.current.rotation.y += inc;
      if (c * (y - group.current.rotation.y) < 0) {
        group.current.rotation.y = y % (2 * Math.PI);
      }
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
};

function usePlayerController(initialPosition = [0, 0.5, 0], initialRotation = [0, 0, 0]) {
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
      {/* <PlayerProgram />
      <MoveFrontIcon /> */}

      <br />
      <button onClick={goFront}>FRONT</button>
      <button onClick={goBack}>BACK</button>
      <button onClick={turnRight}>RIGHT</button>
      <button onClick={turnLeft}>LEFT</button>
    </div>
  );
}

export default App;
