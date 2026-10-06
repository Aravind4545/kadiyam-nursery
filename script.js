/**
 * KADIYAM NURSERIES — Botanical Archive & Interactive Experiences
 * Handles Video Playback, Specimen Filters, Fullscreen Lightbox & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 01. HEADER NAVIGATION & SCROLL LISTENER
  // =========================================================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    const heroHeight = document.getElementById('hero')?.offsetHeight || (window.innerHeight * 0.75);
    if (window.scrollY > (heroHeight - 90)) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // =========================================================================
  // 02. MOBILE DRAWER NAVIGATION
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // =========================================================================
  // 03. HERO VIDEO AUTOPLAY ASSURANCE
  // =========================================================================
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // Browser restricted autoplay; keep muted and ready
      heroVideo.muted = true;
      heroVideo.play().catch(e => console.log('Autoplay deferred:', e));
    });
  }

  // =========================================================================
  // 04. CINEMATIC DRONE TOUR VIDEO PLAYER
  // =========================================================================
  const tourVideo = document.getElementById('tourVideo');
  const ctrlPlayToggle = document.getElementById('ctrlPlayToggle');
  const ctrlMuteToggle = document.getElementById('ctrlMuteToggle');
  const progressTrack = document.getElementById('progressTrack');
  const progressFill = document.getElementById('progressFill');
  const ctrlFullscreen = document.getElementById('ctrlFullscreen');
  const cinemaCard = document.getElementById('cinemaCard');

  if (tourVideo) {
    // Autoplay tour video muted
    tourVideo.play().catch(() => {
      tourVideo.muted = true;
      tourVideo.play().catch(() => {});
    });

    const toggleTourPlay = () => {
      if (tourVideo.paused) {
        tourVideo.play().then(() => {
          if (ctrlPlayToggle) ctrlPlayToggle.querySelector('.ctrl-icon').textContent = '⏸';
        }).catch(err => console.log('Video play error:', err));
      } else {
        tourVideo.pause();
        if (ctrlPlayToggle) ctrlPlayToggle.querySelector('.ctrl-icon').textContent = '▶';
      }
    };

    tourVideo.addEventListener('click', toggleTourPlay);
    if (ctrlPlayToggle) ctrlPlayToggle.addEventListener('click', toggleTourPlay);

    // Mute / Unmute toggle
    if (ctrlMuteToggle) {
      ctrlMuteToggle.addEventListener('click', () => {
        tourVideo.muted = !tourVideo.muted;
        const icon = ctrlMuteToggle.querySelector('.ctrl-icon');
        icon.textContent = tourVideo.muted ? '🔇' : '🔊';
      });
    }

    // Video Progress bar update
    tourVideo.addEventListener('timeupdate', () => {
      if (tourVideo.duration) {
        const percent = (tourVideo.currentTime / tourVideo.duration) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
      }
    });

    // Seek on progress track click
    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        tourVideo.currentTime = clickPos * tourVideo.duration;
      });
    }

    // Fullscreen toggle
    if (ctrlFullscreen && cinemaCard) {
      ctrlFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (tourVideo.requestFullscreen) {
            tourVideo.requestFullscreen();
          } else if (tourVideo.webkitRequestFullscreen) {
            tourVideo.webkitRequestFullscreen();
          }
        } else {
          document.exitFullscreen();
        }
      });
    }

    // Auto pause when out of view
    if ('IntersectionObserver' in window) {
      const tourObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !tourVideo.paused) {
            tourVideo.pause();
            if (ctrlPlayToggle) ctrlPlayToggle.querySelector('.ctrl-icon').textContent = '▶';
          }
        });
      }, { threshold: 0.2 });
      tourObserver.observe(tourVideo);
    }
  }

  // =========================================================================
  // 05. BOTANICAL ARCHIVE CATEGORY FILTER
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const specimenCards = document.querySelectorAll('.specimen-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetFilter = btn.getAttribute('data-filter');

      // Toggle active filter button styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      specimenCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (targetFilter === 'all' || category === targetFilter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 06. FULLSCREEN LIGHTBOX MODAL
  // =========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  const openLightbox = (imgSrc, captionText) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = captionText || 'Kadiyam Nursery Photo';
    if (lightboxCaption) lightboxCaption.textContent = captionText || '';
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
    }, 300);
  };

  // Bind click on all elements with data-lightbox
  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = el.getAttribute('data-lightbox');
      const captionText = el.getAttribute('data-caption') || el.querySelector('img')?.alt || '';
      openLightbox(imgSrc, captionText);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  // Close when clicking backdrop
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('open')) {
        closeLightbox();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    }
  });

});
