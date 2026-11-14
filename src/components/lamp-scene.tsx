"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { kelvinToHex, type Finish, type Shape } from "@/lib/catalog";

type LampProps = { shape: Shape; finish: Finish; on: boolean; kelvin: number };

function Metal({ f }: { f: Finish }) {
  return <meshStandardMaterial color={f.color} metalness={f.metal} roughness={f.rough} />;
}

function Bulb({ on, color, position, radius = 0.12, power = 6 }: { on: boolean; color: string; position: [number, number, number]; radius?: number; power?: number }) {
  const light = useRef<THREE.PointLight>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  // ease intensity so the switch fades instead of popping
  useFrame((_, dt) => {
    const target = on ? 1 : 0;
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, target * power, 8, dt);
    if (mat.current) mat.current.emissiveIntensity = THREE.MathUtils.damp(mat.current.emissiveIntensity, target * 3, 8, dt);
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial ref={mat} color="#fff8ee" emissive={color} emissiveIntensity={on ? 3 : 0} roughness={0.2} />
      </mesh>
      <pointLight ref={light} color={color} intensity={on ? power : 0} distance={8} decay={1.6} castShadow />
    </group>
  );
}

/** Downward cone of light + a round table that catches it (pendant only). */
function Pool({ on, color }: { on: boolean; color: string }) {
  const spot = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    if (spot.current) spot.current.intensity = THREE.MathUtils.damp(spot.current.intensity, on ? 40 : 0, 8, dt);
  });
  return (
    <>
      <primitive object={target} position={[0, -2.2, 0]} />
      <spotLight ref={spot} position={[0, -0.25, 0]} target={target} color={color} angle={0.75} penumbra={0.8} distance={6} decay={1.4} castShadow />
      <mesh position={[0, -1.45, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 64]} />
        <meshStandardMaterial color="#3a2e24" roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.83, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.75, 24]} />
        <meshStandardMaterial color="#2a221b" roughness={0.6} />
      </mesh>
    </>
  );
}

function lathe(points: [number, number][]) {
  const curve = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)));
  return new THREE.LatheGeometry(curve.getPoints(48), 96);
}

function Lamp({ shape, finish, on, kelvin }: LampProps) {
  const color = kelvinToHex(kelvin);
  const shade = useMemo(() => lathe([[0.02, 0], [0.18, 0.02], [0.42, -0.22], [0.62, -0.62], [0.64, -0.66]]), []);
  const deskShade = useMemo(() => lathe([[0.03, 0], [0.1, 0], [0.28, -0.3], [0.3, -0.34]]), []);
  const arcCurve = useMemo(() => new THREE.CubicBezierCurve3(new THREE.Vector3(-0.9, 0.1, 0), new THREE.Vector3(-0.9, 3.4, 0), new THREE.Vector3(0.9, 3.4, 0), new THREE.Vector3(1.0, 2.35, 0)), []);
  const glass = <meshPhysicalMaterial color="#fffaf2" transmission={0.6} roughness={0.35} thickness={0.4} emissive={color} emissiveIntensity={on ? 0.9 : 0} />;

  if (shape === "pendant") return (
    <group position={[0, 2.2, 0]}>
      <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.012, 0.012, 1.6]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh geometry={shade} castShadow><Metal f={finish} /></mesh>
      <mesh geometry={shade} scale={0.985}><meshStandardMaterial color="#f4efe6" side={THREE.BackSide} emissive={color} emissiveIntensity={on ? 0.25 : 0} /></mesh>
      <Bulb on={on} color={color} position={[0, -0.3, 0]} power={9} />
      <Pool on={on} color={color} />
    </group>
  );

  if (shape === "desk") return (
    <group>
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow><cylinderGeometry args={[0.38, 0.42, 0.08, 48]} /><Metal f={finish} /></mesh>
      <group position={[0, 0.08, 0]} rotation={[0, 0, -0.35]}>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.025, 0.025, 1.3]} /><Metal f={finish} /></mesh>
        <group position={[0, 1.3, 0]} rotation={[0, 0, 1.55]}>
          <mesh position={[0, 0.55, 0]} castShadow><cylinderGeometry args={[0.022, 0.022, 1.1]} /><Metal f={finish} /></mesh>
          <group position={[0, 1.1, 0]} rotation={[0, 0, 0.9]}>
            <mesh geometry={deskShade} castShadow><Metal f={finish} /></mesh>
            <Bulb on={on} color={color} position={[0, -0.18, 0]} radius={0.08} power={5} />
          </group>
        </group>
      </group>
    </group>
  );

  if (shape === "arc") return (
    <group position={[-0.1, 0, 0]}>
      <mesh position={[-0.9, 0.06, 0]} castShadow receiveShadow><boxGeometry args={[0.5, 0.12, 0.5]} /><meshStandardMaterial color="#e9e6e1" roughness={0.25} /></mesh>
      <mesh castShadow><tubeGeometry args={[arcCurve, 96, 0.025, 12]} /><Metal f={finish} /></mesh>
      <mesh position={[1.0, 2.1, 0]}>{<sphereGeometry args={[0.28, 48, 48]} />}{glass}</mesh>
      <Bulb on={on} color={color} position={[1.0, 2.1, 0]} radius={0.07} power={8} />
    </group>
  );

  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow><cylinderGeometry args={[0.32, 0.36, 0.18, 48]} /><Metal f={finish} /></mesh>
      <mesh position={[0, 0.7, 0]}>{<sphereGeometry args={[0.55, 64, 64]} />}{glass}</mesh>
      <Bulb on={on} color={color} position={[0, 0.7, 0]} radius={0.1} power={5} />
    </group>
  );
}

