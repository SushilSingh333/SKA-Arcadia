// ===== SKA ARCADIA – Main Script =====

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────────────
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Smooth scroll for nav links ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        const toggler = document.querySelector('.navbar-collapse');
        if (toggler && toggler.classList.contains('show')) {
          toggler.classList.remove('show');
        }
      }
    });
  });

  // ── Scroll Reveal Animation ───────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.floor-card, .loc-card, .amenity-card, .brand-pill, .why-item, .stat-item, .about-features .af-item, .mosaic-main, .mosaic-sm, .invest-img-box, .g-item, .brands-visual img'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, (entry.target.dataset.delay || 0));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Stagger reveal for grid items
  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });

  // ── Hero Form Submit ──────────────────────────────────────────
  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    heroForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast();
      heroForm.reset();
    });
  }

  // ── Enquiry Modal Form Submit ─────────────────────────────────
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', e => {
      e.preventDefault();

      const btn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Button loading state
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>Submitted!';
        btn.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';

        // Close modal and show toast after brief delay
        setTimeout(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('enquiryModal'));
          if (modal) modal.hide();

          showToast();

          enquiryForm.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 1000);
      }, 1200);
    });
  }

  // ── Toast Notification ────────────────────────────────────────
  function showToast() {
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
      toast.show();
    }
  }

  // ── Active Nav Link Highlight on Scroll ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.ska-nav .nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  // ── Floating Button pulse on hover ───────────────────────────
  const floatBtns = document.querySelectorAll('.float-btn');
  floatBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.animation = 'none');
    btn.addEventListener('mouseleave', () => {
      if (btn.classList.contains('wa-btn')) {
        btn.style.animation = 'floatPulse 2s ease-in-out infinite';
      }
    });
  });

  // ── Counter Animation for Stats Bar ──────────────────────────
  function animateCounter(el, target, suffix, duration = 1500) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const statNums = statsBar.querySelectorAll('.stat-num');
        const data = [
          { target: 5, suffix: 'L+' },
          { target: 722, suffix: '' },
          { target: 2, suffix: ' Acres' },
          { target: 15, suffix: '+' }
        ];
        statNums.forEach((el, i) => {
          const d = data[i];
          if (d) animateCounter(el, d.target, d.suffix);
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
  }

  // ── Parallax subtle effect on hero ───────────────────────────
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroSection.style.backgroundPositionY = `${50 + scrolled * 0.15}%`;
      }
    }, { passive: true });
  }

  // ── Mobile: Show floating buttons only after hero ─────────────
  const floatingActions = document.querySelector('.floating-actions');
  if (floatingActions) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        floatingActions.style.opacity = '1';
        floatingActions.style.pointerEvents = 'auto';
      } else {
        floatingActions.style.opacity = '0';
        floatingActions.style.pointerEvents = 'none';
      }
    }, { passive: true });
    // Initial state
    floatingActions.style.transition = 'opacity 0.4s ease';
    floatingActions.style.opacity = '0';
  }

});
