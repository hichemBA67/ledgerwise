"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {
  EDGE_KINDS,
  GROUPS,
  LAYERS,
  RELATION_LABEL,
  SOURCES,
  edges,
  entities,
  flows,
  groupOf,
  type EdgeKind,
  type Rl1Entity,
  type Rl1Layer,
} from "@/content/rl1";
import { categoryLabel, universe, universeSources } from "@/content/universe";
import { CATEGORIES, CATEGORY_BY_ID, FIT_LABEL, type UCategory, type URecord } from "@/content/universe-taxonomy";
import { PlayerLogo } from "../PlayerLogo";
import { cssVar, groupColor, groupVar, isDarkMode, onThemeChange, useWebGL } from "./theme";

const byId = Object.fromEntries(entities.map((e) => [e.id, e])) as Record<string, Rl1Entity>;
const STACK = LAYERS.map((l) => l.id);
const layerIndex = Object.fromEntries(STACK.map((l, i) => [l, i])) as Record<Rl1Layer, number>;
/** Universe institutions with no detailed RL1 record, drawn as a point cloud around each plane's core rings. */
const DUST: URecord[] = universe.filter((r) => !r.core);
const DUST_R0 = 38;
const DUST_AREA = 4.4;
const FIT_RANK = { high: 0, medium: 1, low: 2, na: 3 } as const;
const dustByLayer = STACK.map((l) =>
  DUST.filter((r) => r.layer === l).sort((a, b) => FIT_RANK[a.fit] - FIT_RANK[b.fit] || a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name)),
);
const MAX_R = Math.max(34, ...dustByLayer.map((list) => Math.sqrt(DUST_R0 ** 2 + (list.length * DUST_AREA) / Math.PI)));
const PLANE = Math.ceil(2 * MAX_R + 10);
const dustIndex = new Map(DUST.map((r, i) => [r.id, i]));
const DEFAULT_GAP = 11;
/** Entities whose label stays visible at any zoom. */
const ALWAYS_LABEL = new Set(entities.filter((e) => ["platform", "founding", "joining", "operator"].includes(e.rel)).map((e) => e.id));
const ASAP_ORDER = ["Access", "Service", "Asset", "Platform", "Governance"] as const;

type Slot = { key: string; id: string; layer: Rl1Layer; ghost: boolean };

const SLOTS: Slot[] = entities.flatMap((e) => [
  { key: `${e.id}@${e.layer}`, id: e.id, layer: e.layer, ghost: false },
  ...(e.alsoIn ?? []).map((l) => ({ key: `${e.id}@${l}`, id: e.id, layer: l, ghost: true })),
]);
const slotsById = new Map<string, Slot[]>();
for (const s of SLOTS) slotsById.set(s.id, [...(slotsById.get(s.id) ?? []), s]);

function layout(gap: number) {
  const pos: Record<string, THREE.Vector3> = {};
  const rank = (s: Slot) => GROUPS.findIndex((g) => g.id === groupOf(byId[s.id]));
  const order = (a: Slot, b: Slot) => rank(a) - rank(b) || Number(a.ghost) - Number(b.ghost) || byId[a.id].name.localeCompare(byId[b.id].name);
  STACK.forEach((layer, li) => {
    const y = li * gap;
    const items = SLOTS.filter((s) => s.layer === layer).sort(order);
    const ring = (list: Slot[], r: number, offset: number) =>
      list.forEach((s, i) => {
        const a = offset + (i / list.length) * Math.PI * 2;
        pos[s.key] = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      });
    if (layer === "platform-ledger") {
      pos["rl1@platform-ledger"] = new THREE.Vector3(0, y, 0);
      ring(items.filter((s) => s.id !== "rl1"), 24, 0.2);
    } else if (layer === "access-participants") {
      const members = items.filter((s) => ["founding", "joining"].includes(byId[s.id].rel));
      const prospects = items.filter((s) => byId[s.id].rel === "prospect");
      ring(members, 12, 0.15);
      ring(items.filter((s) => !members.includes(s) && !prospects.includes(s)), 22, 0.05);
      ring(prospects, 32, 0);
    } else {
      ring(items, Math.max(10, Math.min(28, items.length * 2.4)), li * 0.45);
    }
  });
  // Sunflower spiral outside the core rings, highest membership fit innermost.
  const dust: THREE.Vector3[] = new Array(DUST.length);
  dustByLayer.forEach((list, li) =>
    list.forEach((r, i) => {
      const rad = Math.sqrt(DUST_R0 ** 2 + ((i + 0.5) * DUST_AREA) / Math.PI);
      const a = i * 2.399963 + li;
      dust[dustIndex.get(r.id)!] = new THREE.Vector3(Math.cos(a) * rad, li * gap + 0.35, Math.sin(a) * rad);
    }),
  );
  return { pos, dust };
}

