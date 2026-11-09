import type { Alert } from '../data/site';
import type { SceneApi } from './scene';
import { lenis, reducedMotion } from './shell';
import { blip } from './sound';

const VERDICT_LABEL: Record<Alert['verdict'], string> = {
  detected: 'Detected',
  blocked: 'Blocked',
  validated: 'Validated',
};

const clockFmt = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Melbourne',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function boot(done: () => void) {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('[data-boot]');
  if (!el || root.hasAttribute('data-booted') || reducedMotion()) {
    done();
    return;
  }
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    el.setAttribute('data-done', '');
    try {
      sessionStorage.setItem('taa-booted', '1');
    } catch {}
    setTimeout(() => {
      root.setAttribute('data-booted', '');
      done();
    }, 200);
  };
  const timer = setTimeout(finish, 1400);
  const skip = () => {
    clearTimeout(timer);
    finish();
  };
  el.querySelector('[data-boot-skip]')?.addEventListener('click', skip);
  window.addEventListener('keydown', skip, { once: true });
  el.addEventListener('pointerdown', skip, { once: true });
}

export async function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const reduced = reducedMotion();
  const alerts: Alert[] = JSON.parse(document.getElementById('alerts-data')?.textContent || '[]');

  boot(() => document.documentElement.setAttribute('data-entered', ''));

  const canvas = hero.querySelector<HTMLCanvasElement>('[data-scene]')!;
  let scene: SceneApi | null = null;
  let hostIndexFor = (_label: string, _n: number) => 0;
  try {
    const mod = await import('./scene');
    hostIndexFor = mod.hostIndexFor;
    scene = mod.createScene(canvas, { reduced, compact: window.innerWidth < 760 });
  } catch {
    scene = null;
  }
  if (!scene) hero.setAttribute('data-no-gl', '');

  const feed = hero.querySelector<HTMLElement>('[data-feed]')!;
  const list = hero.querySelector<HTMLUListElement>('[data-feed-list]')!;
  const listView = hero.querySelector<HTMLElement>('[data-feed-list-view]')!;
  const detail = hero.querySelector<HTMLElement>('[data-feed-detail]')!;
  const pauseBtn = hero.querySelector<HTMLButtonElement>('[data-feed-pause]')!;
  const tag = hero.querySelector<HTMLElement>('[data-host-tag]')!;
  const maxRows = window.innerWidth < 900 ? 4 : 6;

  let cursor = 0;
  let timer = 0;
  let userPaused = false;
  let inView = true;
  let focusedHost: number | null = null;

  const hostOf = (a: Alert) => (scene ? hostIndexFor(a.host, scene.hostCount) : 0);

  function row(a: Alert, state: 'attack' | Alert['verdict'], when: Date) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'alert';
    btn.dataset.state = state;
    const dot = state === 'attack' ? 'dot-attack' : state === 'validated' ? 'dot-resolved' : 'dot-detect';
    btn.innerHTML = `
      <span class="dot ${dot}" aria-hidden="true"></span>
      <span class="alert-title"></span>
      <span class="alert-state mono"></span>
      <span class="alert-meta mono"></span>`;
    btn.querySelector('.alert-title')!.textContent = a.title;
    btn.querySelector('.alert-state')!.textContent = state === 'attack' ? 'Investigating' : VERDICT_LABEL[state];
    btn.querySelector('.alert-meta')!.textContent = `${clockFmt.format(when)} · ${a.technique} · ${a.host}`;
    btn.addEventListener('click', () => openDetail(a));
    li.append(btn);
    return { li, btn };
  }

  function settle(btn: HTMLButtonElement, a: Alert) {
    btn.dataset.state = a.verdict;
    const dot = btn.querySelector('.dot')!;
    dot.classList.remove('dot-attack');
    dot.classList.add(a.verdict === 'validated' ? 'dot-resolved' : 'dot-detect');
    btn.querySelector('.alert-state')!.textContent = VERDICT_LABEL[a.verdict];
  }

  function push(a: Alert, live: boolean) {
    const { li, btn } = row(a, live ? 'attack' : a.verdict, new Date());
    list.prepend(li);
    while (list.children.length > maxRows) list.lastElementChild?.remove();
    if (!live) return;
    blip('alert');
    if (scene) {
      scene.attack(hostOf(a), () => {
        settle(btn, a);
        blip('detect');
      });
    } else {
      setTimeout(() => settle(btn, a), 1600);
    }
  }

  function next() {
    push(alerts[cursor % alerts.length], true);
    cursor++;
  }

  const running = () => !userPaused && inView && !document.hidden && detail.hidden && !reduced;
  function schedule() {
    clearInterval(timer);
    if (running()) timer = window.setInterval(next, 3400);
  }

  const seed = alerts.slice(-3).reverse();
  seed.forEach((a) => push(a, false));
  cursor = 0;
  if (!reduced) setTimeout(() => (running() ? next() : null), 1800);
  else alerts.slice(0, maxRows - seed.length).forEach((a) => push(a, false));
  schedule();

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', String(userPaused));
    pauseBtn.setAttribute('aria-label', userPaused ? 'Resume the live feed' : 'Pause the live feed');
    feed.toggleAttribute('data-paused', userPaused);
    schedule();
  });
  if (reduced) {
    pauseBtn.hidden = true;
    feed.setAttribute('data-paused', '');
  }

  const set = (sel: string, text: string) => {
    detail.querySelector(sel)!.textContent = text;
  };
  let lastTrigger: HTMLElement | null = null;

  function openDetail(a: Alert) {
    lastTrigger = document.activeElement as HTMLElement;
    set('[data-d-tech]', a.technique);
    set('[data-d-title]', a.title);
    set('[data-d-source]', a.source);
    set('[data-d-host]', a.host);
    set('[data-d-sev]', a.severity[0].toUpperCase() + a.severity.slice(1));
    set('[data-d-verdict]', VERDICT_LABEL[a.verdict]);
    set('[data-d-text]', a.detail);
    detail.querySelector<HTMLAnchorElement>('[data-d-link]')!.href = `/work/${a.caseSlug}/`;
    listView.hidden = true;
    detail.hidden = false;
    detail.querySelector<HTMLButtonElement>('[data-feed-back]')!.focus({ preventScroll: true });
    const r = detail.getBoundingClientRect();
    if (r.bottom > window.innerHeight || r.top < 0) {
      const y = window.scrollY + r.bottom - window.innerHeight + 16;
      if (lenis && !reduced) lenis.scrollTo(y, { duration: 0.6 });
      else window.scrollTo(0, y);
    }
    focusedHost = hostOf(a);
    tag.textContent = a.host;
    scene?.focus(focusedHost);
    blip('click');
    schedule();
  }

  function closeDetail() {
    detail.hidden = true;
    listView.hidden = false;
    focusedHost = null;
    tag.hidden = true;
    scene?.focus(null);
    if (lastTrigger?.isConnected) lastTrigger.focus();
    else pauseBtn.focus();
    schedule();
  }
  detail.querySelector('[data-feed-back]')!.addEventListener('click', closeDetail);
  detail.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
  });

  scene?.onFrame((project) => {
    if (focusedHost === null) return;
    const p = project(focusedHost);
    tag.hidden = !p.visible;
    tag.style.transform = `translate(${Math.round(p.x + 14)}px, ${Math.round(p.y - 30)}px)`;
  });

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      scene?.setActive(inView && !document.hidden);
      schedule();
    },
    { threshold: 0.05 },
  );
  io.observe(hero);
  document.addEventListener('visibilitychange', () => {
    scene?.setActive(inView && !document.hidden);
    schedule();
  });
}
