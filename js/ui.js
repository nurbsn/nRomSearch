/**
 * nRomSearch - Moduł UI do renderowania interfejsu i obsługi modali
 */

import { PLATFORMS, getExternalSearchLinks } from './api.js';

/**
 * Formatowanie liczby pobrań (np. 12500 -> 12.5k)
 */
function formatDownloads(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}

/**
 * Renderowanie listy platform (pigułki / pills)
 */
export function renderPlatforms(container, activeId, onSelect) {
  if (!container) return;
  container.innerHTML = '';

  PLATFORMS.forEach(platform => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `platform-pill ${platform.id === activeId ? 'active' : ''}`;
    btn.setAttribute('data-id', platform.id);
    btn.innerHTML = `<span class="platform-icon">${platform.icon}</span> <span>${platform.shortName}</span>`;

    btn.addEventListener('click', () => {
      onSelect(platform.id);
    });

    container.appendChild(btn);
  });
}

/**
 * Renderowanie szybkich linków wyszukiwania w zewnętrznych serwisach
 * (FreeROMS, Romspedia, EmuParadise, Retrostic)
 */
export function renderExternalQuickLinks(container, query, platformId) {
  if (!container) return;
  const links = getExternalSearchLinks(query, platformId);

  container.innerHTML = links.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="ext-search-pill" style="--brand-color: ${link.color};" title="Wyszukaj w ${link.name}">
      <span>${link.icon}</span>
      <span>${link.name}</span>
      <span class="ext-icon-arrow">↗</span>
    </a>
  `).join('');
}

/**
 * Renderowanie szkieletu ładowania (Skeleton Loader 3:4)
 */
export function renderSkeletons(container, count = 12) {
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skeleton-media skeleton-shimmer"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w-80 skeleton-shimmer"></div>
        <div class="skeleton-line w-50 skeleton-shimmer"></div>
        <div class="skeleton-line w-100 skeleton-shimmer"></div>
      </div>
    `;
    container.appendChild(card);
  }
}

/**
 * Renderowanie siatki gier (Większe zdjęcia, proporcje Box-art 3:4, bez ikony i napisu retro rom)
 */
