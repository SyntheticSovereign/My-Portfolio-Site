import * as THREE from 'three';

export type Shape = 'network' | 'globe' | 'helix' | 'cluster' | 'lattice' | 'rings' | 'signal';

export interface AmbientApi {
  scrub(a: Shape, b: Shape, q: number, travel: number): void;
  setActive(on: boolean): void;
  dispose(): void;
}

const VERT = `
  attribute vec3 posA;
  attribute vec3 posB;
  attribute float seed;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  varying float vSeed;
  varying float vDepth;
  void main() {
    float m = smoothstep(0.0, 1.0, clamp(uMix * 1.35 - seed * 0.35, 0.0, 1.0));
    vec3 p = mix(posA, posB, m);
    p += normalize(p + vec3(0.001)) * sin(m * 3.14159) * (1.2 + seed * 2.6);
    p += 0.08 * vec3(sin(uTime * 0.6 + seed * 40.0), cos(uTime * 0.5 + seed * 31.0), sin(uTime * 0.4 + seed * 17.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = clamp((-mv.z - 8.0) / 30.0, 0.0, 1.0);
    vSeed = seed;
    gl_PointSize = uSize * (0.6 + seed * 0.8) * (22.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
  uniform float uTime;
  varying float vSeed;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    vec3 base = vec3(0.62, 0.71, 0.82);
    vec3 accent = vec3(0.30, 0.64, 1.0);
    float isAccent = step(0.93, vSeed);
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.4 + vSeed * 60.0);
    vec3 col = mix(base, accent, isAccent);
    float a = core * twinkle * mix(1.0, 0.28, vDepth) * (isAccent > 0.5 ? 1.3 : 1.0);
    gl_FragColor = vec4(col, a);
  }
`;

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function build(shape: Shape, n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const set = (i: number, x: number, y: number, z: number) => {
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  };
  for (let i = 0; i < n; i++) {
    const r = rand(i);
    const r2 = rand(i + 9173);
    switch (shape) {
      case 'network': {
        const hubs = 6;
        const h = Math.floor(rand(i + 3) * hubs);
        const ha = (h / hubs) * Math.PI * 2;
        const hx = Math.cos(ha) * 8;
        const hy = Math.sin(ha) * 5;
        const hz = Math.sin(ha * 2) * 3;
        const k = i % 10;
        const ox = -4;
        if (k < 2) set(i, ox + hx * r, hy * r, hz * r);
        else if (k < 3) {
          const u = r * 2 - 1;
          const phi = r2 * Math.PI * 2;
          const s = Math.sqrt(1 - u * u) * 1.2;
          set(i, ox + Math.cos(phi) * s, u * 1.2, Math.sin(phi) * s);
        } else {
          const a = r * Math.PI * 2;
          const rad = 2 + r2 * 1.8;
          set(i, ox + hx + Math.cos(a) * rad, hy + Math.sin(a) * rad * 0.8, hz + (rand(i + 11) - 0.5) * 2);
        }
        break;
      }
      case 'globe': {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(1 - y * y);
        const th = i * 2.399963;
        const R = 7.5 + (r - 0.5) * 0.25;
        set(i, Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);
        break;
      }
      case 'helix': {
        const t = i / n;
        const strand = i % 2;
        const a = t * Math.PI * 9 + strand * Math.PI;
        const y = (t - 0.5) * 26;
        const R = 4 + (r - 0.5) * 0.5;
        if (r2 > 0.86) {
          const k = r * 2 - 1;
          set(i, Math.cos(a) * R * k, y, Math.sin(a) * R * k);
        } else set(i, Math.cos(a) * R, y, Math.sin(a) * R);
        break;
      }
      case 'cluster': {
        const pods = 19;
        const p = i % pods;
        const ring = p === 0 ? 0 : p < 7 ? 1 : 2;
        const idx = p === 0 ? 0 : p < 7 ? p - 1 : p - 7;
        const count = ring === 1 ? 6 : 12;
        const ang = (idx / Math.max(count, 1)) * Math.PI * 2 + (ring === 2 ? Math.PI / 12 : 0);
        const cx = ring === 0 ? 0 : Math.cos(ang) * ring * 5.2;
        const cy = ring === 0 ? 0 : Math.sin(ang) * ring * 5.2;
        const u = r * 2 - 1;
        const phi = r2 * Math.PI * 2;
        const s = Math.sqrt(1 - u * u) * 1.5;
        set(i, cx + Math.cos(phi) * s, cy + u * 1.5, Math.sin(phi) * s + (rand(p) - 0.5) * 3);
        break;
      }
      case 'lattice': {
        const g = Math.ceil(Math.cbrt(n));
        const x = i % g;
        const y = Math.floor(i / g) % g;
        const z = Math.floor(i / (g * g));
        const sp = 15 / g;
        set(i, (x - g / 2) * sp, (y - g / 2) * sp, (z - g / 2) * sp);
        break;
      }
      case 'rings': {
        const k = i % 5;
        const a = r * Math.PI * 2;
        const R = 3 + k * 1.4;
        set(i, Math.cos(a) * R, (k - 2) * 0.6 + (r2 - 0.5) * 0.2, Math.sin(a) * R);
        break;
      }
      case 'signal': {
        const k = Math.floor(r2 * 7);
        const a = r * Math.PI * 2;
        const R = 1 + k * 1.6 + (rand(i + 77) - 0.5) * 0.3;
        set(i, Math.cos(a) * R, Math.sin(a) * R, -k * 0.8);
        break;
      }
    }
  }
  return out;
}

