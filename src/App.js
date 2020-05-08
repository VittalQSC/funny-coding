import React, { useRef, useState, useEffect, Suspense } from "react";
import './App.css';

import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import GLTFLoader from 'three-gltf-loader';
import './styles.css';

// // This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx
// function Bird({ ...props }) {
//   const speed = 0.75;
//   const factor = 0.25;
//   const url = '/Parrot.glb'
//   const { nodes, materials, animations } = useLoader(GLTFLoader, url);
//   const group = useRef();
//   const [mixer] = useState(() => new THREE.AnimationMixer());
//   useEffect(() => void mixer.clipAction(animations[0], group.current).play(), []);
//   useFrame((state, delta) => {
//     group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
//     mixer.update(delta * speed)
//   })
//   return (
//     <group ref={group} dispose={null} scale={[1, 1, 1]}>
//       {/* <scene name="Scene" {...props}> */}
//         <mesh
//           name="Object_0"
//           rotation={[1.5707964611537577, 0, 0]}
//           // morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
//           // morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
//           // geometry={nodes.Object_0.geometry}
//           material={materials.Material_0_COLOR_0}
//           {...nodes.Object_0}
//         />
//       {/* </scene> */}
//     </group>
//   )
// }


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
      rotation={[0.70, 0, 0]}
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

// function Sphere() {
//   return (
//     <mesh visible userData={{ test: "hello" }} position={[0, 0, 0]} castShadow>
//       <sphereGeometry attach="geometry" args={[1, 16, 16]} />
//       <meshStandardMaterial
//         attach="material"
//         color="white"
//         transparent
//         roughness={0.1}
//         metalness={0.1}
//       />
//     </mesh>
//   );
// }

// function Bread({ ...props }) {
//   const url = '/bread.glb'
//   const { nodes } = useLoader(GLTFLoader, url);
//   const group = useRef();

//   useFrame(() => (group.current.rotation.x = group.current.rotation.y += 0.01));


//   return (
//     <group ref={group} dispose={null}
//       position={[0, 0, 0]}
//       scale={[20, 20, 20]}
//       >
//       <scene name="Scene" {...props}>
//         <mesh
//           name="default1"
//           {...nodes.default1}
//           // onPointerDown={(e) => {
//           // }}
//           // onPointerMove={(e) => {
//           //   console.log('MOVE', e.clientX, e.clientY, e);
//           //   console.log('ROTATION', group.current.rotation.x, group.current.rotation.y);
//           //   group.current.rotation.x -= e.movementX / 100;
//           //   group.current.rotation.y -= e.movementY / 100;
//           // }}
//         />
//       </scene>
//     </group>
//   )
// }

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="App">
      <header className="App-header">Funny coding</header>
      <section>
        <Canvas colorManagement>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} isExpanded={isExpanded} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </section>

      <button onClick={() => (setIsExpanded(!isExpanded))}>EXPAND</button>
    </div>
  );
}

export default App;