export function renderGames(container, games, onGameClick) {
  if (!container) return;
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${game.title} - Wybierz aby pobrać`);

    // Kontener okładki z dyskretnym znakiem wodnym platformy
    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'card-media-wrapper';

    // Faint watermark in background
    const watermark = document.createElement('span');
    watermark.className = 'card-watermark';
    watermark.textContent = game.platformName || (game.isCatalog ? 'GAME' : 'ROM');
    mediaWrapper.appendChild(watermark);

    // Zdjęcie / Okładka (bez żadnych inline skryptów z błędnymi cudzysłowami)
    if (game.thumbnail) {
      const img = document.createElement('img');
      img.src = game.thumbnail;
      img.alt = game.title;
      img.className = 'card-img';
      img.loading = 'lazy';
      img.addEventListener('error', () => {
        img.style.display = 'none';
      });
      mediaWrapper.appendChild(img);
    }

    // Odznaka pobrań lub bazy gier
    if (game.downloads) {
      const badge = document.createElement('div');
      badge.className = 'card-badge-downloads';
      badge.title = 'Liczba pobrań z Internet Archive';
      badge.textContent = `⬇ ${formatDownloads(game.downloads)}`;
      mediaWrapper.appendChild(badge);
    } else if (game.isCatalog) {
      const tagBadge = document.createElement('div');
      tagBadge.className = 'card-badge-tag';
      tagBadge.textContent = game.platformName || 'Katalog';
      mediaWrapper.appendChild(tagBadge);
    }

    // Dolna sekcja karty
    const body = document.createElement('div');
    body.className = 'card-body';

    const titleEl = document.createElement('h3');
    titleEl.className = 'card-title';
    titleEl.title = game.title;
    titleEl.textContent = game.title;

    const metaRow = document.createElement('div');
    metaRow.className = 'card-meta-row';

    const yearSpan = document.createElement('span');
    yearSpan.textContent = game.year ? `📅 ${game.year}` : (game.platformName || 'Retro');

    const subSpan = document.createElement('span');
    if (game.publisher) {
      subSpan.textContent = `🏢 ${game.publisher.substring(0, 15)}`;
    } else if (game.collections?.[0]) {
      subSpan.textContent = `📦 ${game.collections[0].substring(0, 15)}`;
    }

    metaRow.appendChild(yearSpan);
    metaRow.appendChild(subSpan);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card-btn-action';
    btn.innerHTML = `<span>💾 Pobierz ROM</span>`;

    body.appendChild(titleEl);
    body.appendChild(metaRow);
    body.appendChild(btn);

    card.appendChild(mediaWrapper);
    card.appendChild(body);

    const triggerSelect = () => onGameClick(game);
    card.addEventListener('click', triggerSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSelect();
      }
    });

    container.appendChild(card);
  });
}

/**
 * Pusty stan - brak wyników
 */
export function renderEmptyState(container, query, platformName) {
  if (!container) return;
  container.innerHTML = `
    <div class="state-message-box">
      <div class="state-icon">🔍</div>
      <h3 class="state-title">Brak wyników</h3>
      <p class="state-desc">
        Nie znaleziono gier dla frazy <strong>"${query || 'wszystkie'}"</strong> w kategorii <strong>${platformName || 'wybranej'}</strong>.<br/>
        Spróbuj zmienić słowo kluczowe, przełącz tryb źródła lub wybierz inną platformę.
      </p>
    </div>
  `;
}

/**
 * Stan błędu sieciowego
 */
export function renderErrorState(container, message, onRetry) {
  if (!container) return;
  container.innerHTML = `
    <div class="state-message-box">
      <div class="state-icon">⚠️</div>
      <h3 class="state-title">Wystąpił problem z połączeniem</h3>
      <p class="state-desc">${message || 'Nie udało się pobrać danych.'}</p>
      <button type="button" class="btn-primary" id="btn-retry-action">
        🔄 Spróbuj ponownie
      </button>
    </div>
  `;

  const retryBtn = container.querySelector('#btn-retry-action');
  if (retryBtn && onRetry) {
    retryBtn.addEventListener('click', onRetry);
  }
}

/**
 * Renderowanie paginacji
 */
export function renderPagination(container, { page, totalPages, total, onPageChange }) {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="pagination-container">
      <button type="button" class="btn-page" id="btn-prev-page" ${page <= 1 ? 'disabled' : ''}>
        ⬅ Poprzednia
      </button>
      <span class="page-indicator">Strona <strong>${page}</strong> z <strong>${totalPages}</strong> (${total.toLocaleString()} pozycji)</span>
      <button type="button" class="btn-page" id="btn-next-page" ${page >= totalPages ? 'disabled' : ''}>
        Następna ➡
      </button>
    </div>
  `;

  container.querySelector('#btn-prev-page')?.addEventListener('click', () => {
    if (page > 1) onPageChange(page - 1);
  });

  container.querySelector('#btn-next-page')?.addEventListener('click', () => {
    if (page < totalPages) onPageChange(page + 1);
  });
}

/**
 * Otwiera modal ładowania listy plików
 */
