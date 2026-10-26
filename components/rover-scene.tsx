"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type SubsystemKey = "locomotion" | "perception" | "manipulation";

/**
 * Drop an authentic model at /public/models/aegis.glb and set
 * NEXT_PUBLIC_ROVER_GLB=/models/aegis.glb to replace the conceptual assembly.
 * Until then this renders a schematic stand-in and the UI says so.
 */
const REAL_MODEL = process.env.NEXT_PUBLIC_ROVER_GLB ?? "";

const INK = "#1b2733";
const INK_DEEP = "#101820";
const STEEL = "#687580";
const LIME = "#b7f36b";
const LIME_TRACK = "#93c95a";
const LIME_DEEP = "#3f6b12";
const PAPER = "#f5f4ef";

type Props = {
  selected: SubsystemKey | null;
  onSelect: (key: SubsystemKey) => void;
  anchors: Record<SubsystemKey, [number, number, number]>;
};

export function RoverScene({ selected, onSelect, anchors }: Props) {
  return (
      <Canvas
        camera={{ position: [2.15, 1.5, 2.35], fov: 38 }}
        dpr={[1, 1.8]}
        shadows
        gl={{ antialias: true, alpha: false }}
        // The canvas is a supplement to the tablist, which carries the real
        // interaction. Screen readers use the tablist, so the canvas is hidden.
        aria-hidden="true"
        style={{ background: PAPER, touchAction: "pan-y" }}
      >
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 8, 16]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 6.5, 3.5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-4.5, 3.2, -3.5]} intensity={0.55} />
      <hemisphereLight args={[PAPER, "#c8ced3", 0.75]} />

      <Suspense fallback={null}>
        {REAL_MODEL ? (
          <RealModel url={REAL_MODEL} selected={selected} onSelect={onSelect} />
        ) : (
          <ConceptualRover selected={selected} onSelect={onSelect} />
        )}
      </Suspense>

      <Hotspots anchors={anchors} selected={selected} onSelect={onSelect} />

      {/* Shadow catcher: invisible except where the rover actually casts. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial transparent opacity={0.19} color={INK_DEEP} />
      </mesh>

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.9}
        maxDistance={5.4}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.15}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0.4, 0]}
      />
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
   Track band — a stadium ring with lugs and road wheels.
   Built from primitives so nothing is fetched at runtime.
   --------------------------------------------------------------------------- */

const TRACK_R = 0.165;
const TRACK_HALF_LEN = 0.56;
const TRACK_WIDTH = 0.26;
const TRACK_THICKNESS = 0.05;

type Lug = { y: number; z: number; ny: number; nz: number; rx: number };

/** Evenly spaced lugs around the stadium perimeter, with outward normals. */
function useLugs(halfLen: number, r: number, spacing: number): Lug[] {
  return useMemo(() => {
    const out: Lug[] = [];
    const nRun = Math.max(2, Math.round((2 * halfLen) / spacing));
    const nCap = Math.max(3, Math.round((Math.PI * r) / spacing));

    // top run, y = +r
    for (let i = 0; i < nRun; i++) {
      out.push({
        y: r,
        z: -halfLen + (i / nRun) * 2 * halfLen,
        ny: 1,
        nz: 0,
        rx: 0,
      });
    }
    // front cap, theta from +90deg down to -90deg
    for (let i = 0; i < nCap; i++) {
      const th = Math.PI / 2 - (i / nCap) * Math.PI;
      out.push({
        y: r * Math.sin(th),
        z: halfLen + r * Math.cos(th),
        ny: Math.sin(th),
        nz: Math.cos(th),
        rx: Math.PI / 2 - th,
      });
    }
    // bottom run, y = -r
    for (let i = 0; i < nRun; i++) {
      out.push({
        y: -r,
        z: halfLen - (i / nRun) * 2 * halfLen,
        ny: -1,
        nz: 0,
        rx: Math.PI,
      });
    }
    // rear cap, theta from -90deg down to -270deg
    for (let i = 0; i < nCap; i++) {
      const th = -Math.PI / 2 - (i / nCap) * Math.PI;
      out.push({
        y: r * Math.sin(th),
        z: -halfLen + r * Math.cos(th),
        ny: Math.sin(th),
        nz: Math.cos(th),
        rx: Math.PI / 2 - th,
      });
    }
    return out;
  }, [halfLen, r, spacing]);
}

/** A hollow stadium band: outer profile minus inner profile, extruded. */
function useBandGeometry(halfLen: number, r: number, thickness: number, width: number) {
  return useMemo(() => {
    const outer = new THREE.Shape();
    outer.moveTo(-halfLen, r);
    outer.lineTo(halfLen, r);
    outer.absarc(halfLen, 0, r, Math.PI / 2, -Math.PI / 2, true);
    outer.lineTo(-halfLen, -r);
    outer.absarc(-halfLen, 0, r, -Math.PI / 2, -Math.PI * 1.5, true);
    outer.closePath();

    const ri = r - thickness;
    const inner = new THREE.Path();
    inner.moveTo(halfLen, ri);
    inner.lineTo(-halfLen, ri);
    inner.absarc(-halfLen, 0, ri, Math.PI / 2, Math.PI * 1.5, false);
    inner.lineTo(halfLen, -ri);
    inner.absarc(halfLen, 0, ri, -Math.PI / 2, Math.PI / 2, false);
    inner.closePath();
    outer.holes.push(inner);

    const geo = new THREE.ExtrudeGeometry(outer, {
      depth: width,
      bevelEnabled: false,
      curveSegments: 16,
    });
    // centre on the width axis, then turn the extrusion onto world X
    geo.translate(0, 0, -width / 2);
    geo.rotateY(Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  }, [halfLen, r, thickness, width]);
}

function TrackBand({
  halfLen,
  r,
  width,
  thickness,
  active,
  wheels = true,
}: {
  halfLen: number;
  r: number;
  width: number;
  thickness: number;
  active: boolean;
  wheels?: boolean;
}) {
  const geo = useBandGeometry(halfLen, r, thickness, width);
  const lugs = useLugs(halfLen, r, Math.max(0.036, r * 0.24));
  const ri = r - thickness;

  const lugDepth = Math.min(0.05, thickness * 1.1);
  const lugOut = 0.005;

  const wheelZs = useMemo(() => {
    const n = Math.max(2, Math.round((2 * halfLen) / (r * 1.05)));
    return Array.from({ length: n }, (_, i) => -halfLen + ((i + 0.5) / n) * 2 * halfLen);
  }, [halfLen, r]);

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial
          color={active ? "#33424f" : "#2a3641"}
          roughness={0.88}
          metalness={0.06}
        />
      </mesh>

      {lugs.map((l, i) => (
        <mesh
          key={i}
          position={[0, l.y + l.ny * lugOut, l.z + l.nz * lugOut]}
          rotation={[l.rx, 0, 0]}
          castShadow
        >
          <boxGeometry args={[width * 0.58, lugDepth * 0.4, 0.026]} />
          <meshStandardMaterial
            color={active ? LIME_TRACK : "#46545f"}
            roughness={0.92}
            metalness={0.02}
          />
        </mesh>
      ))}

      {wheels
        ? wheelZs.map((z) => (
            <mesh
              key={z}
              position={[0, 0, z]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <cylinderGeometry args={[ri * 0.86, ri * 0.86, width * 0.62, 20]} />
              <meshStandardMaterial
                color={STEEL}
                roughness={0.42}
                metalness={0.55}
              />
            </mesh>
          ))
        : null}

      {/* end sprockets */}
      {wheels
        ? [halfLen, -halfLen].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[ri * 0.72, ri * 0.72, width * 0.7, 14]} />
              <meshStandardMaterial color="#4d5a66" roughness={0.5} metalness={0.45} />
            </mesh>
          ))
        : null}
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Conceptual assembly — primitives, not a claim about the real platform
   --------------------------------------------------------------------------- */

function ConceptualRover({
  selected,
  onSelect,
}: {
  selected: SubsystemKey | null;
  onSelect: (k: SubsystemKey) => void;
}) {
  const is = (key: SubsystemKey) => selected === key;
  const cursor = (on: boolean) => {
    document.body.style.cursor = on ? "pointer" : "auto";
  };

  return (
    <group position={[0, 0, 0]}>
      {/* ---- locomotion ---- */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect("locomotion");
        }}
        onPointerOver={() => cursor(true)}
        onPointerOut={() => cursor(false)}
      >
        {[-0.66, 0.66].map((x) => (
          <group key={x} position={[x, 0.19, 0]}>
            <TrackBand
              halfLen={TRACK_HALF_LEN}
              r={TRACK_R}
              width={TRACK_WIDTH}
              thickness={TRACK_THICKNESS}
              active={is("locomotion")}
            />
          </group>
        ))}

        {/* articulated flippers, hinged at each track's end cap */}
        {[-0.66, 0.66].map((x) =>
          [
            { z: TRACK_HALF_LEN, flip: 0, tilt: -0.34, id: "f" },
            { z: -TRACK_HALF_LEN, flip: Math.PI, tilt: -0.34, id: "r" },
          ].map(({ z, flip, tilt, id }) => (
            <group key={`${x}-${id}`} position={[x, 0.19, z]}>
              <group rotation={[0, flip, 0]}>
                <group rotation={[tilt, 0, 0]}>
                  {/* hinge arm — overlaps the track cap so the joint reads */}
                  <mesh position={[0, 0, 0.075]} castShadow>
                    <boxGeometry args={[TRACK_WIDTH * 0.62, 0.075, 0.2]} />
                    <meshStandardMaterial
                      color={is("locomotion") ? "#7fae4b" : STEEL}
                      roughness={0.68}
                      metalness={0.2}
                    />
                  </mesh>
                  <mesh position={[0, 0, 0.005]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.032, 0.032, TRACK_WIDTH * 0.7, 12]} />
                    <meshStandardMaterial color={INK} roughness={0.6} />
                  </mesh>
                  <group position={[0, 0, 0.185]}>
                    <TrackBand
                      halfLen={0.045}
                      r={0.122}
                      width={TRACK_WIDTH * 0.82}
                      thickness={0.04}
                      active={is("locomotion")}
                      wheels={false}
                    />
                  </group>
                </group>
              </group>
            </group>
          ))
        )}
      </group>

      {/* ---- chassis deck ---- */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.24, 1.3]} />
        <meshStandardMaterial color={INK} roughness={0.72} metalness={0.14} />
      </mesh>
      <mesh position={[0, 0.555, 0]} castShadow>
        <boxGeometry args={[0.98, 0.03, 1.16]} />
        <meshStandardMaterial color={STEEL} roughness={0.58} metalness={0.32} />
      </mesh>
      {/* deck ribs */}
      {[-0.34, 0, 0.34].map((z) => (
        <mesh key={z} position={[0, 0.578, z]}>
          <boxGeometry args={[0.92, 0.016, 0.045]} />
          <meshStandardMaterial color="#4a5762" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* ---- perception mast ---- */}
      <group
        position={[0, 0.62, 0.3]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("perception");
        }}
        onPointerOver={() => cursor(true)}
        onPointerOut={() => cursor(false)}
      >
        <mesh position={[0, 0.17, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.042, 0.34, 12]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.4} />
        </mesh>
        {/* LiDAR puck */}
        <mesh position={[0, 0.375, 0]} castShadow>
          <cylinderGeometry args={[0.105, 0.105, 0.095, 28]} />
          <meshStandardMaterial
            color={is("perception") ? LIME : INK}
            roughness={0.34}
            metalness={0.38}
          />
        </mesh>
        <mesh position={[0, 0.428, 0]}>
          <cylinderGeometry args={[0.098, 0.098, 0.012, 28]} />
          <meshStandardMaterial color={STEEL} roughness={0.35} metalness={0.5} />
        </mesh>
        {/* depth camera */}
        <mesh position={[0, 0.225, 0.095]} castShadow>
          <boxGeometry args={[0.16, 0.085, 0.055]} />
          <meshStandardMaterial
            color={is("perception") ? LIME : "#2c3a47"}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0, 0.225, 0.126]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color="#8fa3b3" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>

      {/* ---- 6-DOF arm ---- */}
      <group
        position={[0.3, 0.58, -0.4]}
        rotation={[0, 0.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("manipulation");
        }}
        onPointerOver={() => cursor(true)}
        onPointerOut={() => cursor(false)}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.125, 0.145, 0.105, 22]} />
          <meshStandardMaterial color={STEEL} roughness={0.5} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.135, 0]} castShadow>
          <sphereGeometry args={[0.082, 18, 18]} />
          <meshStandardMaterial color={INK} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.31, 0.058]} rotation={[0.36, 0, 0]} castShadow>
          <boxGeometry args={[0.072, 0.39, 0.072]} />
          <meshStandardMaterial
            color={is("manipulation") ? LIME : "#33424f"}
            roughness={0.55}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.487, 0.166]} castShadow>
          <sphereGeometry args={[0.068, 18, 18]} />
          <meshStandardMaterial color={INK} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.612, 0.322]} rotation={[1.15, 0, 0]} castShadow>
          <boxGeometry args={[0.058, 0.35, 0.058]} />
          <meshStandardMaterial
            color={is("manipulation") ? LIME : "#33424f"}
            roughness={0.55}
            metalness={0.3}
          />
        </mesh>
        <group position={[0, 0.645, 0.492]} rotation={[0.35, 0, 0]}>
          <mesh position={[0, 0.066, 0]}>
            <boxGeometry args={[0.132, 0.036, 0.048]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
          {[-0.048, 0.048].map((x) => (
            <mesh key={x} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[0.028, 0.115, 0.028]} />
              <meshStandardMaterial color={STEEL} metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Real model — used only when NEXT_PUBLIC_ROVER_GLB is set
   --------------------------------------------------------------------------- */

function RealModel({
  url,
  onSelect,
}: {
  url: string;
  selected: SubsystemKey | null;
  onSelect: (k: SubsystemKey) => void;
}) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <group ref={group} onClick={() => onSelect("locomotion")}>
      <primitive object={cloned} />
    </group>
  );
}

/* ---------------------------------------------------------------------------
   Hotspots — 3D numbered markers with leader lines.

   These are meshes, not DOM portals. drei's <Html> mounts a React root into
   the canvas parent and races React 19 during unmount; drawing the numeral
   into a canvas texture keeps everything inside the render loop.
   --------------------------------------------------------------------------- */

const ORDER: SubsystemKey[] = ["locomotion", "perception", "manipulation"];

/** Where each marker floats, clear of the geometry it annotates. */
const MARKER_AT: Record<SubsystemKey, [number, number, number]> = {
  locomotion: [1.02, 0.1, 0.74],
  perception: [0.4, 1.34, 0.54],
  manipulation: [0.88, 1.38, -0.36],
};

function useNumberTexture(n: number, active: boolean) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 9, 0, Math.PI * 2);
    ctx.fillStyle = active ? LIME : PAPER;
    ctx.fill();
    ctx.lineWidth = 11;
    ctx.strokeStyle = active ? LIME_DEEP : STEEL;
    ctx.stroke();

    ctx.fillStyle = INK_DEEP;
    ctx.font =
      "600 126px Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), size / 2, size / 2 + 8);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [n, active]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

