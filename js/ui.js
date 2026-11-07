/**
 * nRomSearch - Moduł UI do renderowania interfejsu i obsługi modali
 */

import { PLATFORMS } from './api.js';

// Szablon placeholder SVG dla gier bez okładki
const FALLBACK_SVG = `
  <div class="card-placeholder-fallback">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M6 12h4m-2-2v4" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <circle cx="18" cy="13" r="1" fill="currentColor" />
    </svg>
    <span>Retro ROM</span>
  </div>
`;

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
 * Renderowanie szkieletu ładowania (Skeleton Loader)
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
 * Renderowanie siatki gier
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

    // Obrazek lub fallback
    const imgHtml = `
      <div class="card-media-wrapper">
        <img 
          src="${game.thumbnail}" 
          alt="${game.title}" 
          class="card-img" 
          loading="lazy"
          onerror="this.onerror=null; this.parentElement.innerHTML = \`${FALLBACK_SVG}\`;"
        />
        <div class="card-badge-downloads" title="Liczba pobrań z Internet Archive">
          ⬇ ${formatDownloads(game.downloads)}
        </div>
      </div>
    `;

    const bodyHtml = `
      <div class="card-body">
        <h3 class="card-title" title="${game.title}">${game.title}</h3>
        <div class="card-meta-row">
          <span>${game.year ? '📅 ' + game.year : 'Retro'}</span>
          <span>${game.collections?.[0] ? '📦 ' + game.collections[0].substring(0, 15) : ''}</span>
        </div>
        <button type="button" class="card-btn-action">
          <span>💾 Pobierz ROM</span>
        </button>
      </div>
    `;

    card.innerHTML = imgHtml + bodyHtml;

    // Obsługa kliknięcia i klawisza Enter / Spacji
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
        Spróbuj zmienić słowo kluczowe, odznacz filtr zaufanych kolekcji lub wybierz inną platformę.
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
      <p class="state-desc">${message || 'Nie udało się połączyć z API Internet Archive.'}</p>
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
      <span class="page-indicator">Strona <strong>${page}</strong> z <strong>${totalPages}</strong> (${total} pozycji)</span>
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
        <img src="${game.thumbnail}" alt="" class="modal-game-cover" onerror="this.onerror=null; this.src='assets/icons/icon.svg';" />
        <div class="modal-game-details">
          <h4 class="modal-game-title">${game.title}</h4>
          <span class="modal-game-id">ID: ${game.identifier}</span>
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

  const { romFiles, otherFiles, identifier } = filesData;

  let contentHtml = `
    <div class="modal-game-hero">
      <img src="${game.thumbnail}" alt="" class="modal-game-cover" onerror="this.onerror=null; this.src='assets/icons/icon.svg';" />
      <div class="modal-game-details">
        <h4 class="modal-game-title">${game.title}</h4>
        <span class="modal-game-id">Archiwum: ${identifier}</span>
      </div>
    </div>
  `;

  if (romFiles.length === 0 && otherFiles.length === 0) {
    contentHtml += `
      <div class="state-message-box" style="padding: 24px;">
        <p>W tym archiwum nie znaleziono bezpośrednich plików ROM.</p>
        <a href="https://archive.org/details/${encodeURIComponent(identifier)}" target="_blank" rel="noopener" class="btn-primary" style="margin-top: 10px;">
          Otwórz na Archive.org
        </a>
      </div>
    `;
  } else {
    // Lista plików ROM
    contentHtml += `
      <div class="files-list-container">
        <h5 class="files-section-title">Dostępne pliki ROM (${romFiles.length})</h5>
    `;

    romFiles.forEach((file, index) => {
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
