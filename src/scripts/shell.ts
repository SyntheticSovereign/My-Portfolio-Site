import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSound, setSound, soundOn, blip } from './sound';

gsap.registerPlugin(ScrollTrigger);

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export let lenis: Lenis | null = null;

function startScroll() {
  if (reducedMotion()) return;
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!a || !lenis) return;
    const url = new URL(a.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    const bar = document.querySelector<HTMLElement>('[data-topbar]')?.offsetHeight ?? 60;
    lenis.scrollTo(target as HTMLElement, { offset: -(bar + 12) });
    history.pushState(null, '', url.hash);
  });
}

function topbar() {
  const bar = document.querySelector<HTMLElement>('[data-topbar]');
  if (!bar) return;
  const update = () => bar.toggleAttribute('data-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function menu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!btn || !panel) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
    if (open) lenis?.stop();
    else lenis?.start();
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  panel.querySelectorAll('[data-menu-link]').forEach((l) => l.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      set(false);
      btn.focus();
    }
  });
}

function soundToggle() {
  const btn = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!btn) return;
  const paint = (on: boolean) => {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Sound on. Turn interface sound off' : 'Sound off. Turn interface sound on');
  };
  paint(initSound());
  btn.addEventListener('click', () => {
    const on = !soundOn();
    setSound(on);
    paint(on);
    blip('click');
  });
}

export function initShell() {
  startScroll();
  topbar();
  menu();
  soundToggle();
}
