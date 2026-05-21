"use client";
import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { AlgorithmStep, Vec3 } from "@/lib/convexHull3D";

// Convert from Z-up (our coordinate system) to Y-up (Three.js)
function toThree(p: Vec3): [number, number, number] {
  return [p.x, p.z, p.y];
}

function buildFaceGeometry(faces: AlgorithmStep["faces"], indices: number[], pts: Vec3[]) {
  const positions: number[] = [];
  const normals: number[] = [];
  for (const fi of indices) {
    const f = faces[fi];
    if (!f) continue;
    for (const vi of f.verts) {
      const p = pts[vi];
      positions.push(p.x, p.z, p.y);
    }
    const n = f.normal;
    for (let i = 0; i < 3; i++) normals.push(n.x, n.z, n.y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return geo;
}

function buildLineGeometry(edges: [number, number][], pts: Vec3[]) {
  const positions: number[] = [];
  for (const [a, b] of edges) {
    const pa = pts[a], pb = pts[b];
    positions.push(pa.x, pa.z, pa.y, pb.x, pb.z, pb.y);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geo;
}

function buildHullEdges(faces: AlgorithmStep["faces"], pts: Vec3[]) {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (const f of faces) {
    const [a, b, c] = f.verts;
    for (const [u, v] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!seen.has(key)) { seen.add(key); edges.push([u, v]); }
    }
  }
  return buildLineGeometry(edges, pts);
}

function Scene({ step, points }: { step: AlgorithmStep; points: Vec3[] }) {
  const activeSet = useMemo(() => new Set(step.activeFaceIndices), [step.activeFaceIndices]);
  const newSet = useMemo(() => new Set(step.newFaceIndices), [step.newFaceIndices]);

  const normalIndices = useMemo(
    () => step.faces.map((_, i) => i).filter((i) => !activeSet.has(i) && !newSet.has(i)),
    [step.faces, activeSet, newSet]
  );

  const normalGeo = useMemo(() => buildFaceGeometry(step.faces, normalIndices, points), [step.faces, normalIndices, points]);
  const activeGeo = useMemo(() => buildFaceGeometry(step.faces, step.activeFaceIndices, points), [step.faces, step.activeFaceIndices, points]);
  const newGeo = useMemo(() => buildFaceGeometry(step.faces, step.newFaceIndices, points), [step.faces, step.newFaceIndices, points]);
  const hullEdgeGeo = useMemo(() => buildHullEdges(step.faces, points), [step.faces, points]);
  const horizonGeo = useMemo(() => buildLineGeometry(step.horizonEdges, points), [step.horizonEdges, points]);
  const previewGeo = useMemo(() => buildLineGeometry(step.previewEdges, points), [step.previewEdges, points]);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[10, 20, 10]} intensity={0.9} />
      <pointLight position={[-8, 8, -8]} intensity={0.4} color="#3b82f6" />

      <OrbitControls enableDamping dampingFactor={0.06} minDistance={5} maxDistance={50} />

      {/* Ground grid */}
      <gridHelper args={[24, 24, "#0f2040", "#0a1830"]} position={[0, -0.05, 0]} />

      {/* Hull faces */}
      {normalIndices.length > 0 && (
        <mesh geometry={normalGeo} renderOrder={1}>
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
      {step.activeFaceIndices.length > 0 && (
        <mesh geometry={activeGeo} renderOrder={2}>
          <meshStandardMaterial color="#ef4444" transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
      {step.newFaceIndices.length > 0 && (
        <mesh geometry={newGeo} renderOrder={2}>
          <meshStandardMaterial color="#10b981" transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {/* Edges */}
      {step.faces.length > 0 && (
        <lineSegments geometry={hullEdgeGeo} renderOrder={3}>
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.55} />
        </lineSegments>
      )}
      {step.horizonEdges.length > 0 && (
        <lineSegments geometry={horizonGeo} renderOrder={4}>
          <lineBasicMaterial color="#fbbf24" />
        </lineSegments>
      )}
      {step.previewEdges.length > 0 && (
        <lineSegments geometry={previewGeo} renderOrder={3}>
          <lineBasicMaterial color="#22d3ee" transparent opacity={0.7} />
        </lineSegments>
      )}

      {/* Points */}
      {points.map((pt, i) => {
        const isActive = step.activePoint === i;
        const isHighlighted = step.highlightPoints.includes(i);
        const showLabel = isActive || isHighlighted;
        const color = isActive ? "#f97316" : isHighlighted ? "#22d3ee" : "#475569";
        const size = isActive ? 0.22 : isHighlighted ? 0.16 : 0.1;
        const emissive = isActive ? "#f97316" : isHighlighted ? "#0e7490" : "#000000";
        const labelBg = isActive ? "rgba(249,115,22,0.15)" : "rgba(34,211,238,0.1)";
        const labelBorder = isActive ? "rgba(249,115,22,0.6)" : "rgba(34,211,238,0.45)";
        const labelColor = isActive ? "#fed7aa" : "#a5f3fc";
        const pos = toThree(pt);
        return (
          <group key={i} position={pos}>
            <mesh renderOrder={5}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} />
            </mesh>
            {showLabel && (
              <Html
                position={[0, size + 0.35, 0]}
                center
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{
                  display: "inline-block",
                  background: labelBg,
                  border: `1px solid ${labelBorder}`,
                  color: labelColor,
                  fontSize: "10px",
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 600,
                  padding: "1px 5px",
                  borderRadius: "4px",
                  backdropFilter: "blur(4px)",
                }}>
                  p{i}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

export default function ConvexHullScene({ step, points }: { step: AlgorithmStep; points: Vec3[] }) {
  return (
    <Canvas
      camera={{ position: [20, 16, 22], fov: 40, near: 0.1, far: 200 }}
      style={{ background: "#060d1a", height: "900px", width: "100%" }}
      gl={{ antialias: true, alpha: false }}
    >
      <Scene step={step} points={points} />
    </Canvas>
  );
}
