/**
 * COLEGIO AUGUSTO RUSCHI - LANDING PAGE JS (Redesign v2)
 * Features: UTM tracking, WhatsApp Smart Routing, GSAP animations,
 *           FAQ accordion, Gallery scroll, Modal popup.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navbar = document.getElementById('navbar');
  
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navbar.classList.toggle('active');
    });

    // Fechar menu ao clicar em links
    document.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navbar.classList.remove('active');
      });
    });
  }

  // Efeito de scroll na navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Phone Input Mask (Brazilian format)
  const phoneInput = document.getElementById('form-whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-content').style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // 4. WhatsApp Smart Routing & UTM Persistence
  const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  const STORAGE_KEY = 'car_lp_utm_context';
  const EXPIRY_DAYS = 30;
  const BASE_WA_NUMBER = '551124533535';

  function captureCampaignContext() {
    const urlParams = new URLSearchParams(window.location.search);
    let utmData = {};
    let hasUtm = false;

    UTM_PARAMS.forEach(param => {
      const val = urlParams.get(param);
      if (val) {
        utmData[param] = decodeURIComponent(val);
        hasUtm = true;
      }
    });

    if (hasUtm) {
      const storeObj = {
        data: utmData,
        expiresAt: Date.now() + (EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeObj));
    }
  }

  function getCampaignContext() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const storeObj = JSON.parse(raw);
      if (Date.now() > storeObj.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return storeObj.data;
    } catch (e) {
      return null;
    }
  }

  function buildContextWaMessage(eventId, serie = null) {
    const context = getCampaignContext();
    let sourceStr = 'site';

    if (context) {
      const source = context.utm_source ? context.utm_source.toLowerCase() : '';
      if (source.includes('google')) {
        sourceStr = 'Google Ads';
      } else if (source.includes('meta') || source.includes('instagram') || source.includes('facebook')) {
        sourceStr = 'anúncio no Instagram/Facebook';
      } else {
        sourceStr = `campanha (${source})`;
      }
    }

    let msg = `Olá! Vim pelo ${sourceStr} e gostaria de agendar uma visita ao Colégio Augusto Ruschi.`;
    
    if (serie) {
      msg = `Olá! Vim pelo ${sourceStr} e gostaria de saber mais sobre matrículas para o ${serie}.`;
    }

    if (eventId === 'hero_whatsapp') {
      msg = `Olá! Vim pelo ${sourceStr} e gostaria de falar com a equipe de atendimento do Augusto Ruschi.`;
    } else if (eventId === 'segmentos_whatsapp') {
      msg = `Olá! Vim pelo ${sourceStr} e gostaria de consultar a disponibilidade de vagas para matrículas.`;
    }

    return encodeURIComponent(msg);
  }

  function rewriteWhatsAppLinks() {
    const waLinks = document.querySelectorAll('a[href*="wa.me"]');
    waLinks.forEach(link => {
      const eventId = link.getAttribute('data-event') || 'default';
      const textParam = buildContextWaMessage(eventId);
      
      let number = BASE_WA_NUMBER;
      const match = link.href.match(/wa\.me\/(\d+)/);
      if (match && match[1]) {
        number = match[1];
      }

      link.href = `https://wa.me/${number}?text=${textParam}`;
    });
  }

  captureCampaignContext();
  rewriteWhatsAppLinks();

  // 5. Form submission with UTM pass-through
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    const context = getCampaignContext();
    if (context) {
      UTM_PARAMS.forEach(param => {
        const input = document.getElementById(`utm-${param}`);
        if (input && context[param]) {
          input.value = context[param];
        }
      });
    }

    const pageUrlInput = document.getElementById('utm-page_url');
    if (pageUrlInput) pageUrlInput.value = window.location.href;

    const referrerInput = document.getElementById('utm-referrer');
    if (referrerInput) referrerInput.value = document.referrer;

    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nome = document.getElementById('form-name').value.trim();
      const whatsapp = document.getElementById('form-whatsapp').value.trim();
      const serie = document.getElementById('form-serie').value;
      const horario = document.getElementById('form-time').value;
      const lgpd = document.getElementById('form-lgpd').checked;

      if (!nome || !whatsapp || !serie || !horario) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!lgpd) {
        alert('Você precisa aceitar a Política de Privacidade.');
        return;
      }

      const formattedMessage = buildContextWaMessage('form_submit', serie);
      const whatsappUrl = `https://wa.me/${BASE_WA_NUMBER}?text=${formattedMessage}`;
      
      window.open(whatsappUrl, '_blank');

      const thankYouUrl = new URL('obrigado.html', window.location.href);
      thankYouUrl.searchParams.set('name', nome);
      thankYouUrl.searchParams.set('serie', serie);
      
      window.location.href = thankYouUrl.toString();
    });
  }

  // 6. Lenis Smooth Scroll
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      infinite: false,
      gestureOrientation: 'vertical',
      normalizeWheel: true
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          lenisInstance.scrollTo(target, {
            offset: -80,
            duration: 1.5
          });
        }
      });
    });
  }

  // 7. GSAP ScrollTrigger reveals
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in para data-reveal
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const direction = el.getAttribute('data-reveal') || 'up';
      let yVal = 30;
      
      if (direction === 'down') yVal = -30;
      if (direction === 'none') yVal = 0;

      gsap.fromTo(el, 
        { opacity: 0, y: yVal }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Efeito cascata para grids
    document.querySelectorAll('[data-reveal-grid]').forEach(grid => {
      const children = grid.children;
      if (children.length > 0) {
        gsap.fromTo(children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: grid,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });
  }

  // 8. Form Modal (Popup) Toggle
  const modalOverlay = document.getElementById('form-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTriggers = document.querySelectorAll('[data-trigger-modal="true"]');

  if (modalOverlay && modalCloseBtn) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    });
  }

  // 9. Gallery Horizontal Scroll (NOVO)
  const galleryTrack = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (galleryTrack && prevBtn && nextBtn) {
    const scrollAmount = 340;

    prevBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // 10. Segment items hover interaction
  const segmentItems = document.querySelectorAll('.segment-item');
  segmentItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      segmentItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
});

// ==========================================================================
// VIMEO PLAYER INTERACTION & AUTOPLAY ON SCROLL
// ==========================================================================
let vimeoPlayer = null;

function initVimeoPlayer() {
  const iframe = document.getElementById('about-vimeo-player');
  if (!iframe) return;

  vimeoPlayer = new Vimeo.Player(iframe);
  setupVimeoObserver(vimeoPlayer);
}

function setupVimeoObserver(playerInstance) {
  const videoWrapper = document.querySelector('.about-video-wrapper');
  if (!videoWrapper) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playerInstance.play().catch(err => console.log("Vimeo play error:", err));
      } else {
        playerInstance.pause().catch(err => console.log("Vimeo pause error:", err));
      }
    });
  }, {
    threshold: 0.25
  });

  observer.observe(videoWrapper);
}

// Load Vimeo Player SDK dynamically
(function() {
  const tag = document.createElement('script');
  tag.src = "https://player.vimeo.com/api/player.js";
  tag.onload = function() {
    initVimeoPlayer();
  };
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();