function Marker({
  index,
  active,
  onClick,
}: {
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const texture = useNumberTexture(index + 1, active);

  const setCursor = (on: boolean) => {
    document.body.style.cursor = on ? "pointer" : "auto";
  };

  return (
    <Billboard>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setCursor(true);
        }}
        onPointerOut={() => setCursor(false)}
        scale={active ? 1.14 : 1}
        renderOrder={4}
      >
        <circleGeometry args={[0.082, 40]} />
        <meshBasicMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : LIME}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}

function Leader({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    return {
      position: a.add(b).multiplyScalar(0.5),
      quaternion: quat,
      length: len,
    };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} renderOrder={1}>
      <cylinderGeometry args={[0.0035, 0.0035, length, 6]} />
      <meshBasicMaterial color={STEEL} transparent opacity={0.75} />
    </mesh>
  );
}

function Hotspots({
  anchors,
  selected,
  onSelect,
}: {
  anchors: Record<SubsystemKey, [number, number, number]>;
  selected: SubsystemKey | null;
  onSelect: (k: SubsystemKey) => void;
}) {
  return (
    <group>
      {ORDER.map((key, i) => (
        <group key={key}>
          <Leader from={anchors[key]} to={MARKER_AT[key]} />
          <group position={MARKER_AT[key]}>
            <Marker
              index={i}
              active={selected === key}
              onClick={() => onSelect(key)}
            />
          </group>
          {selected === key ? (
            <mesh position={anchors[key]}>
              <sphereGeometry args={[0.032, 16, 16]} />
              <meshBasicMaterial color={LIME} toneMapped={false} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}