/** Widens the vertical FOV on portrait screens so tall lamps stay in frame. */
function ResponsiveFov() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    // R3F idiom: the camera is a mutable three.js object, not React state
    // eslint-disable-next-line react-hooks/immutability
    cam.fov = aspect < 1 ? Math.min(62, 38 / Math.max(aspect, 0.55) * 0.85) : 38;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Room({ on }: { on: boolean }) {
  return (
    <>
      <ambientLight intensity={on ? 0.08 : 0.22} />
      <directionalLight position={[3, 5, 4]} intensity={on ? 0.15 : 0.5} color="#cdd6ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#1b1814" roughness={0.9} />
      </mesh>
      <ContactShadows frames={1} resolution={256} position={[0, 0.005, 0]} opacity={0.55} scale={6} blur={2.4} far={3} color="#000" />
    </>
  );
}

export default function LampScene({ shape, finish, on, kelvin, interactive = true, paused = false, className = "" }: LampProps & { interactive?: boolean; paused?: boolean; className?: string }) {
  const cam: Record<Shape, [number, number, number]> = { pendant: [0, 1.25, 4.4], desk: [1.4, 1.7, 4.4], arc: [0, 2.2, 5.6], globe: [0, 1.2, 3] };
  const target: Record<Shape, [number, number, number]> = { pendant: [0, 1.25, 0], desk: [0, 1.1, 0], arc: [0, 1.5, 0], globe: [0, 0.6, 0] };
  return (
    <Canvas frameloop={paused ? "never" : "always"} dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: cam[shape], fov: 38 }} className={className} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      aria-label={`Modelo 3D da luminária, ${on ? "acesa" : "apagada"}`} role="img">
      <color attach="background" args={["#0f0d0b"]} />
      <fog attach="fog" args={["#0f0d0b", 6, 12]} />
      <ResponsiveFov />
      <Room on={on} />
      <Lamp shape={shape} finish={finish} on={on} kelvin={kelvin} />
      <OrbitControls target={target[shape]} enablePan={false} enableZoom={interactive} enableRotate={interactive} minDistance={2.2} maxDistance={8}
        minPolarAngle={0.3} maxPolarAngle={Math.PI / 2.05} autoRotate={!interactive} autoRotateSpeed={0.6} />
    </Canvas>
  );
}
