# nRomSearch 🎮

> Lekka, bezserwerowa wyszukiwarka gier retro (Single Page Application / Progressive Web App) zintegrowana z bazą tytułów z repozytorium GitHub, okładkami Libretro Boxarts oraz archiwami Internet Archive. Zoptymalizowana pod urządzenia z systemem Android, konsole przenośne oraz launcher **Daijishō**.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://nurbsn.github.io/nRomSearch/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](manifest.json)

---

## 🌟 Główne funkcje i nowości

* **📚 Baza gier z repozytorium:** Zintegrowana baza tysięcy oficjalnych gier retro pobierana bezpośrednio z repozytorium GitHub dla każdej konsoli (tytuł, rok, twórca, wydawca). Błyskawiczne filtrowanie i wyszukiwanie lokalne w czasie rzeczywistym.
* **🖼️ Okładki Box-art (3:4):** Duże, czytelne okładki gier pobierane w wysokiej rozdzielczości z repozytorium `libretro-thumbnails`. Estetyczny minimalistyczny wygląd kart bez zbędnych placeholderów.
* **⚡ 1-klikowe wyszukiwanie i pobieranie ROM:** Kliknięcie gry z katalogu automatycznie odpytuje Internet Archive o bezpośrednie pliki ROM dla tego konkretnego tytułu, wyświetlając listę plików, formaty oraz dokładne rozmiary (MB/GB).
* **🌐 Zewnętrzne serwisy ROM (Multi-Search Hub):** Szybkie skróty i bezpośrednie przeszukiwanie w popularnych serwisach retro:
  * **FreeROMS.com**
  * **Romspedia.com**
  * **EmuParadise.me**
  * **Retrostic.com**
  Dostępne zarówno dynamicznie pod głównym paskiem wyszukiwania, jak i w oknie szczegółów każdej gry.
* **🌐 Tryb wyszukiwarki Internet Archive:** Możliwość swobodnego przełączenia na bezpośrednie przeszukiwanie wszystkich zasobów i kolekcji Archive.org (*No-Intro*, *Redump*, *TOSEC*).
* **100% Client-Side:** Aplikacja działa bezpośrednio w przeglądarce i nie wymaga zewnętrznego backendu.
* **Optymalizacja pod ekrany dotykowe i gamepad:** Wygodna nawigacja dotykowa, responsywna siatka z kafelkami oraz obsługa kontrolerów fizycznych (D-pad / klawisze strzałek / Enter / Escape).
* **Gotowe do instalacji jako PWA:** Obsługa trybu pełnoekranowego (*standalone*) i buforowanie powłoki aplikacji (*Service Worker*).
* **Współpraca z launcherem Daijishō:** Obsługa parametrów zapytania URL (`?platform={platform}&q={title}`) umożliwia bezpośrednie wyszukiwanie brakujących gier z poziomu launchera Daijishō.

---

## 🕹️ Wspierane platformy

* **Nintendo:** NES, Super Nintendo (SNES), Game Boy / Game Boy Color (GB/GBC), Game Boy Advance (GBA), Nintendo 64 (N64), Nintendo DS (NDS), Nintendo GameCube (GCN).
* **Sony:** PlayStation 1 (PS1 / PSX), PlayStation 2 (PS2), PlayStation Portable (PSP).
* **Sega:** Sega Genesis / Mega Drive, Sega Dreamcast (DC).
* **Arcade:** Automaty MAME / FBNeo.
* **Wszystkie:** Wyszukiwanie wieloplatformowe.

---

## 📱 Integracja z launcherem Daijishō (Krok po kroku)

Aplikacja **nRomSearch** została w 100% zoptymalizowana pod urządzenia retro z systemem Android (Retroid Pocket, Anbernic, AYN Odin, Miyoo, smartfony itp.) oraz launcher **Daijishō**.

### Sposób 1: Dodanie nRomSearch jako aplikacji do Daijishō (PWA - Zalecane)

1. **Instalacja PWA w przeglądarce:**
   * Otwórz stronę `https://nurbsn.github.io/nRomSearch/` w mobilnej przeglądarce (Google Chrome, Brave lub Edge) na swojej konsoli.
   * W prawym górnym rogu kliknij menu **trzech kropek (⋮)** i wybierz **„Zainstaluj aplikację”** (lub *„Dodaj do ekranu głównego”*).
   * Aplikacja zainstaluje się jako samodzielne, pełnoekranowe okno bez zbędnych pasków adresu.
2. **Odnalezienie w Daijishō:**
   * Uruchom launcher Daijishō i przejdź do górnej zakładki **Apps (Aplikacje)**.
   * Na liście zainstalowanych aplikacji znajdziesz **nRomSearch** z retro-ikoną gamepada.
3. **Przypięcie do Ulubionych:**
   * Przytrzymaj palcem (lub przyciskiem wyboru na kontrolerze) kafelek **nRomSearch**.
   * Wybierz ikonę gwiazdki **⭐ Add to favorites**. Od teraz wyszukiwarka jest zawsze pod ręką na Twoim pulpicie Daijishō!

---

### Sposób 2: Custom Player w Daijishō (Wywołanie z poziomu konsoli)

