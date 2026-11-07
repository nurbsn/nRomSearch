/**
 * nRomSearch - Główny kontroler aplikacji (App Orchestrator)
 */

import { PLATFORMS, searchGames, searchCatalog, findRomForCatalogGame, fetchGameFiles } from './api.js';
import {
  renderPlatforms,
  renderSkeletons,
  renderGames,
  renderEmptyState,
  renderErrorState,
  renderPagination,
  showModalLoading,
  populateFilesModal,
  closeModal,
  showToast
} from './ui.js';

// Stan aplikacji
const state = {
  sourceMode: 'catalog', // 'catalog' (baza gier z repozytorium) lub 'archive' (Internet Archive)
  query: '',
  platformId: 'snes', // Domyślnie SNES w katalogu
  trustedOnly: false,
  page: 1,
  rows: 30,
  totalPages: 1,
  totalResults: 0,
  isLoading: false,
  activeGame: null,
  activeFiles: null
};

// Kontroler anulowania zapytań
let currentAbortController = null;
let searchDebounceTimer = null;

// Elementy DOM
const elements = {
  btnModeCatalog: document.getElementById('mode-catalog'),
  btnModeArchive: document.getElementById('mode-archive'),
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  platformList: document.getElementById('platform-list'),
  trustedToggleWrap: document.getElementById('trusted-toggle-wrap'),
  trustedToggle: document.getElementById('toggle-trusted'),
  resultsStats: document.getElementById('results-stats'),
  gamesGrid: document.getElementById('games-grid'),
  paginationContainer: document.getElementById('pagination-container'),
  toastContainer: document.getElementById('toast-container'),

  // Modal plików
  gameModal: document.getElementById('game-modal'),
  gameModalClose: document.getElementById('game-modal-close'),

  // Modal przewodnika Daijishō
  daijishoModal: document.getElementById('daijisho-modal'),
  daijishoBtn: document.getElementById('btn-daijisho-guide'),
  daijishoClose: document.getElementById('daijisho-modal-close'),
  copyIntentBtn: document.getElementById('btn-copy-intent-url')
};

/**
 * Rejestracja Service Workera dla wsparcia PWA i offline
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker zarejestrowany pomyślnie:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] Rejestracja Service Workera nie powiodła się:', err);
        });
    });
  }
}

/**
 * Synchronizacja stanu z parametrami URL (?q=...&platform=...&mode=...)
 */
function syncStateFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const q = urlParams.get('q');
  const platform = urlParams.get('platform');
  const page = parseInt(urlParams.get('page') || '1', 10);
  const trusted = urlParams.get('trusted') === '1';

  if (mode === 'archive' || mode === 'catalog') {
    state.sourceMode = mode;
  }
  if (q !== null) {
    state.query = q;
    if (elements.searchInput) elements.searchInput.value = q;
  }
  if (platform && PLATFORMS.some(p => p.id === platform)) {
    state.platformId = platform;
  }
  if (!isNaN(page) && page > 0) {
    state.page = page;
  }
  state.trustedOnly = trusted;
  if (elements.trustedToggle) {
    elements.trustedToggle.checked = trusted;
  }
  updateClearButtonVisibility();
  updateModeButtonsUI();
}

/**
 * Aktualizuje wygląd przełącznika trybów (Katalog vs Archiwum)
 */
function updateModeButtonsUI() {
  const isCatalog = state.sourceMode === 'catalog';
  elements.btnModeCatalog?.classList.toggle('active', isCatalog);
  elements.btnModeCatalog?.setAttribute('aria-selected', String(isCatalog));

  elements.btnModeArchive?.classList.toggle('active', !isCatalog);
  elements.btnModeArchive?.setAttribute('aria-selected', String(!isCatalog));

  // Pokaż filtr zaufanych kolekcji tylko w trybie Archive
  if (elements.trustedToggleWrap) {
    elements.trustedToggleWrap.style.display = isCatalog ? 'none' : 'inline-flex';
  }
}

/**
 * Zapisuje aktualny stan do parametrów URL
 */
