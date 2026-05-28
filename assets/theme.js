/**
 * BIKEXPERT — Main JavaScript
 * Shopify-ready: assets/theme.js
 *
 * Features:
 *  - Sticky / transparent header
 *  - Mobile menu
 *  - Mega menu (hover + keyboard)
 *  - Cart drawer
 *  - Predictive search (UI only, wire to Shopify Search API)
 *  - Accordion
 *  - Brand marquee pause-on-hover
 *  - Lazy image loading
 *  - Scroll animations (IntersectionObserver)
 *  - Announcement-bar dismiss
 *  - Product image gallery (thumbnail click)
 *  - Variant selector highlight
 */

'use strict';

/* ============================================================
   HEADER — sticky + transparent toggle
   ============================================================ */
(function initHeader() {
  const header = document.querySelector('.site-header');
  const announcementBar = document.querySelector('.announcement-bar');
  if (!header) return;

  function updateHeader() {
    const offset = announcementBar ? announcementBar.offsetHeight : 0;
    if (window.scrollY > offset + 10) {
      header.classList.add('scrolled');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      if (header.dataset.transparent === 'true') {
        header.classList.add('transparent');
      }
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();


/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const toggle    = document.querySelector('[data-mobile-menu-toggle]');
  const menu      = document.querySelector('[data-mobile-menu]');
  const closeBtn  = document.querySelector('[data-mobile-menu-close]');
  const overlay   = document.querySelector('[data-mobile-overlay]');
  if (!toggle || !menu) return;

  function open() {
    menu.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }

  function close() {
    menu.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });

  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Accordion inside mobile menu
  menu.querySelectorAll('[data-mobile-nav-parent]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      if (!sub) return;
      const isOpen = sub.classList.contains('open');
      // Close all
      menu.querySelectorAll('[data-mobile-nav-sub]').forEach(s => s.classList.remove('open'));
      menu.querySelectorAll('[data-mobile-nav-parent]').forEach(b => b.setAttribute('aria-expanded', 'false'));
      if (!isOpen) {
        sub.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ============================================================
   MEGA MENU (desktop)
   ============================================================ */
(function initMegaMenu() {
  const triggers = document.querySelectorAll('[data-mega-trigger]');
  let activeMenu = null;
  let closeTimer = null;

  function openMenu(trigger) {
    const id = trigger.dataset.megaTrigger;
    const menu = document.querySelector(`[data-mega-menu="${id}"]`);
    if (!menu) return;
    clearTimeout(closeTimer);
    if (activeMenu && activeMenu !== menu) closeMenu(activeMenu);
    menu.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    activeMenu = menu;
  }

  function closeMenu(menu) {
    if (!menu) return;
    menu.classList.remove('open');
    const trigger = document.querySelector(`[data-mega-trigger="${menu.dataset.megaMenu}"]`);
    trigger?.setAttribute('aria-expanded', 'false');
    if (activeMenu === menu) activeMenu = null;
  }

  triggers.forEach(trigger => {
    const id = trigger.dataset.megaTrigger;
    const menu = document.querySelector(`[data-mega-menu="${id}"]`);

    trigger.addEventListener('mouseenter', () => openMenu(trigger));
    trigger.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => closeMenu(menu), 150);
    });

    menu?.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    menu?.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => closeMenu(menu), 150);
    });

    // Keyboard
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menu?.classList.contains('open') ? closeMenu(menu) : openMenu(trigger);
      }
      if (e.key === 'Escape') closeMenu(menu);
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('[data-mega-trigger]') && !e.target.closest('[data-mega-menu]')) {
      if (activeMenu) closeMenu(activeMenu);
    }
  });
})();


/* ============================================================
   CART DRAWER
   ============================================================ */
(function initCartDrawer() {
  const drawer  = document.querySelector('[data-cart-drawer]');
  const overlay = document.querySelector('[data-cart-overlay]');
  const closeBtns = document.querySelectorAll('[data-cart-close]');
  const openBtns  = document.querySelectorAll('[data-cart-open]');
  if (!drawer) return;

  function openCart() {
    drawer.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('[data-cart-close]')?.focus();
  }

  function closeCart() {
    drawer.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeBtns.forEach(btn => btn.addEventListener('click', closeCart));
  overlay?.addEventListener('click', closeCart);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart();
  });

  // Expose for Shopify AJAX cart
  window.BikexpertCart = { open: openCart, close: closeCart };
})();


/* ============================================================
   PREDICTIVE SEARCH (UI — wire to /search/suggest.json)
   ============================================================ */