Możesz dodać nRomSearch jako alternatywny odtwarzacz gier (Player), dzięki czemu kliknięcie w brakujący tytuł w Daijishō otworzy wyszukiwarkę z gotowym zapytaniem:

1. **Otwórz kreator graczy:**
   * W Daijishō wejdź w: **Settings ⚙️ ➔ Library ➔ Inspect players**.
   * Kliknij ikonę plusa **+ (Add player)** w prawym górnym rogu ekranu.
2. **Wypełnij parametry gracza:**
   * **Player name:** `nRomSearch (Pobierz ROM)`
   * **Unique ID:** `nromsearch.downloader`
   * **Accepted filename regex:** `^.*$`
   * **Player am start arguments:**
     ```text
     -a android.intent.action.VIEW -d "https://nurbsn.github.io/nRomSearch/?platform={platform_shortname}&q={file.nameWithoutExtension}"
     ```
3. **Zapisz i przypisz do platformy:**
   * Kliknij **Save**.
   * Wejdź w wybraną konsolę (np. SNES, PS1) ➔ kliknij ikonę ołówka **✏️ (Edit platform)** na dole ➔ w sekcji **Player** zaznacz `nRomSearch (Pobierz ROM)`.

---

### Sposób 3: Konfiguracja folderów ROM i automatyczna synchronizacja

1. **Struktura katalogów:** W pamięci urządzenia lub na karcie MicroSD przygotuj foldery dla konsol, np.:
   `/storage/emulated/0/ROMs/SNES/`, `/storage/emulated/0/ROMs/GBA/`, `/storage/emulated/0/ROMs/PS1/`.
2. **Folder pobierania w przeglądarce:**
   * W przeglądarce konsoli wejdź w **Ustawienia ➔ Pobrane pliki**.
   * Zaznacz opcję: ☑️ **„Pytaj, gdzie zapisać każdy plik”** (lub ustaw katalog `ROMs`).
3. **Powiązanie w Daijishō:**
   * W Daijishō wybierz daną konsolę ➔ kliknij na dole **Paths** ➔ **Add path (+)** ➔ wskaż folder z grami.
4. **Synchronizacja:**
   * Po pobraniu pliku ROM kliknij **Sync library** (lub włącz w Daijishō **Settings ⚙️ ➔ Library ➔ Auto sync on launch**). Daijishō samoczynnie pobierze trójwymiarowe okładki, zrzuty ekranu i opisy!

---

### Tabela kodów platform Daijishō (`platform_shortname`)

nRomSearch automatycznie rozpoznaje kody przesyłane z Daijishō:

| Platforma | Kod Daijishō (`{platform_shortname}`) | Docelowy katalog bazy |
|:---|:---:|:---|
| Super Nintendo | `snes` | Baza SNES |
| Game Boy Advance | `gba` | Baza GBA |
| Game Boy / Color | `gbc` / `gb` | Baza Game Boy Color |
| Nintendo NES | `nes` | Baza NES / Famicom |
| Nintendo 64 | `n64` | Baza Nintendo 64 |
| Nintendo DS | `nds` | Baza Nintendo DS |
| Nintendo GameCube | `gc` / `gamecube` | Baza GameCube |
| Sony PlayStation 1 | `psx` / `ps1` | Baza PlayStation 1 |
| Sony PlayStation 2 | `ps2` | Baza PlayStation 2 |
| PlayStation Portable | `psp` | Baza PSP |
| Sega Genesis / Mega Drive | `megadrive` / `genesis` | Baza Mega Drive |
| Sega Dreamcast | `dc` / `dreamcast` | Baza Dreamcast |
| Arcade | `arcade` / `mame` / `fbneo` | Baza Arcade / MAME |

---

## 📁 Struktura projektu

```text
nRomSearch/
├── index.html              # Główny interfejs SPA z przełącznikiem trybów
├── manifest.json           # Konfiguracja Progressive Web App
├── sw.js                   # Service Worker (offline App Shell + media/catalog cache)
├── styles/
│   └── main.css            # Dark Mode, siatka kafelków box-art (3:4), skeleton loadery
├── js/
│   ├── api.js              # Klient Internet Archive, katalog GitHub i Libretro boxarts
│   ├── ui.js               # Renderowanie kafelków, modali i powiadomień Toast
│   └── app.js              # Koordynacja stanu, obsługa zdarzeń i debounce
└── assets/
    └── icons/
        └── icon.svg        # Wektorowe logo retro gamepad
```

---

## 🚀 Uruchomienie lokalne

```bash
# Uruchom prosty serwer HTTP:
npx serve .

# lub w Pythonie:
python -m http.server 8000
```

Otwórz w przeglądarce: `http://localhost:8000`

---

## ⚙️ Wdrożenie na GitHub Pages

1. Wejdź w ustawienia repozytorium na GitHubie: **Settings -> Pages**.
2. W sekcji **Build and deployment -> Source** wybierz `Deploy from a branch`.
3. Wybierz branch `main` oraz folder `/ (root)` i kliknij **Save**.
4. Aplikacja będzie natychmiast dostępna pod adresem: `https://nurbsn.github.io/nRomSearch/`

---

## 📄 Licencja

Projekt udostępniony na licencji MIT. Zobacz plik [LICENSE](LICENSE).
Internet Archive oraz logotypy platform są znakami towarowymi ich prawowitych właścicieli.
