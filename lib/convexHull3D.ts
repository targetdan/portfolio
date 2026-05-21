export interface Vec3 { x: number; y: number; z: number }

export interface HullFace {
  verts: [number, number, number];
  normal: Vec3;
  d: number;
}

export type ContentSegment =
  | { type: 'text'; value: string }
  | { type: 'formula'; lines: string[] };

export interface AlgorithmStep {
  id: number;
  phase: 'init' | 'tetrahedron' | 'expand' | 'complete';
  title: string;
  content: ContentSegment[];
  faces: HullFace[];
  activeFaceIndices: number[];
  newFaceIndices: number[];
  highlightPoints: number[];
  activePoint: number | null;
  horizonEdges: [number, number][];
  previewEdges: [number, number][];
}

// Helpers for building content arrays
const txt = (value: string): ContentSegment => ({ type: 'text', value });
const fml = (...lines: string[]): ContentSegment => ({ type: 'formula', lines });

// Building survey point cloud -10 hull vertices (building envelope) + 6 interior scan points
export const DEMO_POINTS: Vec3[] = [
  // Base corners (z = 0)
  { x: -3, y: -5, z: 0 },   // 0
  { x:  3, y: -5, z: 0 },   // 1
  { x:  3, y:  5, z: 0 },   // 2
  { x: -3, y:  5, z: 0 },   // 3
  // Wall tops (z = 4)
  { x: -3, y: -5, z: 4 },   // 4
  { x:  3, y: -5, z: 4 },   // 5
  { x:  3, y:  5, z: 4 },   // 6
  { x: -3, y:  5, z: 4 },   // 7
  // Roof ridge (z = 7)
  { x:  0, y: -5, z: 7 },   // 8
  { x:  0, y:  5, z: 7 },   // 9
  // Interior scan points
  { x:  0, y:  0, z: 2 },   // 10
  { x:  1, y:  2, z: 3 },   // 11
  { x: -1, y: -2, z: 1 },   // 12
  { x:  0, y:  0, z: 5 },   // 13
  { x:  2, y: -3, z: 3 },   // 14
  { x: -2, y:  3, z: 2 },   // 15
];

const EPS = 1e-9;

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}
function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function lenSq(v: Vec3): number {
  return v.x * v.x + v.y * v.y + v.z * v.z;
}
function normalize(v: Vec3): Vec3 {
  const l = Math.sqrt(lenSq(v));
  return l < EPS ? { x: 0, y: 0, z: 1 } : { x: v.x / l, y: v.y / l, z: v.z / l };
}
function distSq(a: Vec3, b: Vec3): number {
  return lenSq(sub(a, b));
}
function signedDist(pt: Vec3, normal: Vec3, d: number): number {
  return dot(normal, pt) - d;
}

// Build a face with outward-pointing normal (interior is on the negative side)
function makeFace(pts: Vec3[], a: number, b: number, c: number, interior: Vec3): HullFace {
  const n = normalize(cross(sub(pts[b], pts[a]), sub(pts[c], pts[a])));
  const d = dot(n, pts[a]);
  if (signedDist(interior, n, d) > EPS) {
    // Flip the normal by reversing winding — swap b and c so directed edges stay consistent
    const flipped = { x: -n.x, y: -n.y, z: -n.z };
    return { verts: [a, c, b], normal: flipped, d: -d };
  }
  return { verts: [a, b, c], normal: n, d };
}

function getVisibleIndices(pt: Vec3, faces: HullFace[]): number[] {
  return faces
    .map((f, i) => (signedDist(pt, f.normal, f.d) > EPS ? i : -1))
    .filter((i) => i >= 0);
}

function getHorizon(faces: HullFace[], visibleSet: Set<number>): [number, number][] {
  const edgeToFace = new Map<string, number>();
  faces.forEach((f, i) => {
    const [a, b, c] = f.verts;
    edgeToFace.set(`${a}-${b}`, i);
    edgeToFace.set(`${b}-${c}`, i);
    edgeToFace.set(`${c}-${a}`, i);
  });
  const horizon: [number, number][] = [];
  Array.from(visibleSet).forEach((fi) => {
    const [a, b, c] = faces[fi].verts;
    ([[ a, b], [b, c], [c, a]] as [number, number][]).forEach(([u, v]) => {
      const adj = edgeToFace.get(`${v}-${u}`);
      if (adj !== undefined && !visibleSet.has(adj)) horizon.push([u, v]);
    });
  });
  return horizon;
}

function cloneFaces(faces: HullFace[]): HullFace[] {
  return faces.map((f) => ({ ...f, verts: [...f.verts] as [number, number, number] }));
}

