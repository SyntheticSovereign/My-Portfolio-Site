const KEY = 'taa-sound';
let ctx: AudioContext | null = null;
let enabled = false;

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

function write(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {}
}

export function soundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  write(on);
  if (on && !ctx) ctx = new AudioContext();
  if (on && ctx?.state === 'suspended') void ctx.resume();
  document.dispatchEvent(new CustomEvent('sound-change', { detail: on }));
}

export function initSound() {
  enabled = read();
  const unlock = () => {
    if (!enabled) return;
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
  };
  window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  window.addEventListener('keydown', unlock, { once: true, capture: true });
  return enabled;
}

type Tone = 'alert' | 'detect' | 'click';

export function blip(kind: Tone) {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const spec = {
    alert: { f: 520, to: 380, dur: 0.12, vol: 0.05, type: 'triangle' as OscillatorType },
    detect: { f: 880, to: 1320, dur: 0.09, vol: 0.04, type: 'sine' as OscillatorType },
    click: { f: 1400, to: 1100, dur: 0.035, vol: 0.03, type: 'square' as OscillatorType },
  }[kind];
  osc.type = spec.type;
  osc.frequency.setValueAtTime(spec.f, t);
  osc.frequency.exponentialRampToValueAtTime(spec.to, t + spec.dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(spec.vol, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + spec.dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + spec.dur + 0.02);
}