export function createAmbient(canvas: HTMLCanvasElement, opts: { reduced: boolean; compact: boolean }): AmbientApi | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.compact ? 1.5 : 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 26);

  const n = opts.compact ? 900 : 2000;
  const seeds = new Float32Array(n);
  for (let i = 0; i < n; i++) seeds[i] = rand(i + 4242);

  const cache = new Map<Shape, Float32Array>();
  const shape = (name: Shape) => {
    let v = cache.get(name);
    if (!v) cache.set(name, (v = build(name, n)));
    return v;
  };
  let from: Shape = 'network';
  let to: Shape = 'globe';
  const posA = shape(from).slice();
  const posB = shape(to).slice();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(posA.slice(), 3));
  geo.setAttribute('posA', new THREE.BufferAttribute(posA, 3));
  geo.setAttribute('posB', new THREE.BufferAttribute(posB, 3));
  geo.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: { uMix: { value: 0 }, uTime: { value: 0 }, uSize: { value: opts.compact ? 4.6 : 5.2 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    group.position.x = w > 900 ? 8 : 0;
    group.scale.setScalar(w > 900 ? 1 : 0.8);
  };
  resize();
  window.addEventListener('resize', resize);

  const pointer = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  const clock = new THREE.Timer();
  let raf = 0;
  let active = false;
  let travel = 0;

  const render = () => renderer.render(scene, camera);

  const pose = (t: number) => {
    group.rotation.y = t * 0.04 + travel * 0.9 + pointer.x * 0.25;
    group.rotation.x = Math.sin(t * 0.1) * 0.08 + pointer.y * 0.15;
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    clock.update();
    const t = clock.getElapsed();
    mat.uniforms.uTime.value = t;
    pose(t);
    render();
  };

  const scrub = (a: Shape, b: Shape, q: number, pageTravel: number) => {
    if (a !== from || b !== to) {
      from = a;
      to = b;
      const A = geo.getAttribute('posA') as THREE.BufferAttribute;
      const B = geo.getAttribute('posB') as THREE.BufferAttribute;
      (A.array as Float32Array).set(shape(a));
      (B.array as Float32Array).set(shape(b));
      A.needsUpdate = true;
      B.needsUpdate = true;
    }
    mat.uniforms.uMix.value = q;
    travel = pageTravel;
    if (opts.reduced && active) {
      pose(0);
      render();
    }
  };

  const setActive = (on: boolean) => {
    if (on === active) return;
    active = on;
    if (opts.reduced) {
      if (on) {
        pose(0);
        render();
      }
      return;
    }
    if (on) {
      if (!raf) frame();
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  return {
    scrub,
    setActive,
    dispose() {
      setActive(false);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
