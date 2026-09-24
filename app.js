(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const header = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');

  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMobileMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav?.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  $$('a', nav).forEach(link => link.addEventListener('click', closeMobileMenu));

  const openStatus = $('[data-open-status]');
  const updateOpenStatus = () => {
    if (!openStatus) return;
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const hour = Number(parts.find(part => part.type === 'hour')?.value || 0);
    const minute = Number(parts.find(part => part.type === 'minute')?.value || 0);
    const total = hour * 60 + minute;
    const isOpen = total >= 600 && total < 1320;
    openStatus.classList.toggle('is-open', isOpen);
    openStatus.classList.toggle('is-closed', !isOpen);
    $('span:last-child', openStatus).textContent = isOpen
      ? 'Open today until 10:00 PM'
      : 'Closed now · Opens at 10:00 AM';
  };
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  const revealItems = $$('.reveal');
  revealItems.forEach(item => {
    const delay = Number(item.dataset.delay || 0);
    item.style.transitionDelay = `${delay}ms`;
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const menuList = $('[data-menu-list]');
  const menuEmpty = $('[data-menu-empty]');
  const menuSearch = $('[data-menu-search]');
  const filterButtons = $$('[data-filter]');
  const menu = Array.isArray(window.KLEENEST_MENU) ? window.KLEENEST_MENU : [];
  let currentFilter = 'all';
  let currentSearch = '';

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  })[char]);

  const renderMenu = () => {
    if (!menuList) return;
    const filtered = menu.filter(item => {
      const categoryMatch = currentFilter === 'all' || item.category === currentFilter;
      const haystack = `${item.name} ${item.description} ${item.tag}`.toLowerCase();
      return categoryMatch && haystack.includes(currentSearch);
    });

    menuList.innerHTML = filtered.map((item, index) => `
      <article class="menu-item" style="animation-delay:${Math.min(index * 30, 240)}ms">
        <div>
          <span class="menu-tag">${escapeHtml(item.tag)}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
        ${item.price ? `<span class="menu-price">${escapeHtml(item.price)}</span>` : ''}
      </article>
    `).join('');

    if (menuEmpty) menuEmpty.hidden = filtered.length !== 0;
  };

  filterButtons.forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter || 'all';
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    renderMenu();
  }));
  menuSearch?.addEventListener('input', event => {
    currentSearch = event.target.value.trim().toLowerCase();
    renderMenu();
  });
  renderMenu();

  const reserveDialog = $('[data-reserve-dialog]');
  const reserveForm = $('[data-reserve-form]');
  const reserveNote = $('[data-form-note]');
  const openReserve = () => {
    closeMobileMenu();
    reserveDialog?.showModal();
    document.body.classList.add('dialog-open');
    const dateInput = $('input[name="date"]', reserveForm);
    if (dateInput && !dateInput.min) {
      const now = new Date();
      const inManila = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      const yyyy = inManila.getFullYear();
      const mm = String(inManila.getMonth() + 1).padStart(2, '0');
      const dd = String(inManila.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
  };
  const closeReserve = () => {
    reserveDialog?.close();
    document.body.classList.remove('dialog-open');
  };
  $$('[data-reserve-open]').forEach(button => button.addEventListener('click', openReserve));
  $('[data-reserve-close]')?.addEventListener('click', closeReserve);
  reserveDialog?.addEventListener('click', event => {
    if (event.target === reserveDialog) closeReserve();
  });
  reserveDialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

  reserveForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(reserveForm);
    const message = [
      'Hello Kleenest Bistro! I would like to request a table reservation.',
      '',
      `Name: ${data.get('name')}`,
      `Date: ${data.get('date')}`,
      `Time: ${data.get('time')}`,
      `Guests: ${data.get('guests')}`,
      `Occasion: ${data.get('occasion') || 'Not specified'}`,
      `Notes: ${data.get('notes') || 'None'}`,
      '',
      'Please confirm availability. Thank you!'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
      if (reserveNote) reserveNote.textContent = 'Reservation details copied. Paste them into Messenger to send.';
    } catch {
      if (reserveNote) reserveNote.textContent = 'Messenger is opening. Please send your reservation details there.';
    }
    window.open('https://m.me/61568656615106', '_blank', 'noopener');
  });

  const lightbox = $('[data-lightbox]');
  const lightboxImage = $('[data-lightbox-image]');
  $$('[data-gallery-src]').forEach(item => item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.gallerySrc || '';
    lightboxImage.alt = item.dataset.galleryAlt || '';
    lightbox.showModal();
  }));
  $('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
})();