function updateUrlParams() {
  const params = new URLSearchParams();
  if (state.sourceMode !== 'catalog') params.set('mode', state.sourceMode);
  if (state.query) params.set('q', state.query);
  if (state.platformId && state.platformId !== 'all') params.set('platform', state.platformId);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.trustedOnly && state.sourceMode === 'archive') params.set('trusted', '1');

  const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState(null, '', newUrl);
}

/**
 * Widoczność przycisku czyszczenia wyszukiwania
 */
function updateClearButtonVisibility() {
  if (!elements.searchClearBtn) return;
  elements.searchClearBtn.style.display = state.query ? 'flex' : 'none';
}

/**
 * Pobiera nazwę aktualnie wybranej platformy
 */
function getActivePlatformName() {
  const p = PLATFORMS.find(item => item.id === state.platformId);
  return p ? p.name : 'Wszystkie';
}

/**
 * Wykonanie zapytania wyszukiwania (w trybie katalogu lub archive.org)
 */
async function performSearch() {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  state.isLoading = true;
  updateUrlParams();

  // Renderuj szkielety ładowania
  renderSkeletons(elements.gamesGrid, 12);
  if (elements.resultsStats) {
    const modeName = state.sourceMode === 'catalog' ? 'Katalogu gier' : 'Internet Archive';
    elements.resultsStats.innerHTML = `Pobieranie danych z <strong>${modeName}</strong>: <strong>${getActivePlatformName()}</strong>...`;
  }
  if (elements.paginationContainer) {
    elements.paginationContainer.innerHTML = '';
  }

  try {
    let result;

    if (state.sourceMode === 'catalog') {
      result = await searchCatalog({
        query: state.query,
        platformId: state.platformId,
        page: state.page,
        rows: state.rows,
        signal: currentAbortController.signal
      });
    } else {
      result = await searchGames({
        query: state.query,
        platformId: state.platformId,
        trustedOnly: state.trustedOnly,
        page: state.page,
        rows: state.rows,
        signal: currentAbortController.signal
      });
    }

    state.isLoading = false;
    state.totalResults = result.total;
    state.totalPages = result.totalPages;

    if (elements.resultsStats) {
      const modeLabel = state.sourceMode === 'catalog' ? '📚 Baza gier' : '🌐 Internet Archive';
      elements.resultsStats.innerHTML = `${modeLabel} • Znaleziono: <strong>${result.total.toLocaleString()}</strong> gier w <strong>${getActivePlatformName()}</strong>`;
    }

    if (result.games.length === 0) {
      renderEmptyState(elements.gamesGrid, state.query, getActivePlatformName());
    } else {
      renderGames(elements.gamesGrid, result.games, handleGameSelected);
      renderPagination(elements.paginationContainer, {
        page: state.page,
        totalPages: state.totalPages,
        total: state.totalResults,
        onPageChange: (newPage) => {
          state.page = newPage;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          performSearch();
        }
      });
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    state.isLoading = false;
    console.error('[Search Error]', err);
    renderErrorState(elements.gamesGrid, err.message, () => {
      performSearch();
    });
    if (elements.resultsStats) {
      elements.resultsStats.innerHTML = `<span style="color: var(--accent-rose);">Błąd wyszukiwania</span>`;
    }
  }
}

/**
 * Obsługa wyboru konkretnej gry z kafelka
 */
async function handleGameSelected(game) {
  state.activeGame = game;
  showModalLoading(elements.gameModal, game);

  try {
    let filesData;

    if (game.isCatalog) {
      // Dla gry z katalogu wyszukaj odpowiadający plik ROM w Internet Archive
      filesData = await findRomForCatalogGame(game);
    } else {
      // Dla pozycji z Internet Archive pobierz pliki bezpośrednio z archiwum
      filesData = await fetchGameFiles(game.identifier);
    }

    state.activeFiles = filesData;
    populateFilesModal(elements.gameModal, game, filesData, (msg) => {
      showToast(elements.toastContainer, msg);
    });
  } catch (err) {
    console.error('[Fetch Files Error]', err);
    const modalBody = elements.gameModal?.querySelector('#modal-game-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="state-message-box" style="padding: 20px;">
          <h4 style="color: var(--accent-rose);">Nie udało się pobrać pliku ROM</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">${err.message}</p>
          <a href="https://archive.org/search.php?query=${encodeURIComponent(game.title)}" target="_blank" rel="noopener" class="btn-primary" style="margin-top: 12px;">
            Szukaj ręcznie na Archive.org
          </a>
        </div>
      `;
    }
  }
}

/**
 * Podpięcie zdarzeń interfejsu użytkownika
 */
function bindEvents() {
  // Przełączanie trybu źródła: Katalog vs Archive
  elements.btnModeCatalog?.addEventListener('click', () => {
    if (state.sourceMode !== 'catalog') {
      state.sourceMode = 'catalog';
      state.page = 1;
      updateModeButtonsUI();
      performSearch();
    }
  });

  elements.btnModeArchive?.addEventListener('click', () => {
    if (state.sourceMode !== 'archive') {
      state.sourceMode = 'archive';
      state.page = 1;
      updateModeButtonsUI();
      performSearch();
    }
  });

  // Zmiana tekstu wyszukiwania
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      state.page = 1;
      updateClearButtonVisibility();

      clearTimeout(searchDebounceTimer);
      // W trybie katalogu szybszy debounce (200ms)
      const debounceTime = state.sourceMode === 'catalog' ? 200 : 350;
      searchDebounceTimer = setTimeout(() => {
        performSearch();
      }, debounceTime);
    });
  }

  // Przycisk czyszczenia wyszukiwarki
  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      state.query = '';
      if (elements.searchInput) {
        elements.searchInput.value = '';
        elements.searchInput.focus();
      }
      state.page = 1;
      updateClearButtonVisibility();
      performSearch();
    });
  }

  // Filtr zaufanych kolekcji
  if (elements.trustedToggle) {
    elements.trustedToggle.addEventListener('change', (e) => {
      state.trustedOnly = e.target.checked;
      state.page = 1;
      performSearch();
    });
  }

  // Zamykanie modali
  elements.gameModalClose?.addEventListener('click', () => closeModal(elements.gameModal));
  elements.daijishoClose?.addEventListener('click', () => closeModal(elements.daijishoModal));

  // Otwieranie przewodnika Daijishō
  elements.daijishoBtn?.addEventListener('click', () => {
    elements.daijishoModal?.classList.add('open');
    elements.daijishoModal?.setAttribute('aria-hidden', 'false');
  });

  // Zamykanie modala po kliknięciu w tło (backdrop)
  window.addEventListener('click', (e) => {
    if (e.target === elements.gameModal) closeModal(elements.gameModal);
    if (e.target === elements.daijishoModal) closeModal(elements.daijishoModal);
  });

  // Klawisz Escape zamyka aktywne okna modalne
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(elements.gameModal);
      closeModal(elements.daijishoModal);
    }
  });

  // Kopiowanie szablonu URL integracji Daijishō
  if (elements.copyIntentBtn) {
    elements.copyIntentBtn.addEventListener('click', async () => {
      const template = 'https://nurbsn.github.io/nRomSearch/?platform={platform}&q={title}';
      try {
        await navigator.clipboard.writeText(template);
        showToast(elements.toastContainer, 'Skopiowano szablon URL dla Daijishō!');
      } catch {
        showToast(elements.toastContainer, 'Nie udało się skopiować.');
      }
    });
  }
}

/**
 * Inicjalizacja aplikacji
 */
function init() {
  registerServiceWorker();
  syncStateFromUrl();

  function handlePlatformSelect(newPlatformId) {
    state.platformId = newPlatformId;
    state.page = 1;
    renderPlatforms(elements.platformList, state.platformId, handlePlatformSelect);
    performSearch();
  }

  renderPlatforms(elements.platformList, state.platformId, handlePlatformSelect);
  bindEvents();
  performSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
