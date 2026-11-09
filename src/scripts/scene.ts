import * as THREE from 'three';
import { gsap } from 'gsap';

const COLORS = {
  bg: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#090c10'),
  host: new THREE.Color('#8ea4ba'),
  hub: new THREE.Color('#b4c6d8'),
  core: new THREE.Color('#e6ecf2'),
  edge: new THREE.Color('#40607f'),
  mesh: new THREE.Color('#2c4361'),
  trunk: new THREE.Color('#4a86c8'),
  zone: new THREE.Color('#284a6e'),
  dust: new THREE.Color('#41546a'),
  telemetry: new THREE.Color('#3d7fc8'),
  attack: new THREE.Color('#ff5b4f'),
  detect: new THREE.Color('#4da3ff'),
  resolved: new THREE.Color('#3ed68e'),
};

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hostIndexFor(label: string, hostCount: number) {
  let h = 2166136261;
  for (const c of label) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Math.abs(h) % hostCount;
}

interface Packet {
  from: THREE.Vector3;
  to: THREE.Vector3;
  t: number;
  speed: number;
  color: THREE.Color;
  alive: boolean;
  loud: boolean;
  onArrive?: () => void;
}

export interface SceneApi {
  hostCount: number;
  attack(host: number, onDetected?: () => void): void;
  focus(host: number | null): void;
  onFrame(cb: (project: (host: number) => { x: number; y: number; visible: boolean }) => void): void;
  setActive(active: boolean): void;
  dispose(): void;
}

const pointVert = `
  attribute vec3 color;
  attribute float size;
  attribute float glow;
  varying vec3 vColor;
  varying float vGlow;
  varying float vFade;
  uniform float uPixelRatio;
  uniform vec4 uRect;
  uniform float uClear;
  float clearMask(vec2 q) {
    return smoothstep(uRect.x - 0.14, uRect.x, q.x) * (1.0 - smoothstep(uRect.y, uRect.y + 0.14, q.x))
      * smoothstep(uRect.z - 0.14, uRect.z, q.y) * (1.0 - smoothstep(uRect.w, uRect.w + 0.14, q.y));
  }
  void main() {
    vColor = color;
    vGlow = glow;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * uPixelRatio * (22.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vFade = (1.0 - uClear * clearMask(gl_Position.xy / gl_Position.w)) * (1.0 - 0.8 * smoothstep(20.0, 44.0, -mv.z));
  }
`;

const lineVert = `
  attribute vec3 color;
  varying vec3 vColor;
  varying float vFade;
  uniform vec4 uRect;
  uniform float uClear;
  float clearMask(vec2 q) {
    return smoothstep(uRect.x - 0.14, uRect.x, q.x) * (1.0 - smoothstep(uRect.y, uRect.y + 0.14, q.x))
      * smoothstep(uRect.z - 0.14, uRect.z, q.y) * (1.0 - smoothstep(uRect.w, uRect.w + 0.14, q.y));
  }
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vFade = (1.0 - uClear * clearMask(gl_Position.xy / gl_Position.w)) * (1.0 - 0.85 * smoothstep(18.0, 42.0, -mv.z));
  }
`;

const trailVert = `
  attribute vec3 color;
  attribute float alpha;
  varying vec3 vColor;
  varying float vFade;
  uniform vec4 uRect;
  uniform float uClear;
  float clearMask(vec2 q) {
    return smoothstep(uRect.x - 0.14, uRect.x, q.x) * (1.0 - smoothstep(uRect.y, uRect.y + 0.14, q.x))
      * smoothstep(uRect.z - 0.14, uRect.z, q.y) * (1.0 - smoothstep(uRect.w, uRect.w + 0.14, q.y));
  }
  void main() {
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFade = alpha * (1.0 - uClear * clearMask(gl_Position.xy / gl_Position.w));
  }
`;

const ringVert = `
  varying float vFade;
  uniform vec4 uRect;
  uniform float uClear;
  float clearMask(vec2 q) {
    return smoothstep(uRect.x - 0.14, uRect.x, q.x) * (1.0 - smoothstep(uRect.y, uRect.y + 0.14, q.x))
      * smoothstep(uRect.z - 0.14, uRect.z, q.y) * (1.0 - smoothstep(uRect.w, uRect.w + 0.14, q.y));
  }
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFade = 1.0 - uClear * clearMask(gl_Position.xy / gl_Position.w);
  }
`;