/** Of all positions (primary + ghosts) of two entities, the pair closest in height, so links stay short. */
function bestPair(a: string, b: string): [string, string] | null {
  let best: [string, string] | null = null;
  let bestD = Infinity;
  for (const x of slotsById.get(a) ?? [])
    for (const y of slotsById.get(b) ?? []) {
      const d = Math.abs(layerIndex[x.layer] - layerIndex[y.layer]) * 10 + (x.ghost ? 1 : 0) + (y.ghost ? 1 : 0);
      if (d < bestD) {
        bestD = d;
        best = [x.key, y.key];
      }
    }
  return best;
}

function curveBetween(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  if (Math.abs(a.y - b.y) < 0.01) mid.y += 2.5 + a.distanceTo(b) * 0.14;
  else mid.multiplyScalar(1.1).setY(mid.y);
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

function dispose(group: THREE.Object3D) {
  group.traverse((o) => {
    if (o instanceof THREE.Mesh || o instanceof THREE.Line) {
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    }
    if (o instanceof CSS2DObject) o.element.remove();
  });
  group.clear();
}

type NodeRef = { slot: Slot; mesh: THREE.Mesh; ring?: THREE.Mesh; label: HTMLDivElement; far: boolean };
type Ctx = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  content: THREE.Group;
  flowGroup: THREE.Group;
  nodes: Map<string, NodeRef>;
  lines: { kind: EdgeKind; from: string; to: string; line: THREE.Line; identity?: boolean }[];
  planes: { layer: Rl1Layer; mesh: THREE.Mesh; outline: THREE.LineSegments; label: CSS2DObject }[];
  dust: THREE.InstancedMesh | null;
  dustPos: THREE.Vector3[];
  particles: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; seg: number }[];
  fly: { target: THREE.Vector3; cam: THREE.Vector3 } | null;
  allLabels: boolean;
  gap: number;
};

const HOME_DIR = new THREE.Vector3(70, 52, 96).normalize();

/** Camera pose that fits the whole stack for the current aspect ratio and spacing. */
function homePose(camera: THREE.PerspectiveCamera, gap: number) {
  const height = (STACK.length - 1) * gap;
  const radius = 0.5 * Math.hypot(PLANE * Math.SQRT2, height);
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const dist = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 0.78;
  const target = new THREE.Vector3(0, height / 2, 0);
  return { target, cam: target.clone().add(HOME_DIR.clone().multiplyScalar(dist)) };
}

