/**
 * BYZ-Agents Tech Guide — guide.js
 * Sidebar active state + smooth scrollspy
 */
(function () {
  'use strict';

  const HEADER_H = 60;

  /* ── Sidebar scrollspy ── */
  function initScrollSpy() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
    if (!sidebarLinks.length) return;

    const targets = Array.from(sidebarLinks).map(link => {
      const id = link.getAttribute('href').slice(1);
      return { link, el: document.getElementById(id) };
    }).filter(t => t.el);

    function update() {
      const scrollTop = window.scrollY + HEADER_H + 32;
      let activeIdx = 0;
      targets.forEach((t, i) => {
        if (t.el.getBoundingClientRect().top + window.scrollY <= scrollTop) {
          activeIdx = i;
        }
      });
      targets.forEach((t, i) => t.link.classList.toggle('active', i === activeIdx));
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile: hamburger sidebar toggle ── */
  function initMobileMenu() {
    const btn     = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;

    btn.addEventListener('click', () => {
      const open = sidebar.classList.toggle('mobile-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* Close on link click */
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Anchor heading copy links ── */
  function initAnchorLinks() {
    document.querySelectorAll('h2.section-title[id], h3.anchor-heading[id]').forEach(h => {
      const link = document.createElement('a');
      link.href = '#' + h.id;
      link.className = 'anchor-copy';
      link.setAttribute('aria-label', '이 섹션 링크 복사');
      link.innerHTML = '🔗';
      link.style.cssText = 'margin-left:8px;font-size:.75rem;opacity:0;text-decoration:none;transition:opacity .15s';
      h.appendChild(link);

      h.addEventListener('mouseenter', () => link.style.opacity = '1');
      h.addEventListener('mouseleave', () => link.style.opacity = '0');

      link.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#' + h.id);
        navigator.clipboard?.writeText(window.location.href).catch(() => {});
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();
    initMobileMenu();
    initAnchorLinks();
    console.log('[BYZ] Tech Guide init complete');
  });
})();