const ringFrag = `
  varying float vFade;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity * vFade);
  }
`;

const lineFrag = `
  varying vec3 vColor;
  varying float vFade;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(vColor, uOpacity * vFade);
  }
`;

const pointFrag = `
  varying vec3 vColor;
  varying float vGlow;
  varying float vFade;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    float core = smoothstep(0.24, 0.16, d);
    float ring = smoothstep(0.5, 0.42, d) * smoothstep(0.30, 0.38, d) * vGlow;
    float halo = smoothstep(0.5, 0.0, d) * 0.35 * vGlow;
    float a = max(core, max(ring, halo));
    gl_FragColor = vec4(vColor, a * vFade);
  }
`;

export function createScene(canvas: HTMLCanvasElement, opts: { reduced: boolean; compact: boolean }): SceneApi | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(COLORS.bg, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 18, 42);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const camHome = new THREE.Vector3(0, 3.5, 18.5);
  camera.position.copy(camHome);
  const lookAt = new THREE.Vector3(0, 0, 0);

  const world = new THREE.Group();
  scene.add(world);

  const rand = rng(7);
  const SUBNETS = 6;
  const PER = opts.compact ? 10 : 16;
  const core = new THREE.Vector3(0, 0, 0);
  const hubs: THREE.Vector3[] = [];
  const hosts: THREE.Vector3[] = [];
  const hostHub: number[] = [];
  for (let s = 0; s < SUBNETS; s++) {
    const a = (s / SUBNETS) * Math.PI * 2 + 0.3;
    const hub = new THREE.Vector3(Math.cos(a) * 6.4, (rand() - 0.5) * 3.2, Math.sin(a) * 6.4);
    hubs.push(hub);
    for (let i = 0; i < PER; i++) {
      const dir = new THREE.Vector3(rand() - 0.5, (rand() - 0.5) * 0.8, rand() - 0.5).normalize();
      const p = hub.clone().add(dir.multiplyScalar(1.1 + rand() * 1.9)).add(hub.clone().normalize().multiplyScalar(1.4));
      hosts.push(p);
      hostHub.push(s);
    }
  }

  const edgePos: number[] = [];
  const edgeCol: number[] = [];
  const pushEdge = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Color) => {
    edgePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    edgeCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
  };
  hubs.forEach((h, i) => {
    pushEdge(core, h, COLORS.trunk);
    pushEdge(h, hubs[(i + 1) % SUBNETS], COLORS.edge);
  });
  hosts.forEach((p, i) => {
    pushEdge(p, hubs[hostHub[i]], COLORS.edge);
    let best = -1;
    let bestD = Infinity;
    hosts.forEach((q, j) => {
      if (j === i || hostHub[j] !== hostHub[i]) return;
      const d = p.distanceToSquared(q);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    });
    if (best > i) pushEdge(p, hosts[best], COLORS.mesh);
  });
  hubs.forEach((h) => {
    const centre = h.clone().add(h.clone().normalize().multiplyScalar(1.4));
    const R = 3.3;
    const SEG = 40;
    for (let k = 0; k < SEG; k += 2) {
      const a0 = (k / SEG) * Math.PI * 2;
      const a1 = ((k + 1) / SEG) * Math.PI * 2;
      pushEdge(
        new THREE.Vector3(centre.x + Math.cos(a0) * R, centre.y - 1.4, centre.z + Math.sin(a0) * R),
        new THREE.Vector3(centre.x + Math.cos(a1) * R, centre.y - 1.4, centre.z + Math.sin(a1) * R),
        COLORS.zone,
      );
    }
  });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3));
  edgeGeo.setAttribute('color', new THREE.Float32BufferAttribute(edgeCol, 3));
  const clear = { v: 0 };
  const lineMat = new THREE.ShaderMaterial({
    vertexShader: lineVert,
    fragmentShader: lineFrag,
    uniforms: { uRect: { value: new THREE.Vector4(-1.2, -0.2, -0.62, -0.06) }, uClear: { value: 0 }, uOpacity: { value: 1 } },
    transparent: true,
    depthWrite: false,
  });
  const edges = new THREE.LineSegments(edgeGeo, lineMat);
  world.add(edges);

  const dustRand = rng(19);
  const DUST = opts.compact ? 160 : 360;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const u = dustRand() * 2 - 1;
    const th = dustRand() * Math.PI * 2;
    const r = 15 + dustRand() * 14;
    const k = Math.sqrt(1 - u * u);
    dustPos.set([Math.cos(th) * k * r, u * r * 0.6, Math.sin(th) * k * r], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(Array.from({ length: DUST }, () => COLORS.dust.toArray()).flat()), 3));
  dustGeo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(DUST).map(() => 4 + dustRand() * 4), 1));
  dustGeo.setAttribute('glow', new THREE.BufferAttribute(new Float32Array(DUST), 1));

  const nodes = [core, ...hubs, ...hosts];
  const HOST0 = 1 + SUBNETS;
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodes.flatMap((v) => [v.x, v.y, v.z]), 3));
  const baseColor = nodes.map((_, i) => (i === 0 ? COLORS.core : i < HOST0 ? COLORS.hub : COLORS.host).clone());
  const nodeColor = new Float32Array(nodes.length * 3);
  const nodeSize = new Float32Array(nodes.map((_, i) => (i === 0 ? 40 : i < HOST0 ? 24 : 16)));
  const nodeGlow = new Float32Array(nodes.map((_, i) => (i === 0 ? 1 : 0)));
  baseColor.forEach((c, i) => c.toArray(nodeColor, i * 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColor, 3));
  nodeGeo.setAttribute('size', new THREE.BufferAttribute(nodeSize, 1));
  nodeGeo.setAttribute('glow', new THREE.BufferAttribute(nodeGlow, 1));
  const pointMat = new THREE.ShaderMaterial({
    vertexShader: pointVert,
    fragmentShader: pointFrag,
    uniforms: { uPixelRatio: { value: dpr }, uRect: lineMat.uniforms.uRect, uClear: lineMat.uniforms.uClear },
    transparent: true,
    depthWrite: false,
  });
  world.add(new THREE.Points(nodeGeo, pointMat));
  world.add(new THREE.Points(dustGeo, pointMat));

  const nodeTarget = baseColor.map((c) => c.clone());
  const nodeCurrent = baseColor.map((c) => c.clone());
  const glowTarget = Array.from(nodeGlow);

  const MAX = opts.compact ? 120 : 240;
  const packets: Packet[] = Array.from({ length: MAX }, () => ({
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    t: 0,
    speed: 0,
    color: new THREE.Color(),
    alive: false,
    loud: false,
  }));
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(MAX * 3);
  const pCol = new Float32Array(MAX * 3);
  const pSize = new Float32Array(MAX);
  const pGlow = new Float32Array(MAX);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(pSize, 1));
  pGeo.setAttribute('glow', new THREE.BufferAttribute(pGlow, 1));
  const pointsP = new THREE.Points(pGeo, pointMat);
  pointsP.frustumCulled = false;
  world.add(pointsP);

  const tPos = new Float32Array(MAX * 6);
  const tCol = new Float32Array(MAX * 6);
  const tAlpha = new Float32Array(MAX * 2);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
  trailGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3));
  trailGeo.setAttribute('alpha', new THREE.BufferAttribute(tAlpha, 1));
  const trailMat = new THREE.ShaderMaterial({
    vertexShader: trailVert,
    fragmentShader: lineFrag,
    uniforms: { uRect: lineMat.uniforms.uRect, uClear: lineMat.uniforms.uClear, uOpacity: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const trails = new THREE.LineSegments(trailGeo, trailMat);
  trails.frustumCulled = false;
  world.add(trails);

  interface Ripple { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; t: number; dur: number; size: number; peak: number; alive: boolean }
  const ringGeo = new THREE.RingGeometry(0.97, 1, 96).rotateX(-Math.PI / 2);
  const ripples: Ripple[] = Array.from({ length: 8 }, () => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      uniforms: { uRect: lineMat.uniforms.uRect, uClear: lineMat.uniforms.uClear, uColor: { value: new THREE.Color() }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(ringGeo, mat);
    mesh.visible = false;
    world.add(mesh);
    return { mesh, mat, t: 0, dur: 1, size: 1, peak: 1, alive: false };
  });
  function ripple(at: THREE.Vector3, color: THREE.Color, size: number, dur: number, peak: number) {
    if (opts.reduced) return;
    const r = ripples.find((q) => !q.alive) ?? ripples[0];
    r.mesh.position.copy(at);
    (r.mat.uniforms.uColor.value as THREE.Color).copy(color);
    Object.assign(r, { t: 0, dur, size, peak, alive: true });
    r.mesh.visible = true;
  }

  function spawn(from: THREE.Vector3, to: THREE.Vector3, color: THREE.Color, speed: number, onArrive?: () => void) {
    const p = packets.find((q) => !q.alive);
    if (!p) return;
    p.from.copy(from);
    p.to.copy(to);
    p.t = 0;
    p.speed = speed;
    p.color.copy(color);
    p.alive = true;
    p.loud = color !== COLORS.telemetry;
    p.onArrive = onArrive;
  }

  function telemetry() {
    const h = Math.floor(rand() * hosts.length);
    const hub = hubs[hostHub[h]];
    spawn(hosts[h], hub, COLORS.telemetry, 0.9 + rand() * 0.6, () => spawn(hub, core, COLORS.telemetry, 0.6 + rand() * 0.3));
  }

  function setNode(i: number, color: THREE.Color, glow: number) {
    nodeTarget[i].copy(color);
    glowTarget[i] = glow;
  }

  function attack(hostIdx: number, onDetected?: () => void) {
    const i = HOST0 + (hostIdx % hosts.length);
    const target = hosts[hostIdx % hosts.length];
    const origin = world.worldToLocal(new THREE.Vector3(16 + rand() * 4, 9 + rand() * 3, -4 + rand() * 6));
    if (opts.reduced) {
      setNode(i, COLORS.resolved, 0.8);
      onDetected?.();
      return;
    }
    spawn(origin, target, COLORS.attack, 0.55, () => {
      setNode(i, COLORS.attack, 1);
      ripple(target, COLORS.attack, 2.6, 0.9, 0.9);
      const hub = hubs[hostHub[hostIdx % hosts.length]];
      spawn(target, hub, COLORS.attack, 1.3, () =>
        spawn(hub, core, COLORS.attack, 1.1, () => {
          ripple(core, COLORS.detect, 9.5, 2, 0.7);
          spawn(core, hub, COLORS.detect, 1.2, () =>
            spawn(hub, target, COLORS.detect, 1.4, () => {
              setNode(i, COLORS.detect, 1);
              ripple(target, COLORS.resolved, 2.2, 1.1, 0.7);
              onDetected?.();
              setTimeout(() => setNode(i, COLORS.resolved, 0.55), 900);
              setTimeout(() => setNode(i, baseColor[i], 0), 9000);
            }),
          );
        }),
      );
    });
  }

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let focused: number | null = null;
  const camGoal = camHome.clone();
  const lookGoal = new THREE.Vector3();
  const setClear = (on: boolean) => {
    gsap.to(clear, {
      v: on && clearOn ? CLEAR : 0,
      duration: opts.reduced ? 0 : 1,
      ease: 'power2.inOut',
      onUpdate: () => (lineMat.uniforms.uClear.value = clear.v),
    });
  };
  function focus(hostIdx: number | null) {
    focused = hostIdx;
    setClear(hostIdx === null);
    if (hostIdx === null) {
      gsap.to(camGoal, { x: camHome.x, y: camHome.y, z: camHome.z, duration: opts.reduced ? 0 : 1.4, ease: 'power3.inOut' });
      gsap.to(lookGoal, { x: 0, y: 0, z: 0, duration: opts.reduced ? 0 : 1.4, ease: 'power3.inOut' });
      return;
    }
    const p = hosts[hostIdx % hosts.length].clone().applyMatrix4(world.matrixWorld);
    const dir = p.clone().normalize();
    const to = p.clone().add(dir.multiplyScalar(7)).add(new THREE.Vector3(0, 2.2, 0));
    gsap.to(camGoal, { x: to.x, y: to.y, z: to.z, duration: opts.reduced ? 0 : 1.4, ease: 'power3.inOut' });
    gsap.to(lookGoal, { x: p.x, y: p.y, z: p.z, duration: opts.reduced ? 0 : 1.4, ease: 'power3.inOut' });
  }

  let frameCb: Parameters<SceneApi['onFrame']>[0] | null = null;
  const tmp = new THREE.Vector3();
  const project = (host: number) => {
    tmp.copy(hosts[host % hosts.length]).applyMatrix4(world.matrixWorld).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * canvas.clientWidth, y: (-tmp.y * 0.5 + 0.5) * canvas.clientHeight, visible: tmp.z < 1 };
  };

  const CLEAR = 0.92;
  let clearOn = false;
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    world.position.x = w > 900 ? 2.2 : 0;
    world.position.y = w > 900 ? 0 : 5.5;
    clearOn = w > 900;
    if (focused === null) {
      clear.v = clearOn ? CLEAR : 0;
      lineMat.uniforms.uClear.value = clear.v;
    }
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const clock = new THREE.Timer();
  let active = true;
  let raf = 0;
  let spawnAcc = 0;

  function frame() {
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsed();

    if (!opts.reduced) {
      if (focused === null) world.rotation.y += dt * 0.035;
      spawnAcc += dt;
      while (spawnAcc > 0.06) {
        spawnAcc -= 0.06;
        telemetry();
      }
    }

    camera.position.lerp(tmp.set(camGoal.x + pointer.x * 1.2, camGoal.y - pointer.y * 0.8, camGoal.z), 0.06);
    camera.lookAt(lookGoal);

    for (let k = 0; k < MAX; k++) {
      const p = packets[k];
      if (p.alive) {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.alive = false;
          p.onArrive?.();
        }
      }
      if (p.alive && p.loud) {
        tmp.lerpVectors(p.from, p.to, Math.max(0, p.t - 0.28));
        tPos.set([tmp.x, tmp.y, tmp.z], k * 6);
        tmp.lerpVectors(p.from, p.to, p.t);
        tPos.set([tmp.x, tmp.y, tmp.z], k * 6 + 3);
        p.color.toArray(tCol, k * 6);
        p.color.toArray(tCol, k * 6 + 3);
        tAlpha[k * 2] = 0;
        tAlpha[k * 2 + 1] = 0.95;
      } else {
        tAlpha[k * 2] = 0;
        tAlpha[k * 2 + 1] = 0;
      }
      if (p.alive) {
        tmp.lerpVectors(p.from, p.to, p.t);
        pPos[k * 3] = tmp.x;
        pPos[k * 3 + 1] = tmp.y;
        pPos[k * 3 + 2] = tmp.z;
        p.color.toArray(pCol, k * 3);
        pSize[k] = p.loud ? 15 : 8;
        pGlow[k] = p.loud ? 1 : 0.25;
      } else {
        pSize[k] = 0;
      }
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
    pGeo.attributes.size.needsUpdate = true;
    pGeo.attributes.glow.needsUpdate = true;
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
    trailGeo.attributes.alpha.needsUpdate = true;

    for (const r of ripples) {
      if (!r.alive) continue;
      r.t += dt / r.dur;
      if (r.t >= 1) {
        r.alive = false;
        r.mesh.visible = false;
        continue;
      }
      const e = 1 - Math.pow(1 - r.t, 3);
      r.mesh.scale.setScalar(0.3 + e * r.size);
      r.mat.uniforms.uOpacity.value = r.peak * Math.pow(1 - r.t, 1.6);
    }

    for (let i = 0; i < nodes.length; i++) {
      nodeCurrent[i].lerp(nodeTarget[i], 0.08);
      nodeCurrent[i].toArray(nodeColor, i * 3);
      nodeGlow[i] += (glowTarget[i] - nodeGlow[i]) * 0.08;
    }
    nodeGlow[0] = 0.6 + Math.sin(t * 1.6) * 0.25;
    nodeGeo.attributes.color.needsUpdate = true;
    nodeGeo.attributes.glow.needsUpdate = true;

    renderer.render(scene, camera);
    frameCb?.(project);
    if (active && !opts.reduced) raf = requestAnimationFrame(frame);
  }

  function setActive(on: boolean) {
    if (on === active) return;
    active = on;
    cancelAnimationFrame(raf);
    if (on) {
      clock.update();
      raf = requestAnimationFrame(frame);
    }
  }

  if (opts.reduced) {
    for (let i = 0; i < 40; i++) frame();
    const redraw = () => {
      frame();
      requestAnimationFrame(() => frame());
    };
    const origFocus = focus;
    return {
      hostCount: hosts.length,
      attack: (h, cb) => {
        attack(h, cb);
        for (let i = 0; i < 30; i++) frame();
      },
      focus: (h) => {
        origFocus(h);
        camera.position.copy(camGoal);
        redraw();
      },
      onFrame: (cb) => {
        frameCb = cb;
      },
      setActive: () => {},
      dispose: () => {
        ro.disconnect();
        window.removeEventListener('pointermove', onPointer);
        renderer.dispose();
      },
    };
  }

  raf = requestAnimationFrame(frame);

  return {
    hostCount: hosts.length,
    attack,
    focus,
    onFrame: (cb) => {
      frameCb = cb;
    },
    setActive,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      renderer.dispose();
    },
  };
}