export function showModalLoading(modalBackdrop, game) {
  if (!modalBackdrop) return;

  const modalTitle = modalBackdrop.querySelector('#modal-game-title');
  const modalBody = modalBackdrop.querySelector('#modal-game-body');

  if (modalTitle) modalTitle.textContent = game.title;
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="modal-game-hero">
        ${game.thumbnail ? `<img src="${game.thumbnail}" alt="" class="modal-game-cover" onerror="this.style.display='none';" />` : ''}
        <div class="modal-game-details">
          <h4 class="modal-game-title">${game.title}</h4>
          <span class="modal-game-id">${game.year ? 'Rok: ' + game.year : ''} ${game.publisher ? '• Wydawca: ' + game.publisher : ''}</span>
        </div>
      </div>
      <div class="files-list-container">
        <h5 class="files-section-title">Wyszukiwanie plików ROM w archiwum...</h5>
        <div class="skeleton-line w-100 skeleton-shimmer" style="height: 48px;"></div>
        <div class="skeleton-line w-100 skeleton-shimmer" style="height: 48px;"></div>
        <div class="skeleton-line w-100 skeleton-shimmer" style="height: 48px;"></div>
      </div>
    `;
  }

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
}

/**
 * Renderuje listę plików w modalu
 */
export function populateFilesModal(modalBackdrop, game, filesData, onCopyToast) {
  if (!modalBackdrop) return;
  const modalBody = modalBackdrop.querySelector('#modal-game-body');
  if (!modalBody) return;

  const { romFiles = [], otherFiles = [], identifier, searchUrl } = filesData;

  let contentHtml = `
    <div class="modal-game-hero">
      ${game.thumbnail ? `<img src="${game.thumbnail}" alt="" class="modal-game-cover" onerror="this.style.display='none';" />` : ''}
      <div class="modal-game-details">
        <h4 class="modal-game-title">${game.title}</h4>
        <span class="modal-game-id">${identifier ? 'Archiwum: ' + identifier : (game.platformName || 'Gra retro')}</span>
      </div>
    </div>
  `;

  if (romFiles.length === 0 && otherFiles.length === 0) {
    contentHtml += `
      <div class="state-message-box" style="padding: 24px;">
        <p>Nie znaleziono bezpośredniego pliku ROM w pojedynczym archiwum dla tego tytułu.</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Gra może znajdować się w zbiorze wielopłytowym lub pełnym secie danej konsoli.</p>
        <a href="${searchUrl || `https://archive.org/search.php?query=${encodeURIComponent(game.title)}`}" target="_blank" rel="noopener" class="btn-primary" style="margin-top: 10px;">
          🌐 Wyszukaj w Internet Archive
        </a>
      </div>
    `;
  } else {
    // Lista plików ROM
    contentHtml += `
      <div class="files-list-container">
        <h5 class="files-section-title">Dostępne pliki ROM (${romFiles.length})</h5>
    `;

    romFiles.forEach((file) => {
      contentHtml += `
        <div class="file-row">
          <div class="file-info">
            <span class="file-name" title="${file.filename}">${file.filename}</span>
            <div class="file-meta-tags">
              <span class="badge-ext">${file.extension ? file.extension.replace('.', '') : file.format}</span>
              <span>💾 ${file.formattedSize}</span>
            </div>
          </div>
          <div class="file-actions">
            <button type="button" class="btn-file-copy" data-url="${file.downloadUrl}" title="Kopiuj bezpośredni link">
              🔗
            </button>
            <a href="${file.downloadUrl}" download="${file.filename}" class="btn-file-dl" target="_blank" rel="noopener">
              ⬇ Pobierz
            </a>
          </div>
        </div>
      `;
    });

    contentHtml += `</div>`;

    // Inne pliki (jeśli istnieją)
    if (otherFiles.length > 0) {
      contentHtml += `
        <details style="margin-top: 10px;">
          <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.85rem; padding: 6px 0;">
            Pokaż pozostałe pliki archiwum (${otherFiles.length})
          </summary>
          <div class="files-list-container" style="margin-top: 10px;">
      `;

      otherFiles.forEach((file) => {
        contentHtml += `
          <div class="file-row">
            <div class="file-info">
              <span class="file-name" title="${file.filename}">${file.filename}</span>
              <div class="file-meta-tags">
                <span class="badge-ext">${file.extension ? file.extension.replace('.', '') : file.format}</span>
                <span>💾 ${file.formattedSize}</span>
              </div>
            </div>
            <div class="file-actions">
              <button type="button" class="btn-file-copy" data-url="${file.downloadUrl}" title="Kopiuj bezpośredni link">
                🔗
              </button>
              <a href="${file.downloadUrl}" download="${file.filename}" class="btn-file-dl" target="_blank" rel="noopener">
                ⬇ Pobierz
              </a>
            </div>
          </div>
        `;
      });

      contentHtml += `
          </div>
        </details>
      `;
    }
  }

  // Sekcja zewnętrznych serwisów (FreeROMS, Romspedia, EmuParadise, Retrostic)
  const extLinks = getExternalSearchLinks(game.cleanTitle || game.title, game.platformId);
  contentHtml += `
    <div class="external-providers-container">
      <h5 class="files-section-title">🌐 Szukaj w innych serwisach (Alternatywne źródła)</h5>
      <div class="external-providers-grid">
        ${extLinks.map(ext => `
          <a href="${ext.url}" target="_blank" rel="noopener noreferrer" class="ext-provider-card" style="--brand-color: ${ext.color};" title="Wyszukaj ${game.title} na ${ext.domain}">
            <div class="ext-provider-info">
              <span class="ext-provider-icon">${ext.icon}</span>
              <span class="ext-provider-name">${ext.name}</span>
            </div>
            <span class="ext-provider-action">Otwórz ↗</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  modalBody.innerHTML = contentHtml;

  // Obsługa kopiowania linków
  modalBody.querySelectorAll('.btn-file-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        try {
          await navigator.clipboard.writeText(url);
          if (onCopyToast) onCopyToast('Skopiowano bezpośredni link do schowka!');
        } catch {
          if (onCopyToast) onCopyToast('Nie udało się skopiować linku.');
        }
      }
    });
  });
}

/**
 * Zamknięcie modalu
 */
export function closeModal(modalBackdrop) {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

/**
 * Wyświetlenie powiadomienia Toast
 */
export function showToast(toastContainer, message, duration = 3000) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
