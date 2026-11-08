/**
 * nRomSearch - Główny kontroler aplikacji (App Orchestrator)
 */

import { 
  PLATFORMS, 
  searchGames, 
  searchCatalog, 
  findRomForCatalogGame, 
  fetchGameFiles,
  resolvePlatformId,
  getDaijishoPlayerJson 
} from './api.js';
import {
  renderPlatforms,
  renderSkeletons,
  renderGames,
  renderEmptyState,
  renderErrorState,
  renderPagination,
  renderExternalQuickLinks,
  showModalLoading,
  populateFilesModal,
  closeModal,
  showToast
} from './ui.js';

// Stan aplikacji z zaawansowanymi filtrami
const state = {
  sourceMode: 'catalog', // 'catalog' (baza gier z repozytorium) lub 'archive' (Internet Archive)
  query: '',
  platformId: 'snes', // Domyślnie SNES w katalogu
  genre: 'all',
  minRating: 0,
  yearPeriod: 'all',
  publisher: 'all',
  sortBy: 'rating-desc',
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
  externalSearchPills: document.getElementById('external-search-pills'),
  platformList: document.getElementById('platform-list'),

  // Panel zaawansowanych filtrów
  btnToggleFilters: document.getElementById('btn-toggle-filters'),
  filterActiveBadge: document.getElementById('filter-active-badge'),
  filterChevron: document.getElementById('filter-chevron'),
  filtersDrawer: document.getElementById('filters-drawer'),
  filterSort: document.getElementById('filter-sort'),
  filterGenre: document.getElementById('filter-genre'),
  filterRating: document.getElementById('filter-rating'),
  filterYear: document.getElementById('filter-year'),
  filterPublisher: document.getElementById('filter-publisher'),
  btnResetFilters: document.getElementById('btn-reset-filters'),

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
 * Oblicza liczbę aktywnych filtrów szczegółowych i aktualizuje plakietkę
 */
function updateActiveFiltersBadge() {
  let count = 0;
  if (state.genre !== 'all') count++;
  if (state.minRating > 0) count++;
  if (state.yearPeriod !== 'all') count++;
  if (state.publisher !== 'all') count++;

  if (elements.filterActiveBadge) {
    elements.filterActiveBadge.textContent = String(count);
    elements.filterActiveBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

/**
 * Synchronizacja stanu z parametrami URL
 */
function syncStateFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const q = urlParams.get('q');
  const platform = urlParams.get('platform');
  const genre = urlParams.get('genre');
  const rating = parseFloat(urlParams.get('rating') || '0');
  const year = urlParams.get('year');
  const pub = urlParams.get('pub');
  const sort = urlParams.get('sort');
  const page = parseInt(urlParams.get('page') || '1', 10);
  const trusted = urlParams.get('trusted') === '1';

  if (mode === 'archive' || mode === 'catalog') {
    state.sourceMode = mode;
  }
  if (q !== null) {
    state.query = q;
    if (elements.searchInput) elements.searchInput.value = q;
  }
  if (platform) {
    const resolvedId = resolvePlatformId(platform);
    if (resolvedId) {
      state.platformId = resolvedId;
    }
  }
  if (genre) {
    state.genre = genre;
    if (elements.filterGenre) elements.filterGenre.value = genre;
  }
  if (!isNaN(rating) && rating > 0) {
    state.minRating = rating;
    if (elements.filterRating) elements.filterRating.value = String(rating);
  }
  if (year) {
    state.yearPeriod = year;
    if (elements.filterYear) elements.filterYear.value = year;
  }
  if (pub) {
    state.publisher = pub;
    if (elements.filterPublisher) elements.filterPublisher.value = pub;
  }
  if (sort) {
    state.sortBy = sort;
    if (elements.filterSort) elements.filterSort.value = sort;
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
  updateActiveFiltersBadge();
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
  if (state.genre !== 'all') params.set('genre', state.genre);
  if (state.minRating > 0) params.set('rating', String(state.minRating));
  if (state.yearPeriod !== 'all') params.set('year', state.yearPeriod);
  if (state.publisher !== 'all') params.set('pub', state.publisher);
  if (state.sortBy !== 'rating-desc') params.set('sort', state.sortBy);
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
 * Aktualizuje bezpośrednie linki do serwisów zewnętrznych
 * (FreeROMS, Romspedia, EmuParadise, Retrostic)
 */
function updateExternalLinksUI() {
  if (elements.externalSearchPills) {
    renderExternalQuickLinks(elements.externalSearchPills, state.query, state.platformId);
  }
}

/**
 * Wykonanie zapytania wyszukiwania (w trybie katalogu lub archive.org) z uwzględnieniem filtrów
 */
async function performSearch() {
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  state.isLoading = true;
  updateUrlParams();
  updateActiveFiltersBadge();

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
        genre: state.genre,
        minRating: state.minRating,
        yearPeriod: state.yearPeriod,
        publisher: state.publisher,
        sortBy: state.sortBy,
        page: state.page,
        rows: state.rows,
        signal: currentAbortController.signal
      });
    } else {
      result = await searchGames({
        query: state.query,
        platformId: state.platformId,
        genre: state.genre,
        minRating: state.minRating,
        sortBy: state.sortBy,
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
      const filterAddon = (state.genre !== 'all' ? ` • ${state.genre}` : '') + 
                          (state.minRating > 0 ? ` • ★${state.minRating}+` : '');
      elements.resultsStats.innerHTML = `${modeLabel} • Znaleziono: <strong>${result.total.toLocaleString()}</strong> gier w <strong>${getActivePlatformName()}</strong>${filterAddon}`;
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
      filesData = await findRomForCatalogGame(game);
    } else {
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

  // Rozwijanie / zwijanie szuflady zaawansowanych filtrów
  elements.btnToggleFilters?.addEventListener('click', () => {
    if (!elements.filtersDrawer) return;
    const isHidden = elements.filtersDrawer.style.display === 'none';
    elements.filtersDrawer.style.display = isHidden ? 'flex' : 'none';
    elements.btnToggleFilters?.setAttribute('aria-expanded', String(isHidden));
    elements.filterChevron?.classList.toggle('open', isHidden);
  });

  // Obsługa zmiany sortowania
  elements.filterSort?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.page = 1;
    performSearch();
  });

  // Obsługa zmiany gatunku
  elements.filterGenre?.addEventListener('change', (e) => {
    state.genre = e.target.value;
    state.page = 1;
    performSearch();
  });

  // Obsługa zmiany minimalnej oceny
  elements.filterRating?.addEventListener('change', (e) => {
    state.minRating = parseFloat(e.target.value) || 0;
    state.page = 1;
    performSearch();
  });

  // Obsługa zmiany ery / rocznika
  elements.filterYear?.addEventListener('change', (e) => {
    state.yearPeriod = e.target.value;
    state.page = 1;
    performSearch();
  });

  // Obsługa zmiany wydawcy
  elements.filterPublisher?.addEventListener('change', (e) => {
    state.publisher = e.target.value;
    state.page = 1;
    performSearch();
  });

  // Resetowanie filtrów
  elements.btnResetFilters?.addEventListener('click', () => {
    state.genre = 'all';
    state.minRating = 0;
    state.yearPeriod = 'all';
    state.publisher = 'all';
    state.sortBy = 'rating-desc';
    state.page = 1;

    if (elements.filterGenre) elements.filterGenre.value = 'all';
    if (elements.filterRating) elements.filterRating.value = '0';
    if (elements.filterYear) elements.filterYear.value = 'all';
    if (elements.filterPublisher) elements.filterPublisher.value = 'all';
    if (elements.filterSort) elements.filterSort.value = 'rating-desc';

    performSearch();
  });

  // Zmiana tekstu wyszukiwania
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      state.page = 1;
      updateClearButtonVisibility();
      updateExternalLinksUI();

      clearTimeout(searchDebounceTimer);
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
      updateExternalLinksUI();
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

  // Obsługa zakładek w modalu przewodnika Daijishō
  const guideTabBtns = document.querySelectorAll('.guide-tab-btn');
  const guideTabPanes = document.querySelectorAll('.guide-tab-pane');
  guideTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      guideTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      guideTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Kopiowanie pojedynczych wartości formularza Daijishō (.btn-copy-inline)
  document.querySelectorAll('.btn-copy-inline').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const text = targetEl.textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
          showToast(elements.toastContainer, 'Skopiowano do schowka!');
        } catch {
          showToast(elements.toastContainer, 'Nie udało się skopiować.');
        }
      }
    });
  });

  // Kopiowanie amStartArguments do schowka
  const btnCopyAmStart = document.getElementById('btn-copy-amstart');
  btnCopyAmStart?.addEventListener('click', async () => {
    const text = '-a android.intent.action.VIEW -d "https://nurbsn.github.io/nRomSearch/?platform={platform_shortname}&q={file.nameWithoutExtension}"';
    try {
      await navigator.clipboard.writeText(text);
      showToast(elements.toastContainer, 'Skopiowano argumenty amStartArguments do schowka!');
    } catch {
      showToast(elements.toastContainer, 'Nie udało się skopiować.');
    }
  });

  // Kopiowanie pełnego kodu JSON playera Daijishō
  const btnCopyPlayerJson = document.getElementById('btn-copy-player-json');
  btnCopyPlayerJson?.addEventListener('click', async () => {
    const jsonStr = getDaijishoPlayerJson();
    try {
      await navigator.clipboard.writeText(jsonStr);
      showToast(elements.toastContainer, 'Skopiowano kod JSON playera Daijishō!');
    } catch {
      showToast(elements.toastContainer, 'Nie udało się skopiować.');
    }
  });

  // Pobieranie pliku nromsearch.downloader.json
  const btnDownloadPlayerJson = document.getElementById('btn-download-player-json');
  btnDownloadPlayerJson?.addEventListener('click', () => {
    const jsonStr = getDaijishoPlayerJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nromsearch.downloader.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(elements.toastContainer, 'Pobrano plik nromsearch.downloader.json');
  });

  // Kopiowanie szablonu URL zapytania Daijishō
  const btnCopyIntentUrl = document.getElementById('btn-copy-intent-url');
  btnCopyIntentUrl?.addEventListener('click', async () => {
    const template = 'https://nurbsn.github.io/nRomSearch/?platform={platform_shortname}&q={file.nameWithoutExtension}';
    try {
      await navigator.clipboard.writeText(template);
      showToast(elements.toastContainer, 'Skopiowano szablon URL dla Daijishō!');
    } catch {
      showToast(elements.toastContainer, 'Nie udało się skopiować.');
    }
  });
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
    updateExternalLinksUI();
    performSearch();
  }

  renderPlatforms(elements.platformList, state.platformId, handlePlatformSelect);
  updateExternalLinksUI();
  bindEvents();
  performSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
