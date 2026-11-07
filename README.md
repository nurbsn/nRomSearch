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

## 📱 Integracja z launcherem Daijishō

Aplikację można zintegrować z Daijishō na urządzeniach przenośnych (np. Retroid Pocket, Anbernic, AYN Odin, smartfony):

1. **Folder pobierania:** W przeglądarce mobilnej ustaw domyślny folder pobierania na katalog pamięci ROM na karcie SD lub w pamięci urządzenia (np. `/ROMs/<platforma>`).
2. **Synchronizacja:** Po pobraniu pliku ROM kliknij w Daijishō `Paths -> Sync library` dla danej konsoli.
3. **Skrót wyszukiwania (Web Intent):**
   Możesz skonfigurować wywołanie nRomSearch z szablonem:
   ```text
   https://nurbsn.github.io/nRomSearch/?platform={platform}&q={title}
   ```

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
