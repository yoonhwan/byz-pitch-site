/**
 * BYZ-Agents Scrollytelling — main.js
 * Track A: Technical MVP
 * GSAP + ScrollTrigger 기반 스크롤 애니메이션
 *
 * Smith conditions:
 *  - UNVERIFIED claims (CLM-001,002,003) 숫자 강조 없음
 *  - 접근성: keyboard nav, aria, reduced-motion 지원
 */

(function () {
  'use strict';

  /* ── Reduced motion preference ── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ── Mobile breakpoint ── */
  const isMobile = () => window.innerWidth <= 768;

  /* ── Wait for GSAP ── */
  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[BYZ] GSAP not loaded, retrying...');
      setTimeout(init, 200);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    setup();
  }

  function setup() {

    /* ════════════════════════════════
       1. Progress bar
    ════════════════════════════════ */
    const progressFill = document.getElementById('progress-fill');
    const progressBar  = document.querySelector('.progress-bar');

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        if (progressFill) {
          progressFill.style.width = pct + '%';
        }
        if (progressBar) {
          progressBar.setAttribute('aria-valuenow', pct);
        }
      },
    });

    /* ════════════════════════════════
       2. Hero fade-in
    ════════════════════════════════ */
    const heroContent = document.getElementById('hero-content');
    if (heroContent) {
      if (prefersReducedMotion) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'none';
      } else {
        gsap.to(heroContent, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    }

    /* ════════════════════════════════
       3. Scene Navigation Dots
    ════════════════════════════════ */
    const navDots = document.querySelectorAll('.nav-dot');
    const sceneIds = [
      'scene-hero',
      'scene-arch',
      'scene-pipeline',
      'scene-solo',
      'scene-multi',
    ];

    function setActiveNavDot(targetId) {
      navDots.forEach((dot, i) => {
        const isActive = sceneIds[i] === targetId;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'step' : 'false');
      });
    }

    sceneIds.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el || !navDots[i]) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setActiveNavDot(id);
        },
      });

      /* Click nav dot → scroll to scene */
      navDots[i].addEventListener('click', () => {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      });
    });

    /* Keyboard nav on dots */
    navDots.forEach((dot, i) => {
      dot.addEventListener('keydown', (e) => {
        let targetIdx = i;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIdx = Math.min(i + 1, navDots.length - 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIdx = Math.max(i - 1, 0);
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIdx = navDots.length - 1;
        }
        if (targetIdx !== i) {
          navDots[targetIdx].focus();
          navDots[targetIdx].click();
        }
      });
    });

    /* ════════════════════════════════
       4. S-02: 3-Tier 아키텍처 step reveal
       (skip on mobile — SVG fallback)
    ════════════════════════════════ */
    if (!isMobile()) {
      const archSteps = document.querySelectorAll('.arch-step');
      archSteps.forEach((step, i) => {
        if (prefersReducedMotion) {
          step.classList.add('visible');
          return;
        }
        ScrollTrigger.create({
          trigger: step,
          start: 'top 75%',
          onEnter: () => {
            setTimeout(() => step.classList.add('visible'), i * 150);
          },
          once: true,
        });
      });
    } else {
      /* mobile: show all steps immediately */
      document.querySelectorAll('.arch-step').forEach(s => s.classList.add('visible'));
    }

    /* ════════════════════════════════
       5. S-03: 파이프라인 PIN + progress
       (mobile: stepper tabs only)
    ════════════════════════════════ */
    const pipelineSection = document.getElementById('scene-pipeline');
    const pipelineInner   = document.getElementById('pipeline-inner');
    const pipFill         = document.getElementById('pip-fill');
    const pipeProgressInd = document.getElementById('pipeline-progress-indicator');
    const pipeNodes       = document.querySelectorAll('.pipe-node');
    const pipeConnectors  = document.querySelectorAll('.pipe-connector');

    const PHASE_TEXTS = [
      { src: '마이크에 말하기 시작합니다...', en: 'Start speaking into the microphone...' },
      { src: '안녕하세요, 지금 회의 시작합니다.', en: 'STT processing...' },
      { src: '안녕하세요, 지금 회의 시작합니다.', en: 'Text assembled, translating...' },
      { src: '안녕하세요, 지금 회의 시작합니다.', en: 'Hello, let\'s start the meeting now.' },
      { src: '안녕하세요, 지금 회의 시작합니다.', en: 'Polish: translation quality check...' },
      { src: '안녕하세요, 지금 회의 시작합니다.', en: 'Hello, let\'s start the meeting now. 🔊' },
    ];

    function setPipelinePhase(phase) {
      pipeNodes.forEach((node, i) => {
        node.classList.remove('active', 'done');
        if (i === phase) node.classList.add('active');
        else if (i < phase) node.classList.add('done');
      });
      pipeConnectors.forEach((conn, i) => {
        conn.classList.toggle('active', i < phase);
      });

      if (phase >= 0 && PHASE_TEXTS[phase]) {
        const src = document.getElementById('ptd-text-src');
        const en  = document.getElementById('ptd-text-en');
        if (src) src.textContent = PHASE_TEXTS[phase].src;
        if (en)  en.textContent  = PHASE_TEXTS[phase].en;
      }

      if (pipeProgressInd) {
        const pct = Math.round((phase / (pipeNodes.length - 1)) * 100);
        pipeProgressInd.setAttribute('aria-valuenow', pct);
        if (pipFill) pipFill.style.width = pct + '%';
      }
    }

    if (!isMobile() && pipelineSection && pipelineInner) {
      if (!prefersReducedMotion) {
        /* PIN the inner div */
        ScrollTrigger.create({
          trigger: pipelineSection,
          start: 'top top',
          end: 'bottom bottom',
          pin: pipelineInner,
          scrub: true,
          onUpdate: (self) => {
            const phases = pipeNodes.length;
            const phase  = Math.min(
              Math.floor(self.progress * phases),
              phases - 1
            );
            setPipelinePhase(phase);
          },
        });
      } else {
        /* reduced motion: show all at once */
        setPipelinePhase(pipeNodes.length - 1);
      }
    }

    /* ── Mobile stepper tabs ── */
    const pmTabs = document.querySelectorAll('.pm-tab');
    const pmPanels = document.querySelectorAll('.pm-panel');

    pmTabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        pmTabs.forEach((t, j) => {
          const active = j === i;
          t.setAttribute('aria-selected', active ? 'true' : 'false');
          t.classList.toggle('active', active);
        });
        pmPanels.forEach((p, j) => {
          p.classList.toggle('active', j === i);
        });
      });
    });

    /* ════════════════════════════════
       6. S-04: 싱글 통역 step reveal
    ════════════════════════════════ */
    const soloSteps = document.querySelectorAll('.solo-step');
    soloSteps.forEach((step, i) => {
      if (prefersReducedMotion) {
        step.classList.add('visible');
        return;
      }
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => step.classList.add('visible'), i * 120);
        },
        once: true,
      });
    });

    /* ════════════════════════════════
       7. S-05: 멀티 유저 step reveal
    ════════════════════════════════ */
    const multiSteps = document.querySelectorAll('.multi-step');
    multiSteps.forEach((step, i) => {
      if (prefersReducedMotion) {
        step.classList.add('visible');
        return;
      }
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        onEnter: () => {
          setTimeout(() => step.classList.add('visible'), i * 120);
        },
        once: true,
      });
    });

    /* ════════════════════════════════
       8. Scene section aria-label
          current region 관리
    ════════════════════════════════ */
    const mainSections = document.querySelectorAll('.scene[role="region"]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mainSections.forEach((s) => s.removeAttribute('aria-current'));
            entry.target.setAttribute('aria-current', 'true');
          }
        });
      },
      { threshold: 0.4 }
    );
    mainSections.forEach((s) => observer.observe(s));

    /* ════════════════════════════════
       9. Window resize: refresh ScrollTrigger
    ════════════════════════════════ */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    });

    console.log('[BYZ] Scrollytelling init complete — Track A MVP');
  }

  /* Start */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