export function generateSteps(points: Vec3[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let id = 0;
  const n = points.length;

  function push(
    phase: AlgorithmStep['phase'],
    title: string,
    content: ContentSegment[],
    faces: HullFace[],
    opts: Partial<Omit<AlgorithmStep, 'id' | 'phase' | 'title' | 'content' | 'faces'>> = {}
  ) {
    steps.push({
      id: id++,
      phase,
      title,
      content,
      faces: cloneFaces(faces),
      activeFaceIndices: opts.activeFaceIndices ?? [],
      newFaceIndices: opts.newFaceIndices ?? [],
      highlightPoints: opts.highlightPoints ?? [],
      activePoint: opts.activePoint ?? null,
      horizonEdges: opts.horizonEdges ?? [],
      previewEdges: opts.previewEdges ?? [],
    });
  }

  // ── Step 1: Extreme points ──────────────────────────────────────────────
  let minX = 0, maxX = 0, minY = 0, maxY = 0, minZ = 0, maxZ = 0;
  for (let i = 1; i < n; i++) {
    if (points[i].x < points[minX].x) minX = i;
    if (points[i].x > points[maxX].x) maxX = i;
    if (points[i].y < points[minY].y) minY = i;
    if (points[i].y > points[maxY].y) maxY = i;
    if (points[i].z < points[minZ].z) minZ = i;
    if (points[i].z > points[maxZ].z) maxZ = i;
  }
  const extremes = Array.from(new Set([minX, maxX, minY, maxY, minZ, maxZ]));

  push('init', 'Identify Extreme Points',
    [
      txt(`QuickHull begins by finding the six extreme points - minimum and maximum along each axis. The candidate set is:`),
      fml(
        'E = { argmin(P·x̂), argmax(P·x̂),',
        '      argmin(P·ŷ), argmax(P·ŷ),',
        '      argmin(P·ẑ), argmax(P·ẑ) }',
      ),
      txt(`These ${extremes.length} unique candidates are guaranteed hull vertices - no convex combination of other points can exceed them. From a LiDAR survey of ${n} points, this initial sweep runs in O(n) time and immediately eliminates most interior points from consideration.`),
    ],
    [], { highlightPoints: extremes });

  // ── Step 2: Initial edge ────────────────────────────────────────────────
  let maxDist = -1, p0 = extremes[0], p1 = extremes[1];
  for (let i = 0; i < extremes.length; i++)
    for (let j = i + 1; j < extremes.length; j++) {
      const d = distSq(points[extremes[i]], points[extremes[j]]);
      if (d > maxDist) { maxDist = d; p0 = extremes[i]; p1 = extremes[j]; }
    }

  push('init', 'Select Initial Edge',
    [
      txt(`The two most distant extreme points form the initial edge. Distance is computed using the Euclidean norm:`),
      fml('‖p − q‖ = √(Δx² + Δy² + Δz²)'),
      txt(`The pair with greatest separation is selected - where E is the set of extreme points from the previous step:`),
      fml(`(p${p0}, p${p1}) = argmax { ‖pᵢ − pⱼ‖ : pᵢ,pⱼ ∈ E }`),
      txt(`p${p0} and p${p1} are ${Math.sqrt(maxDist).toFixed(2)} units apart. Maximising this span improves efficiency by creating a large initial hull that captures more points early.`),
    ],
    [], { highlightPoints: [p0, p1], previewEdges: [[p0, p1]] });

  // ── Step 3: Initial triangle ────────────────────────────────────────────
  const lineDir = normalize(sub(points[p1], points[p0]));
  let maxPerp = -1, p2 = -1;
  for (let i = 0; i < n; i++) {
    if (i === p0 || i === p1) continue;
    const v = sub(points[i], points[p0]);
    const perp = lenSq(v) - dot(v, lineDir) ** 2;
    if (perp > maxPerp) { maxPerp = perp; p2 = i; }
  }

  push('tetrahedron', 'Form Initial Triangle',
    [
      txt(`The point most distant from the initial edge is found. Let d̂ be the unit edge direction and v the displacement from p${p0} to a candidate:`),
      fml(`d̂ = (p${p1} − p${p0}) / ‖p${p1} − p${p0}‖`, `v  = p − p${p0}`),
      txt(`The perpendicular distance is the component of v orthogonal to the edge direction:`),
      fml(`p${p2} = argmax_p { ‖v − (v · d̂) d̂‖ }`),
      txt(`p${p2} is ${Math.sqrt(maxPerp).toFixed(2)} units from the edge and forms the base triangle with p${p0} and p${p1}.`),
    ],
    [],
    { highlightPoints: [p0, p1, p2], previewEdges: [[p0, p1], [p1, p2], [p2, p0]] });

  // ── Step 4: Initial tetrahedron ─────────────────────────────────────────
  const triN = normalize(cross(sub(points[p1], points[p0]), sub(points[p2], points[p0])));
  const triD = dot(triN, points[p0]);
  let maxTriDist = -1, p3 = -1;
  for (let i = 0; i < n; i++) {
    if (i === p0 || i === p1 || i === p2) continue;
    const d = Math.abs(signedDist(points[i], triN, triD));
    if (d > maxTriDist) { maxTriDist = d; p3 = i; }
  }

  const centroid: Vec3 = {
    x: (points[p0].x + points[p1].x + points[p2].x + points[p3].x) / 4,
    y: (points[p0].y + points[p1].y + points[p2].y + points[p3].y) / 4,
    z: (points[p0].z + points[p1].z + points[p2].z + points[p3].z) / 4,
  };

  let faces: HullFace[] = [
    makeFace(points, p0, p1, p2, centroid),
    makeFace(points, p0, p1, p3, centroid),
    makeFace(points, p1, p2, p3, centroid),
    makeFace(points, p2, p0, p3, centroid),
  ];

  push('tetrahedron', 'Complete Initial Tetrahedron',
    [
      txt(`The base triangle's outward normal and plane constant are computed using the cross product:`),
      fml(`n = (p${p1} − p${p0}) × (p${p2} − p${p0})`, `n̂ = n / ‖n‖,   d = n̂ · p${p0}`),
      txt(`The point furthest from this plane completes the tetrahedron:`),
      fml(`p${p3} = argmax_p { |n̂ · p − d| }`),
      txt(`p${p3} is ${maxTriDist.toFixed(2)} units away. Each face normal is oriented outward using the tetrahedron centroid as a persistent interior reference - since the hull can only grow, this centroid remains inside all future hulls. This 4-face simplex is the core primitive used by Qhull (AutoCAD, MATLAB, SciPy).`),
    ],
    faces,
    { highlightPoints: [p0, p1, p2, p3], newFaceIndices: [0, 1, 2, 3] });

  // ── Step 5: Assign remaining points ────────────────────────────────────
  const processed = new Set([p0, p1, p2, p3]);
  const outsideSets = new Map<number, number[]>();

  for (let i = 0; i < n; i++) {
    if (processed.has(i)) continue;
    let bFace = -1, bDist = EPS;
    for (let fi = 0; fi < faces.length; fi++) {
      const d = signedDist(points[i], faces[fi].normal, faces[fi].d);
      if (d > bDist) { bDist = d; bFace = fi; }
    }
    if (bFace >= 0) {
      if (!outsideSets.has(bFace)) outsideSets.set(bFace, []);
      outsideSets.get(bFace)!.push(i);
    }
  }

  const outsideCount = Array.from(outsideSets.values()).flat().length;
  const interiorCount = n - 4 - outsideCount;

  push('expand', 'Classify Remaining Points',
    [
      txt(`Each of the remaining ${n - 4} points is tested against every face using the signed distance formula, where p is a survey point and F is a triangular face of the current hull:`),
      fml('dist(p, F) = n̂_F · p − d_F'),
      txt(`A positive result means p lies outside face F (on the same side as the outward normal). Each point is assigned to its most distant face:`),
      fml('assign(p) = argmax_F { dist(p, F) :', '  dist > 0 }'),
      txt(`${outsideCount} point${outsideCount !== 1 ? 's' : ''} are outside the tetrahedron and will drive hull expansion. ${interiorCount} ${interiorCount !== 1 ? 'are' : 'is'} already interior - confirmed as scan points within the building envelope and never able to appear on the hull surface.`),
    ],
    faces);

  // ── Expansion loop ──────────────────────────────────────────────────────
  while (true) {
    let bestFi = -1, bestPt = -1, bestDist = EPS;
    Array.from(outsideSets.entries()).forEach(([fi, pts]) => {
      pts.forEach((pi) => {
        const d = signedDist(points[pi], faces[fi].normal, faces[fi].d);
        if (d > bestDist) { bestDist = d; bestFi = fi; bestPt = pi; }
      });
    });
    if (bestFi < 0) break;

    const visIndices = getVisibleIndices(points[bestPt], faces);
    const visSet = new Set(visIndices);
    const horizon = getHorizon(faces, visSet);

    push('expand', `Expand: Visible Faces from p${bestPt}`,
      [
        txt(`p${bestPt} is ${bestDist.toFixed(2)} units outside the hull - the maximum across all outside points. A face is visible from p${bestPt} when the signed distance is positive:`),
        fml('dist(p, F) = n̂_F · p − d_F > 0'),
        txt(`This identifies ${visIndices.length} visible face${visIndices.length !== 1 ? 's' : ''} (shown in red), which are inconsistent with the expanded hull. The horizon is the set of edges that lie on the boundary between visible and non-visible faces:`),
        fml('horizon = { (pᵢ,pⱼ) :', '  F_ij visible, F_ji not visible }'),
        txt(`Here F_ij is the face containing the directed edge from pᵢ to pⱼ, and F_ji is the adjacent face sharing that edge in the opposite direction. When one is visible and the other is not, the edge (pᵢ,pⱼ) lies exactly on the silhouette of the hull as seen from p${bestPt}.${horizon.length > 0 ? ` This gives a closed loop of ${horizon.length} edge${horizon.length !== 1 ? 's' : ''}, shown in yellow.` : ''}`),
      ],
      faces,
      { activePoint: bestPt, activeFaceIndices: visIndices, horizonEdges: horizon });

    // Collect orphan points from visible faces
    const orphans: number[] = [];
    Array.from(visSet).forEach((fi) => {
      if (outsideSets.has(fi)) {
        orphans.push(...outsideSets.get(fi)!);
        outsideSets.delete(fi);
      }
    });

    // Remove visible faces (descending to preserve indices)
    const sortedVis = Array.from(visSet).sort((a, b) => b - a);
    sortedVis.forEach((fi) => {
      faces.splice(fi, 1);
      const remapped = new Map<number, number[]>();
      Array.from(outsideSets.entries()).forEach(([k, v]) => {
        remapped.set(k > fi ? k - 1 : k, v);
      });
      outsideSets.clear();
      Array.from(remapped.entries()).forEach(([k, v]) => outsideSets.set(k, v));
    });

    // Create new faces from horizon to new point
    const newStart = faces.length;
    horizon.forEach(([a, b]) => {
      faces.push(makeFace(points, a, b, bestPt, centroid));
    });
    processed.add(bestPt);
    const newFaceIndices = Array.from({ length: faces.length - newStart }, (_, i) => i + newStart);

    const titleSuffix = horizon.length > 0 ? ` - ${horizon.length} New Face${horizon.length !== 1 ? 's' : ''}` : '';
    const newFacesText = horizon.length > 0
      ? `${horizon.length} new face${horizon.length !== 1 ? 's' : ''} (green) replace the ${visIndices.length} removed visible face${visIndices.length !== 1 ? 's' : ''}.`
      : `The ${visIndices.length} visible face${visIndices.length !== 1 ? 's' : ''} ${visIndices.length !== 1 ? 'have' : 'has'} been removed from the hull.`;
    const vertexText = horizon.length > 0
      ? `p${bestPt} is now a confirmed hull vertex.`
      : `p${bestPt} was processed but produced no new faces — it was not added as a hull vertex.`;
    const orphansText = orphans.length > 0
      ? `${vertexText} The ${orphans.length} orphaned outside point${orphans.length !== 1 ? 's' : ''} are reassigned by re-evaluating the signed distance against all current faces, or reclassified as interior if no positive distance is found.`
      : `${vertexText} There are no orphaned outside points to reassign.`;

    push('expand', `p${bestPt} Incorporated${titleSuffix}`,
      [
        ...(horizon.length > 0 ? [
          txt(`Each horizon edge generates a new triangular face connected to p${bestPt}:`),
          fml('∀ (pᵢ, pⱼ) ∈ horizon:', '  F_new  = △(pᵢ, pⱼ, p_new)', '  n̂_new = norm((pⱼ−pᵢ) × (p_new−pᵢ))', '  d_new  = n̂_new · pᵢ'),
        ] : []),
        txt(`${newFacesText} ${orphansText}`),
      ],
      faces,
      { activePoint: bestPt, newFaceIndices });

    // Reassign orphans
    for (const pi of orphans) {
      if (pi === bestPt) continue;
      let bFace = -1, bDist = EPS;
      for (let fi = 0; fi < faces.length; fi++) {
        const d = signedDist(points[pi], faces[fi].normal, faces[fi].d);
        if (d > bDist) { bDist = d; bFace = fi; }
      }
      if (bFace >= 0) {
        if (!outsideSets.has(bFace)) outsideSets.set(bFace, []);
        outsideSets.get(bFace)!.push(pi);
      }
    }
  }

  // ── Final step ──────────────────────────────────────────────────────────
  const hullVerts = new Set(faces.flatMap((f) => Array.from(f.verts)));
  const finalInterior = n - hullVerts.size;

  push('complete', 'Convex Hull Complete',
    [
      txt(`The algorithm terminates when no face has any remaining outside points. The termination condition is:`),
      fml('∀ F ∈ faces, ∀ p ∈ P:', '  n̂_F · p − d_F ≤ 0'),
      txt(`The convex hull is a closed polyhedron of ${faces.length} triangular faces spanning ${hullVerts.size} vertices. ${finalInterior} of the original ${n} survey points are interior - confirmed as internal scan readings within the building envelope. In construction workflows, this hull defines the minimum enclosing volume for BIM clash detection, material quantity estimation, structural envelope analysis, and automated site boundary generation from drone or laser scan data.`),
    ],
    faces);

  return steps;
}