export function EcosystemStack3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<Ctx | null>(null);
  const webgl = useWebGL();
  const [selected, setSelected] = useState<string | null>(null);
  const [kinds, setKinds] = useState<Set<EdgeKind>>(() => new Set(["governance", "ops", "ownership", "cash", "vendor", "potential"]));
  const [flowId, setFlowId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [gap, setGap] = useState(DEFAULT_GAP);
  const [isolate, setIsolate] = useState<Rl1Layer | null>(null);
  const [allLabels, setAllLabels] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [full, setFull] = useState(false);
  const [showUniverse, setShowUniverse] = useState(true);
  const [highlight, setHighlight] = useState<UCategory | "">("");
  const [uSel, setUSel] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const tipRef = useRef<HTMLDivElement>(null);
  const selectDustRef = useRef<(id: string) => void>(() => {});
  const selectRef = useRef<(id: string | null) => void>(() => {});
  const isolateLayer = (l: Rl1Layer | null) => {
    setSelected(null);
    setUSel(null);
    setFlowId(null);
    setPanelOpen(true);
    setIsolate(l);
  };
  const isolateRef = useRef(isolateLayer);
  useEffect(() => {
    isolateRef.current = isolateLayer;
  });

  const flow = flows.find((f) => f.id === flowId) ?? null;

  // Renderer, camera, controls and the render loop: created once.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !webgl) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 1200);
    camera.position.set(0, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    wrap.appendChild(renderer.domElement);
    const labels = new CSS2DRenderer();
    labels.domElement.style.position = "absolute";
    labels.domElement.style.inset = "0";
    labels.domElement.style.pointerEvents = "none";
    wrap.appendChild(labels.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.zoomToCursor = true;
    controls.minDistance = 8;
    controls.maxDistance = 420;
    controls.zoomSpeed = 1.2;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 0.35;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(60, 140, 40);
    scene.add(sun);
    const content = new THREE.Group();
    const flowGroup = new THREE.Group();
    scene.add(content, flowGroup);

    const ctx: Ctx = { renderer, camera, controls, content, flowGroup, nodes: new Map(), lines: [], planes: [], dust: null, dustPos: [], particles: [], fly: null, allLabels: false, gap: DEFAULT_GAP };
    ctxRef.current = ctx;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      ctx.fly = null;
    });

    // Picking: a click without drag.
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: [number, number] | null = null;
    const pick = (ev: PointerEvent): { core?: string; dust?: number } | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const targets: THREE.Object3D[] = [...ctx.nodes.values()].map((n) => n.mesh);
      if (ctx.dust?.visible) targets.push(ctx.dust);
      const hit = ray.intersectObjects(targets)[0];
      if (!hit) return null;
      if (hit.object === ctx.dust && hit.instanceId != null) return { dust: hit.instanceId };
      return { core: hit.object.userData.id as string };
    };
    const onDown = (ev: PointerEvent) => (down = [ev.clientX, ev.clientY]);
    const onUp = (ev: PointerEvent) => {
      if (!down || Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) > 5) return;
      const p = pick(ev);
      if (p?.dust != null) selectDustRef.current(DUST[p.dust].id);
      else selectRef.current(p?.core ?? null);
    };
    const onMove = (ev: PointerEvent) => {
      const p = pick(ev);
      renderer.domElement.style.cursor = p ? "pointer" : "grab";
      const tip = tipRef.current;
      if (!tip) return;
      const rec = p?.dust != null ? DUST[p.dust] : p?.core ? byId[p.core] : null;
      if (!rec) {
        tip.style.opacity = "0";
        return;
      }
      const rect = renderer.domElement.getBoundingClientRect();
      tip.textContent = "cat" in rec ? `${rec.name} · ${categoryLabel[rec.cat]}${rec.country ? ` · ${rec.country}` : ""}` : `${rec.name} · ${RELATION_LABEL[rec.rel]}`;
      tip.style.transform = `translate(${ev.clientX - rect.left + 14}px, ${ev.clientY - rect.top + 14}px)`;
      tip.style.opacity = "1";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = wrap.clientWidth;
      const h = document.fullscreenElement ? window.innerHeight : Math.max(560, Math.min(980, window.innerHeight * 0.82));
      renderer.setSize(w, h);
      labels.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const home = homePose(camera, DEFAULT_GAP);
    camera.position.copy(home.cam);
    controls.target.copy(home.target);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const timer = new THREE.Timer();
    const right = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      timer.update();
      const t = timer.getElapsed();
      if (ctx.fly) {
        camera.position.lerp(ctx.fly.cam, 0.08);
        controls.target.lerp(ctx.fly.target, 0.08);
        if (camera.position.distanceTo(ctx.fly.cam) < 0.2) ctx.fly = null;
      }
      if (ctx.particles.length) {
        const segs = Math.max(...ctx.particles.map((p) => p.seg)) + 1;
        const progress = (t * 0.45) % segs;
        for (const p of ctx.particles) {
          const local = progress - p.seg;
          p.mesh.visible = local >= 0 && local <= 1;
          if (p.mesh.visible) p.mesh.position.copy(p.curve.getPoint(local));
        }
      }
      controls.update();
      // Layer titles ride the camera-left edge of each plane.
      right.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize();
      for (const p of ctx.planes) p.label.position.set(-right.x * PLANE * 0.46, layerIndex[p.layer] * ctx.gap + 0.5, -right.z * PLANE * 0.46);
      // Level of detail: secondary labels appear as you zoom in.
      for (const n of ctx.nodes.values()) {
        const far = !ctx.allLabels && !ALWAYS_LABEL.has(n.slot.id) && camera.position.distanceTo(n.mesh.position) > 100;
        if (far !== n.far) {
          n.far = far;
          n.label.dataset.far = far ? "1" : "0";
        }
      }
      renderer.render(scene, camera);
      labels.render(scene, camera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      dispose(content);
      dispose(flowGroup);
      renderer.dispose();
      wrap.replaceChildren();
      ctxRef.current = null;
    };
  }, [webgl]);

  // Planes, nodes and links: rebuilt when the layer spacing changes.
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    dispose(ctx.content);
    ctx.gap = gap;
    ctx.nodes = new Map();
    ctx.lines = [];
    ctx.planes = [];
    const { pos, dust } = layout(gap);
    ctx.dustPos = dust;
    // Labels sit above the canvas; pass their wheel events through so zoom works everywhere.
    const forwardWheel = (el: HTMLElement) =>
      el.addEventListener(
        "wheel",
        (ev) => {
          ev.preventDefault();
          ctx.renderer.domElement.dispatchEvent(new WheelEvent("wheel", ev));
        },
        { passive: false },
      );

    STACK.forEach((layer, li) => {
      const geo = new THREE.PlaneGeometry(PLANE, PLANE);
      geo.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      mesh.position.y = li * gap - 0.05;
      const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ transparent: true }));
      outline.position.y = mesh.position.y;
      const meta = LAYERS[li];
      const div = document.createElement("div");
      div.className = "rl1-layer-label";
      div.innerHTML = `<span>${meta.asap}</span>${meta.label}`;
      div.style.pointerEvents = "auto";
      div.addEventListener("click", () => isolateRef.current(layer));
      forwardWheel(div);
      const label = new CSS2DObject(div);
      ctx.content.add(mesh, outline, label);
      ctx.planes.push({ layer, mesh, outline, label });
    });

    for (const slot of SLOTS) {
      const p = pos[slot.key];
      const e = byId[slot.id];
      if (!p) continue;
      const r = slot.ghost ? 0.7 : e.id === "rl1" ? 2.6 : ["founding", "joining", "operator"].includes(e.rel) ? 1.25 : 0.85;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1, transparent: true }));
      mesh.position.copy(p).setY(p.y + r * 0.7);
      mesh.userData.id = e.id;
      ctx.content.add(mesh);
      let ring: THREE.Mesh | undefined;
      if (slot.layer === "platform-nodes" || (!slot.ghost && e.rel === "validator")) {
        ring = new THREE.Mesh(new THREE.TorusGeometry(r + 0.45, 0.11, 8, 40), new THREE.MeshBasicMaterial({ transparent: true }));
        ring.rotation.x = Math.PI / 2;
        ring.position.copy(mesh.position);
        ctx.content.add(ring);
      }
      const div = document.createElement("div");
      div.className = "rl1-node-label";
      div.dataset.ghost = slot.ghost ? "1" : "0";
      div.textContent = (slot.ghost ? "↳ " : "") + (e.short ?? e.name);
      div.style.pointerEvents = "auto";
      div.addEventListener("click", (ev) => {
        ev.stopPropagation();
        selectRef.current(e.id);
      });
      forwardWheel(div);
      const obj = new CSS2DObject(div);
      obj.position.copy(mesh.position).setY(mesh.position.y + r + 1);
      ctx.content.add(obj);
      ctx.nodes.set(slot.key, { slot, mesh, ring, label: div, far: false });
    }

    // Dashed links between an institution and its ghosts in other layers.
    for (const slot of SLOTS.filter((s) => s.ghost)) {
      const a = ctx.nodes.get(`${slot.id}@${byId[slot.id].layer}`)?.mesh.position;
      const b = ctx.nodes.get(slot.key)?.mesh.position;
      if (!a || !b) continue;
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineDashedMaterial({ dashSize: 0.5, gapSize: 0.5, transparent: true }));
      line.computeLineDistances();
      ctx.content.add(line);
      ctx.lines.push({ kind: "ownership", from: slot.id, to: slot.id, line, identity: true });
    }

    for (const ed of edges) {
      const pair = bestPair(ed.from, ed.to);
      const a = pair && ctx.nodes.get(pair[0])?.mesh.position;
      const b = pair && ctx.nodes.get(pair[1])?.mesh.position;
      if (!a || !b) continue;
      const geo = new THREE.BufferGeometry().setFromPoints(curveBetween(a, b).getPoints(36));
      const mat = ed.kind === "potential" ? new THREE.LineDashedMaterial({ dashSize: 0.8, gapSize: 0.6, transparent: true }) : new THREE.LineBasicMaterial({ transparent: true });
      const line = new THREE.Line(geo, mat);
      if (ed.kind === "potential") line.computeLineDistances();
      ctx.content.add(line);
      ctx.lines.push({ kind: ed.kind, from: ed.from, to: ed.to, line });
    }

    const dustMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.42, 10, 8), new THREE.MeshStandardMaterial({ roughness: 0.6 }), DUST.length);
    const m4 = new THREE.Matrix4();
    dust.forEach((p, i) => dustMesh.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)));
    dustMesh.setColorAt(0, new THREE.Color());
    ctx.content.add(dustMesh);
    ctx.dust = dustMesh;
  }, [gap, webgl]);

  // Flow path.
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    dispose(ctx.flowGroup);
    ctx.particles = [];
    if (!flow) return;
    const accent = new THREE.Color(cssVar("--accent"));
    const at = (i: number) => {
      const st = flow.steps[i];
      return ctx.nodes.get(`${st.node}@${st.layer ?? byId[st.node].layer}`)?.mesh.position;
    };
    const dashed = flow.status === "gap" || flow.status === "prospective";
    flow.steps.slice(0, -1).forEach((_, i) => {
      const a = at(i);
      const b = at(i + 1);
      if (!a || !b) return;
      const curve = curveBetween(a, b);
      const mat = dashed ? new THREE.LineDashedMaterial({ color: accent, dashSize: 0.7, gapSize: 0.5 }) : new THREE.LineBasicMaterial({ color: accent });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), mat);
      if (dashed) line.computeLineDistances();
      ctx.flowGroup.add(line);
      for (let k = 0; k < 3; k++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.5 - k * 0.12, 12, 10), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 1 - k * 0.3 }));
        ctx.flowGroup.add(m);
        ctx.particles.push({ mesh: m, curve, seg: i });
      }
    });
    ctx.controls.autoRotate = false;
  }, [flow, gap, webgl]);

  // Step ticker for the flow panel, in sync with the particles (0.45 segments/s).
  useEffect(() => {
    if (!flow) return;
    const start = performance.now();
    const segs = flow.steps.length - 1;
    const id = window.setInterval(() => setStep(Math.floor((((performance.now() - start) / 1000) * 0.45) % segs)), 250);
    return () => window.clearInterval(id);
  }, [flow]);

  // Colours, dimming and link visibility; re-run on theme flips.
  useEffect(() => {
    const apply = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.allLabels = allLabels;
      const dark = isDarkMode();
      const ink = new THREE.Color(cssVar("--ink"));
      const faint = new THREE.Color(cssVar("--faint"));
      const surface = new THREE.Color(cssVar("--surface-2"));
      const line = new THREE.Color(cssVar("--line"));
      const accent = new THREE.Color(cssVar("--accent"));

      const focus = new Set<string>();
      if (flow) flow.steps.forEach((st) => focus.add(st.node));
      else if (selected) {
        focus.add(selected);
        for (const l of ctx.lines) {
          if (l.identity || !kinds.has(l.kind)) continue;
          if (l.from === selected) focus.add(l.to);
          if (l.to === selected) focus.add(l.from);
        }
      }
      const hasFocus = focus.size > 0;
      const activeNode = flow ? flow.steps[step]?.node : selected;

      for (const p of ctx.planes) {
        const on = !isolate || isolate === p.layer;
        const m = p.mesh.material as THREE.MeshBasicMaterial;
        m.color = isolate === p.layer ? accent.clone().lerp(surface, 0.85) : surface;
        m.opacity = on ? (dark ? 0.5 : 0.6) : 0.1;
        const o = p.outline.material as THREE.LineBasicMaterial;
        o.color = isolate === p.layer ? accent : line;
        o.opacity = on ? 0.9 : 0.2;
        (p.label.element as HTMLDivElement).dataset.state = isolate === p.layer ? "active" : on ? "idle" : "off";
      }
      for (const n of ctx.nodes.values()) {
        const e = byId[n.slot.id];
        const col = new THREE.Color(groupColor(groupOf(e), dark));
        const on = (!isolate || n.slot.layer === isolate) && (!hasFocus || focus.has(e.id));
        const mat = n.mesh.material as THREE.MeshStandardMaterial;
        mat.color = col;
        mat.opacity = on ? (n.slot.ghost ? 0.55 : 1) : 0.1;
        mat.emissive = e.id === activeNode ? col.clone().multiplyScalar(0.55) : new THREE.Color(0);
        if (n.ring) {
          (n.ring.material as THREE.MeshBasicMaterial).color = ink;
          (n.ring.material as THREE.MeshBasicMaterial).opacity = on ? 0.9 : 0.1;
        }
        n.label.dataset.state = e.id === activeNode ? "active" : on ? (hasFocus ? "on" : "idle") : "off";
      }
      if (ctx.dust) {
        ctx.dust.visible = showUniverse;
        const tmp = new THREE.Color();
        const shade = { high: 0.08, medium: 0.42, low: 0.7, na: 0.7 } as const;
        DUST.forEach((r, i) => {
          let c: THREE.Color;
          if (uSel === r.id) c = accent;
          else if ((isolate && r.layer !== isolate) || (highlight && r.cat !== highlight) || flow) c = tmp.copy(ink).lerp(surface, 0.9);
          else if (highlight) c = tmp.copy(accent).lerp(ink, 0.15);
          else c = tmp.copy(ink).lerp(surface, hasFocus ? 0.82 : shade[r.fit]);
          ctx.dust!.setColorAt(i, c);
        });
        if (ctx.dust.instanceColor) ctx.dust.instanceColor.needsUpdate = true;
      }
      for (const l of ctx.lines) {
        const mat = l.line.material as THREE.LineBasicMaterial;
        if (l.identity) {
          l.line.visible = !flow && !isolate;
          mat.color = ink;
          mat.opacity = !hasFocus || focus.has(l.from) ? (l.from === selected ? 0.9 : 0.35) : 0.05;
          continue;
        }
        const touches = !flow && selected != null && (l.from === selected || l.to === selected);
        l.line.visible = !flow && !isolate && kinds.has(l.kind);
        mat.color = touches ? ink : faint;
        mat.opacity = touches ? 0.95 : hasFocus ? 0.05 : 0.22;
      }
    };
    apply();
    return onThemeChange(apply);
  }, [selected, kinds, flow, step, isolate, allLabels, gap, webgl, showUniverse, highlight, uSel]);

  // Fly to a layer when it is isolated.
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx || !isolate) return;
    ctx.controls.autoRotate = false;
    const y = layerIndex[isolate] * ctx.gap;
    const target = new THREE.Vector3(0, y, 0);
    const dir = ctx.camera.position.clone().sub(ctx.controls.target).setY(0).normalize();
    ctx.fly = { target, cam: target.clone().add(dir.multiplyScalar(62)).setY(y + 58) };
  }, [isolate]);

  useEffect(() => {
    selectDustRef.current = (id) => {
      setFlowId(null);
      setSelected(null);
      setUSel(id);
      setPanelOpen(true);
      const ctx = ctxRef.current;
      const p = ctx?.dustPos[dustIndex.get(id) ?? -1];
      if (!ctx || !p) return;
      ctx.controls.autoRotate = false;
      const dir = ctx.camera.position.clone().sub(ctx.controls.target).normalize();
      ctx.fly = { target: p.clone(), cam: p.clone().add(dir.multiplyScalar(40)) };
    };
    selectRef.current = (id) => {
      setFlowId(null);
      setUSel(null);
      setSelected(id);
      setPanelOpen(true);
      const ctx = ctxRef.current;
      const node = id && ctx?.nodes.get(`${id}@${byId[id].layer}`);
      if (!ctx || !node) return;
      ctx.controls.autoRotate = false;
      const target = node.mesh.position.clone();
      const dir = ctx.camera.position.clone().sub(ctx.controls.target).normalize();
      ctx.fly = { target, cam: target.clone().add(dir.multiplyScalar(id === "rl1" ? 80 : 46)) };
    };
  }, []);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function zoom(factor: number) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.controls.autoRotate = false;
    const offset = ctx.camera.position.clone().sub(ctx.controls.target).multiplyScalar(factor);
    const len = THREE.MathUtils.clamp(offset.length(), ctx.controls.minDistance, ctx.controls.maxDistance);
    ctx.fly = { target: ctx.controls.target.clone(), cam: ctx.controls.target.clone().add(offset.setLength(len)) };
  }

  function resetView() {
    setFlowId(null);
    setIsolate(null);
    setSelected(null);
    const ctx = ctxRef.current;
    if (!ctx) return;
    const home = homePose(ctx.camera, gap);
    ctx.fly = { target: home.target, cam: home.cam };
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen();
  }

  function toggleKind(k: EdgeKind) {
    setKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  const sel = selected ? byId[selected] : null;
  const connections = sel
    ? edges
        .filter((e) => e.from === sel.id || e.to === sel.id)
        .map((e) => ({ ...e, other: byId[e.from === sel.id ? e.to : e.from], dir: e.from === sel.id ? "out" : "in" }))
        .filter((c) => c.other)
    : [];

  const btn = "flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-surface/90 px-2.5 text-[13px] font-semibold text-ink backdrop-blur hover:bg-surface-2";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-faint">Links</span>
        {EDGE_KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => toggleKind(k.id)}
            aria-pressed={kinds.has(k.id)}
            className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition ${kinds.has(k.id) ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"}`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-faint">Flows</span>
        {flows.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFlowId(flowId === f.id ? null : f.id);
              setUSel(null);
              setIsolate(null);
              setPanelOpen(true);
              setStep(0);
            }}
            aria-pressed={flowId === f.id}
            className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition ${flowId === f.id ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink"}`}
          >
            {f.title}
          </button>
        ))}
      </div>

      <div ref={stageRef} className="rl1-stage relative mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
        <div ref={wrapRef} className="relative" />
        <div ref={tipRef} className="pointer-events-none absolute left-0 top-0 z-20 max-w-xs rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[12px] text-ink opacity-0 shadow-lg" />

        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          <button type="button" className={btn} onClick={() => zoom(0.65)} aria-label="Zoom in" title="Zoom in">
            +
          </button>
          <button type="button" className={btn} onClick={() => zoom(1.5)} aria-label="Zoom out" title="Zoom out">
            −
          </button>
          <button type="button" className={btn} onClick={resetView}>
            Fit
          </button>
          <button type="button" className={btn} onClick={toggleFullscreen}>
            {full ? "Exit full screen" : "Full screen"}
          </button>
          <label className={`${btn} gap-2 font-medium`}>
            <span className="text-muted">Spacing</span>
            <input type="range" min={6} max={22} step={1} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-20" aria-label="Layer spacing" />
          </label>
          <button type="button" className={btn} onClick={() => setAllLabels((v) => !v)} aria-pressed={allLabels}>
            {allLabels ? "Key labels only" : "All labels"}
          </button>
          <button type="button" className={btn} onClick={() => setShowUniverse((v) => !v)} aria-pressed={showUniverse}>
            {showUniverse ? `Hide universe (${DUST.length})` : `Show universe (${DUST.length})`}
          </button>
          <select aria-label="Highlight a category" value={highlight} onChange={(e) => setHighlight(e.target.value as UCategory | "")} className={`${btn} max-w-[220px] font-medium`}>
            <option value="">Highlight category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({DUST.filter((r) => r.cat === c.id).length})
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find an institution…"
              aria-label="Find an institution"
              className="h-9 w-56 rounded-lg border border-line bg-surface/90 px-2.5 text-[13px] text-ink placeholder:text-faint backdrop-blur"
            />
            {query.trim().length > 1 ? (
              <ul className="absolute left-0 top-10 z-30 max-h-72 w-80 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-xl">
                {search(query).map((h) => (
                  <li key={h.key}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-ink hover:bg-surface-2"
                      onClick={() => {
                        setQuery("");
                        if (h.core) selectRef.current(h.core);
                        else selectDustRef.current(h.key);
                      }}
                    >
                      <span className="truncate">{h.name}</span>
                      <span className="shrink-0 text-[11px] text-faint">{h.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 z-10 hidden w-[230px] rounded-xl border border-line bg-surface/90 p-2 backdrop-blur md:block">
          {ASAP_ORDER.map((a) => (
            <div key={a} className="mb-1 last:mb-0">
              <p className="px-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">{a}</p>
              {LAYERS.filter((l) => l.asap === a)
                .reverse()
                .map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => isolateLayer(isolate === l.id ? null : l.id)}
                    aria-pressed={isolate === l.id}
                    className={`flex w-full items-center justify-between rounded-md px-1.5 py-0.5 text-left text-[12px] ${isolate === l.id ? "bg-accent text-white" : "text-ink hover:bg-surface-2"}`}
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-[11px] opacity-70">
                      {entities.filter((e) => e.layer === l.id).length}
                      {showUniverse ? ` + ${DUST.filter((r) => r.layer === l.id).length}` : ""}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>

        <p className="pointer-events-none absolute bottom-3 right-3 z-10 hidden max-w-[300px] text-right text-[11px] text-faint lg:block">
          Drag to orbit · scroll or pinch to zoom at the cursor · right-drag to pan · more labels appear as you zoom in
        </p>

        {panelOpen ? (
          <aside className="z-10 max-h-[70vh] overflow-y-auto border-t border-line bg-surface p-5 lg:absolute lg:right-3 lg:top-3 lg:max-h-[calc(100%-4rem)] lg:w-[360px] lg:rounded-2xl lg:border lg:bg-surface/95 lg:shadow-xl lg:backdrop-blur">
            <button type="button" onClick={() => setPanelOpen(false)} className="float-right -mr-1 -mt-1 rounded-md px-2 text-[20px] leading-none text-faint hover:text-ink" aria-label="Close panel">
              ×
            </button>
            {flow ? (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{flow.status === "gap" ? "Gap: no route today" : flow.status}</p>
                <h3 className="mt-1 font-serif text-2xl text-ink">{flow.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{flow.summary}</p>
                <ol className="mt-4 space-y-2">
                  {flow.steps.map((st, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => selectRef.current(st.node)}
                        className={`flex w-full gap-3 rounded-xl border p-3 text-left transition ${i === step || i === step + 1 ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2"}`}
                      >
                        <span className="font-mono text-[12px] text-faint">{i + 1}</span>
                        <span>
                          <span className="block text-[14px] font-semibold text-ink">{byId[st.node]?.name}</span>
                          <span className="block text-[13px] leading-snug text-muted">{st.text}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ) : uSel ? (
              <UniverseCard record={DUST[dustIndex.get(uSel)!]} />
            ) : isolate && !sel ? (
              <LayerCard layer={isolate} onPick={(id) => selectRef.current(id)} />
            ) : sel ? (
              <div>
                <div className="flex items-start gap-3">
                  <PlayerLogo name={sel.name} domain={sel.domain} size={44} />
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-tight text-ink">{sel.name}</h3>
                    <p className="text-[13px] text-muted">
                      {sel.type} · {sel.city}, {sel.country}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full px-2 py-0.5 text-[12px] font-semibold text-white" style={{ background: groupVar(groupOf(sel)) }}>
                    {RELATION_LABEL[sel.rel]}
                  </span>
                  {sel.validator ? <span className="rounded-full border border-ink px-2 py-0.5 text-[12px] font-semibold text-ink">Validator</span> : null}
                  <EvidenceBadge level={sel.evidence} />
                </div>
                <ul className="mt-3 flex flex-wrap gap-1">
                  {[sel.layer, ...(sel.alsoIn ?? [])].map((l) => {
                    const m = LAYERS.find((x) => x.id === l)!;
                    return (
                      <li key={l}>
                        <button type="button" onClick={() => isolateLayer(l)} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] text-muted hover:text-ink">
                          {m.asap} · {m.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-[14px] leading-relaxed text-ink">{sel.what}</p>
                <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[14px] leading-relaxed text-ink">
                  <span className="font-semibold">In the RL1 ecosystem: </span>
                  {sel.role}
                </p>
                <h4 className="mt-5 font-mono text-[11px] uppercase tracking-wider text-faint">Connections ({connections.length})</h4>
                <ul className="mt-2 space-y-1">
                  {connections.map((c, i) => (
                    <li key={i}>
                      <button type="button" onClick={() => selectRef.current(c.other.id)} className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-surface-2">
                        <span className="text-[13px] font-semibold text-ink">
                          {c.dir === "out" ? "→" : "←"} {c.other.short ?? c.other.name}
                        </span>
                        <span className="ml-1.5 text-[11px] text-faint">{EDGE_KINDS.find((k) => k.id === c.kind)?.label}</span>
                        <span className="block text-[12px] leading-snug text-muted">
                          {c.label}
                          {c.evidence !== "confirmed" ? <em className="text-faint"> ({c.evidence})</em> : null}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {sel.sources.length ? (
                  <>
                    <h4 className="mt-5 font-mono text-[11px] uppercase tracking-wider text-faint">Sources</h4>
                    <ul className="mt-2 space-y-1">
                      {sel.sources.map((s) => (
                        <li key={s}>
                          <a href={SOURCES[s].url} target="_blank" rel="noreferrer" className="text-[13px] text-accent hover:underline">
                            {SOURCES[s].label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : (
              <div>
                <h3 className="font-serif text-2xl text-ink">Nine planes, one ledger</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">Click a node or label for its role and links, pick a layer on the left to isolate it, or run a flow above.</p>
              </div>
            )}
          </aside>
        ) : (
          <button type="button" onClick={() => setPanelOpen(true)} className={`${btn} absolute right-3 top-3 z-10`}>
            Details
          </button>
        )}
      </div>
      {!webgl ? <p className="mt-3 text-[14px] text-muted">WebGL is unavailable in this browser. Every entity and link is in the database below.</p> : null}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-muted">
        {GROUPS.map((g) => (
          <span key={g.id} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: groupVar(g.id) }} />
            {g.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-ink" />
          Validator node
        </span>
        <span className="inline-flex items-center gap-1.5">↳ Same institution in another layer</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-faint" />
          Potential, unannounced
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="flex gap-0.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink opacity-55" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink opacity-30" />
          </span>
          Universe (no RL1 link), shaded by membership fit: high · medium · low
        </span>
      </div>
    </div>
  );
}

type Hit = { key: string; core?: string; name: string; note: string };
function search(q: string): Hit[] {
  const n = q.trim().toLowerCase();
  const out: Hit[] = [];
  for (const e of entities) if (e.name.toLowerCase().includes(n) || e.short?.toLowerCase().includes(n)) out.push({ key: e.id, core: e.id, name: e.name, note: RELATION_LABEL[e.rel] });
  for (const r of DUST) if (r.name.toLowerCase().includes(n)) out.push({ key: r.id, name: r.name, note: categoryLabel[r.cat] });
  return out.slice(0, 25);
}

const sourceById = Object.fromEntries(universeSources.map((x) => [x.id, x]));

function UniverseCard({ record: r }: { record: URecord }) {
  const layer = LAYERS.find((l) => l.id === r.layer)!;
  return (
    <div>
      <div className="flex items-start gap-3">
        <PlayerLogo name={r.name} domain={r.web ?? r.name} size={44} />
        <div className="min-w-0">
          <h3 className="font-serif text-2xl leading-tight text-ink">{r.name}</h3>
          <p className="text-[13px] text-muted">
            {categoryLabel[r.cat]}
            {r.country ? ` · ${r.city ? `${r.city}, ` : ""}${r.country}` : " · on-chain, no HQ"}
            {r.geo === "capital" ? " (capital used: HQ city not matched)" : ""}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-line px-2 py-0.5 text-[12px] font-semibold text-ink">Not in the RL1 map</span>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[12px] font-semibold text-ink">Membership fit: {FIT_LABEL[r.fit]}</span>
      </div>
      <p className="mt-3 text-[12px] text-faint">
        {layer.asap} · {layer.label}
      </p>
      {r.ref ? <p className="mt-3 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed text-ink">{r.ref}</p> : null}
      <p className="mt-3 text-[13px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Fit rule: </span>
        {CATEGORY_BY_ID[r.cat].fitRule}
      </p>
      <h4 className="mt-4 font-mono text-[11px] uppercase tracking-wider text-faint">Appears in</h4>
      <ul className="mt-1.5 space-y-1">
        {r.srcs.map((s) => (
          <li key={s}>
            <a href={sourceById[s]?.url} target="_blank" rel="noreferrer" className="text-[13px] text-accent hover:underline">
              {sourceById[s]?.label ?? s}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-3 text-[13px]">
        {r.lei ? (
          <a href={`https://search.gleif.org/#/record/${r.lei}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            LEI {r.lei}
          </a>
        ) : null}
        {r.web ? (
          <a href={`https://${r.web}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            {r.web}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function LayerCard({ layer, onPick }: { layer: Rl1Layer; onPick: (id: string) => void }) {
  const meta = LAYERS.find((l) => l.id === layer)!;
  const list = [...entities.filter((e) => e.layer === layer), ...entities.filter((e) => e.alsoIn?.includes(layer))];
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{meta.asap} layer</p>
      <h3 className="mt-1 font-serif text-2xl text-ink">{meta.label}</h3>
      <p className="mt-1 text-[14px] font-medium text-ink">{meta.question}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{meta.detail}</p>
      <ul className="mt-4 space-y-0.5">
        {list.map((e) => (
          <li key={e.id}>
            <button type="button" onClick={() => onPick(e.id)} className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-surface-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: groupVar(groupOf(e)) }} />
              <span className="text-[13px] text-ink">
                {e.layer !== layer ? "↳ " : ""}
                {e.name}
              </span>
              <span className="ml-auto shrink-0 text-[11px] text-faint">{RELATION_LABEL[e.rel]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EvidenceBadge({ level }: { level: "confirmed" | "reported" | "inferred" }) {
  const cls = level === "confirmed" ? "border-good text-good" : level === "reported" ? "border-warn text-warn" : "border-faint text-faint";
  const icon = level === "confirmed" ? "✓" : level === "reported" ? "~" : "?";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-semibold ${cls}`} title={`Evidence: ${level}`}>
      <span aria-hidden>{icon}</span>
      {level}
    </span>
  );
}
