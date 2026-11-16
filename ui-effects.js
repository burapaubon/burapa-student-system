// Lightweight interaction effects: one delegated listener instead of listeners on every button.
(() => {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    button, .back { -webkit-tap-highlight-color: transparent; }
    .bss-ripple { position:absolute; border-radius:50%; pointer-events:none;
      background:rgba(255,255,255,.35); transform:scale(0); opacity:1;
      animation:bss-ripple-out .48s ease-out forwards; }
    @keyframes bss-ripple-out { to { transform:scale(2); opacity:0; } }
    @media(prefers-reduced-motion:reduce) { .bss-ripple { animation:none; opacity:0; } }
  `;
  document.head.appendChild(style);
  document.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.pointerType === 'touch' && e.isPrimary === false) return;
    const el = e.target.closest?.('button');
    if (!el || el.disabled) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden';
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'bss-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ripple.remove();
  }, { passive: true });
})();
