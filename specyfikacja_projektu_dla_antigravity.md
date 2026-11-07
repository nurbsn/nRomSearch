# Retro ROM Downloader & Search Engine (GitHub Pages + Daijishō)

## 1. Kontekst i cel projektu

Projekt to lekka, statyczna aplikacja webowa (Single Page Application / Progressive Web App) hostowana na **GitHub Pages**, służąca do przeszukiwania otwartych repozytoriów gier retro (m.in. Internet Archive, No-Intro, Redump) oraz pobierania plików bezpośrednio na urządzenia z systemem Android do wykorzystania w launcherze **Daijishō**.

### Główne założenia
* **Brak konieczności utrzymywania dedykowanego serwera backendowego:** Aplikacja działa po stronie klienta (Client-Side Vanilla JS lub lekki framework), komunikując się z otwartymi API.
* **Kompatybilność z urządzeniami mobilnymi / konsolami retro:** Responsywny interfejs zoptymalizowany pod ekrany dotykowe i nawigację gamepadem.
* **Integracja z Daijishō:** Możliwość szybkiego wywołania aplikacji z poziomu launchera Android Intents (`android.intent.action.VIEW`) oraz pobierania plików do katalogów indeksowanych przez frontend.

---

## 2. Architektura techniczna

### Źródła danych
1. **Wyszukiwanie i pobieranie:**
   * Internet Archive Advanced Search API:
     * Endpoint: `https://archive.org/advancedsearch.php`
     * Filtry: Kolekcje `no-intro`, `redump`, parametry `title`, `description`.
   * Internet Archive Metadata & Files API:
     * Endpoint: `https://archive.org/metadata/{identifier}/files`
     * Dynamiczne rozpoznawanie plików ROM (`.zip`, `.7z`, `.sfc`, `.smc`, `.gba`, `.nes`, `.bin`, `.chd`, `.iso`, `.z64`).
   * Bezpośredni download: `https://archive.org/download/{identifier}/{filename}`.
2. **Metadane i okładki (opcjonalny fallback):**
   * Gotowe miniaturki generowane przez IA: `https://archive.org/services/img/{identifier}`.
   * Planowana integracja: Proxy do API IGDB / TheGamesDB dla wyższej jakości okładek.

### Struktura katalogów repozytorium
```text
retro-search/
├── index.html              # Główny plik SPA
├── manifest.json           # Konfiguracja PWA (instalowalność na Androidzie)
├── sw.js                   # Service Worker do cachowania zasobów offline
├── styles/
│   └── main.css            # Style CSS (Dark mode, responsywna siatka kafelków)
├── js/
│   ├── app.js              # Inicjalizacja i zarządzanie stanem
│   ├── api.js              # Klient HTTP dla Internet Archive / metadanych
│   └── ui.js               # Renderowanie kafelków, obsługa dialogów i pobierania
└── PROJECT_SPEC.md         # Niniejsza specyfikacja dla agenta Antigravity
```

---

## 3. Stan obecny (Status Quo)

Zbudowano prototyp w jednym pliku `index.html`:
* Formularz z wyborem konsoli (SNES, GBA, NES, Genesis, N64, PS1) i polem tekstowym.
* Asynchroniczne odpytywanie Internet Archive API.
* Renderowanie siatki z miniaturami okładek i tytułami.
* Dwuetapowe pobieranie: kliknięcie kafelka pobiera spis plików archiwum, typuje plik ROM na podstawie rozszerzenia i wywołuje pobieranie przez przeglądarkę.

---

## 4. Zadania i kamienie milowe dla agenta Antigravity

### Krok 1: Refaktoryzacja i modułowość
- [ ] Rozdzielenie monolitycznego pliku `index.html` na strukturę modułową (`index.html`, `styles/main.css`, `js/app.js`, `js/api.js`).
- [ ] Dodanie obsługi błędów sieciowych i wskaźników ładowania (szkielety kart / skeleton loaders).

### Krok 2: Konfiguracja Progressive Web App (PWA)
- [ ] Utworzenie `manifest.json` z odpowiednimi ikonami, motywem ciemnym (`theme_color: "#121212"`) i trybem pełnoekranowym (`display: "standalone"`).
- [ ] Wdrożenie `sw.js` zapewniającego buforowanie statycznych assetów interfejsu.

### Krok 3: Rozbudowa platform i wyszukiwarki
- [ ] Rozszerzenie listy platform w filtrze:
  * PlayStation 2 (PS2)
  * PlayStation Portable (PSP)
  * Nintendo DS (NDS)
  * Nintendo GameCube (GCN)
  * Sega Dreamcast (DC)
  * Arcade (MAME / FBNeo)
- [ ] Usprawnienie mechanizmu wyszukiwania:
  * Implementacja debounce (opóźnienie zapytania podczas wpisywania tekstu).
  * Lepsze reguły filtrowania (odrzucanie plików XML, logów torrentów, metadanych).

### Krok 4: Usprawnienie pobierania i integracja z Daijishō
- [ ] Wyświetlanie rozmiaru pliku przed rozpoczęciem pobierania.
- [ ] Dodanie instrukcji w interfejsie informującej użytkownika, jak skonfigurować folder docelowy w przeglądarce i powiązać go ze ścieżkami ROM w Daijishō.
- [ ] Przygotowanie gotowego szablonu Intentu gracza Daijishō do dodania do repozytorium platform.

---

## 5. Wytyczne implementacyjne dla agenta

* **Czysty kod:** Preferowany czysty JavaScript (Vanilla ES6+) bez zbędnych zależności zewnętrznych (npm/webpack), tak aby projekt natychmiast działał na GitHub Pages po commicie.
* **Dostępność i wydajność:** Optymalizacja ładowania grafik (`loading="lazy"`), obsługa zdarzeń błędów ładowania miniatur (fallback placeholder SVG).
* **Bezpieczeństwo zapytań:** Enkodowanie parametrów URI (`encodeURIComponent`) przy zapytaniach do API.