(function initSearch() {
  const inputs   = document.querySelectorAll('[data-search-input]');
  const dropdowns = document.querySelectorAll('[data-search-dropdown]');
  if (!inputs.length) return;

  let debounceTimer;

  inputs.forEach((input, i) => {
    const dropdown = dropdowns[i];

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = input.value.trim();

      if (query.length < 2) {
        dropdown?.classList.add('hidden');
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          // Shopify predictive search endpoint
          const res = await fetch(
            `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection&resources[limit]=5`
          );
          if (!res.ok) return;
          const data = await res.json();
          renderSearchResults(dropdown, data.resources.results);
        } catch (_) {
          // Silently fail — search not critical
        }
      }, 250);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown?.classList.add('hidden');
        input.blur();
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('[data-search-wrapper]')) {
        dropdown?.classList.add('hidden');
      }
    });
  });

  function renderSearchResults(dropdown, results) {
    if (!dropdown) return;
    const products = results?.products ?? [];
    if (!products.length) {
      dropdown.innerHTML = '<p class="px-5 py-4 text-sm text-bx-muted">Geen resultaten gevonden.</p>';
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = `
      <ul role="listbox" class="divide-y divide-bx-border">
        ${products.map(p => `
          <li role="option">
            <a href="${p.url}" class="flex items-center gap-4 px-5 py-3 hover:bg-bx-light transition-colors">
              <img src="${p.featured_image?.url ?? ''}" alt="${p.title}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">${p.title}</p>
                <p class="text-xs text-bx-muted">${p.price ? '€ ' + (p.price / 100).toFixed(2).replace('.', ',') : ''}</p>
              </div>
            </a>
          </li>
        `).join('')}
      </ul>
    `;
    dropdown.classList.remove('hidden');
  }
})();


/* ============================================================
   ACCORDION
   ============================================================ */
(function initAccordions() {
  document.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const body    = trigger.nextElementSibling;
      const isOpen  = body?.classList.contains('open');
      const parent  = trigger.closest('[data-accordion-group]');

      // Close siblings if group
      if (parent) {
        parent.querySelectorAll('[data-accordion-body]').forEach(b => b.classList.remove('open'));
        parent.querySelectorAll('[data-accordion-trigger]').forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          t.querySelector('[data-accordion-icon]')?.classList.remove('rotate-180');
        });
      }

      if (!isOpen) {
        body?.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        trigger.querySelector('[data-accordion-icon]')?.classList.add('rotate-180');
      }
    });
  });
})();


/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
(function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
})();


/* ============================================================
   PRODUCT GALLERY (thumbnail → main image)
   ============================================================ */
(function initProductGallery() {
  const galleries = document.querySelectorAll('[data-product-gallery]');

  galleries.forEach(gallery => {
    const mainImg  = gallery.querySelector('[data-gallery-main] img');
    const thumbs   = gallery.querySelectorAll('[data-gallery-thumb]');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        const alt = thumb.dataset.alt ?? '';
        if (mainImg && src) {
          mainImg.src = src;
          mainImg.alt = alt;
        }
        thumbs.forEach(t => t.classList.remove('ring-2', 'ring-bx-black'));
        thumb.classList.add('ring-2', 'ring-bx-black');
      });
    });

    // Activate first thumb
    thumbs[0]?.classList.add('ring-2', 'ring-bx-black');
  });
})();


/* ============================================================
   VARIANT SELECTOR
   ============================================================ */
(function initVariantSelector() {
  document.querySelectorAll('[data-variant-selector]').forEach(selector => {
    const options = selector.querySelectorAll('[data-variant-option]');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected', 'ring-2', 'ring-bx-black'));
        opt.classList.add('selected', 'ring-2', 'ring-bx-black');

        // Update hidden variant input (Shopify)
        const variantInput = document.querySelector('[name="id"]');
        if (variantInput) variantInput.value = opt.dataset.variantId ?? '';
      });
    });
  });
})();


/* ============================================================
   ANNOUNCEMENT BAR — dismiss
   ============================================================ */
(function initAnnouncementBar() {
  const bar       = document.querySelector('[data-announcement-bar]');
  const dismissBtn = document.querySelector('[data-announcement-dismiss]');
  if (!bar || !dismissBtn) return;

  if (sessionStorage.getItem('bx-ann-dismissed') === '1') {
    bar.remove();
    return;
  }

  dismissBtn.addEventListener('click', () => {
    bar.style.maxHeight = bar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      bar.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
      bar.style.maxHeight  = '0';
      bar.style.opacity    = '0';
    });
    setTimeout(() => bar.remove(), 350);
    sessionStorage.setItem('bx-ann-dismissed', '1');
  });
})();


/* ============================================================
   MARQUEE — pause on hover
   ============================================================ */
(function initMarquee() {
  document.querySelectorAll('[data-marquee]').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
    el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
  });
})();
