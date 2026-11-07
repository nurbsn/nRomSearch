/**
 * nRomSearch - API Client dla Internet Archive
 */

export const PLATFORMS = [
  {
    id: 'all',
    name: 'Wszystkie platformy',
    shortName: 'Wszystkie',
    icon: '🎮',
    color: '#00f2fe',
    badgeClass: 'badge-all',
    extensions: ['.zip', '.7z', '.sfc', '.smc', '.gba', '.gb', '.gbc', '.nes', '.bin', '.chd', '.iso', '.cso', '.z64', '.n64', '.nds', '.gcm', '.cdi'],
    queryFilter: '',
    daijishoCode: 'all'
  },
  {
    id: 'snes',
    name: 'Super Nintendo (SNES)',
    shortName: 'SNES',
    icon: '🟣',
    color: '#a855f7',
    badgeClass: 'badge-snes',
    extensions: ['.sfc', '.smc', '.zip', '.7z'],
    queryFilter: '(snes OR "super nintendo" OR "super famicom")',
    daijishoCode: 'snes'
  },
  {
    id: 'gba',
    name: 'Game Boy Advance (GBA)',
    shortName: 'GBA',
    icon: '🔵',
    color: '#3b82f6',
    badgeClass: 'badge-gba',
    extensions: ['.gba', '.zip', '.7z'],
    queryFilter: '(gba OR "game boy advance" OR "gameboy advance")',
    daijishoCode: 'gba'
  },
  {
    id: 'gbc',
    name: 'Game Boy / Color (GB/GBC)',
    shortName: 'GB / GBC',
    icon: '🟢',
    color: '#10b981',
    badgeClass: 'badge-gbc',
    extensions: ['.gb', '.gbc', '.zip', '.7z'],
    queryFilter: '(gbc OR "game boy color" OR "gameboy color" OR "game boy")',
    daijishoCode: 'gbc'
  },
  {
    id: 'nes',
    name: 'Nintendo Entertainment System (NES)',
    shortName: 'NES',
    icon: '🔴',
    color: '#ef4444',
    badgeClass: 'badge-nes',
    extensions: ['.nes', '.zip', '.7z', '.fds'],
    queryFilter: '(nes OR "nintendo entertainment system" OR famicom)',
    daijishoCode: 'nes'
  },
  {
    id: 'n64',
    name: 'Nintendo 64 (N64)',
    shortName: 'N64',
    icon: '🟡',
    color: '#f59e0b',
    badgeClass: 'badge-n64',
    extensions: ['.z64', '.n64', '.v64', '.zip', '.7z'],
    queryFilter: '(n64 OR "nintendo 64")',
    daijishoCode: 'n64'
  },
  {
    id: 'nds',
    name: 'Nintendo DS (NDS)',
    shortName: 'NDS',
    icon: '⚪',
    color: '#06b6d4',
    badgeClass: 'badge-nds',
    extensions: ['.nds', '.zip', '.7z'],
    queryFilter: '(nds OR "nintendo ds")',
    daijishoCode: 'nds'
  },
  {
    id: 'gamecube',
    name: 'Nintendo GameCube (GCN)',
    shortName: 'GameCube',
    icon: '🟣',
    color: '#8b5cf6',
    badgeClass: 'badge-gamecube',
    extensions: ['.iso', '.gcm', '.cso', '.rvz', '.zip', '.7z'],
    queryFilter: '(gamecube OR gcn OR "nintendo gamecube")',
    daijishoCode: 'gc'
  },
  {
    id: 'ps1',
    name: 'Sony PlayStation (PS1 / PSX)',
    shortName: 'PS1',
    icon: '🟦',
    color: '#2563eb',
    badgeClass: 'badge-ps1',
    extensions: ['.chd', '.bin', '.cue', '.iso', '.pbp', '.zip', '.7z'],
    queryFilter: '(ps1 OR psx OR "playstation 1" OR "sony playstation")',
    daijishoCode: 'psx'
  },
  {
    id: 'ps2',
    name: 'Sony PlayStation 2 (PS2)',
    shortName: 'PS2',
    icon: '🔷',
    color: '#1d4ed8',
    badgeClass: 'badge-ps2',
    extensions: ['.iso', '.chd', '.bin', '.cso', '.gz', '.zip', '.7z'],
    queryFilter: '(ps2 OR "playstation 2" OR "sony playstation 2")',
    daijishoCode: 'ps2'
  },
  {
    id: 'psp',
    name: 'PlayStation Portable (PSP)',
    shortName: 'PSP',
    icon: '💠',
    color: '#0ea5e9',
    badgeClass: 'badge-psp',
    extensions: ['.iso', '.cso', '.chd', '.pbp', '.zip', '.7z'],
    queryFilter: '(psp OR "playstation portable")',
    daijishoCode: 'psp'
  },
  {
    id: 'genesis',
    name: 'Sega Genesis / Mega Drive',
    shortName: 'Genesis',
    icon: '⚫',
    color: '#e11d48',
    badgeClass: 'badge-genesis',
    extensions: ['.bin', '.md', '.smd', '.gen', '.zip', '.7z'],
    queryFilter: '(genesis OR "mega drive" OR megadrive OR "sega genesis")',
    daijishoCode: 'megadrive'
  },
  {
    id: 'dreamcast',
    name: 'Sega Dreamcast (DC)',
    shortName: 'Dreamcast',
    icon: '🌀',
    color: '#f97316',
    badgeClass: 'badge-dreamcast',
    extensions: ['.cdi', '.gdi', '.chd', '.iso', '.zip', '.7z'],
    queryFilter: '(dreamcast OR "sega dreamcast")',
    daijishoCode: 'dc'
  },
  {
    id: 'arcade',
    name: 'Arcade (MAME / FBNeo)',
    shortName: 'Arcade',
    icon: '🕹️',
    color: '#eab308',
    badgeClass: 'badge-arcade',
    extensions: ['.zip', '.7z', '.chd'],
    queryFilter: '(mame OR arcade OR fbneo OR "finalburn neo")',
    daijishoCode: 'arcade'
  }
];

// Domyślne znane rozszerzenia plików ROM
export const ROM_EXTENSIONS = new Set([
  '.zip', '.7z', '.rar',
  '.sfc', '.smc',
  '.gba', '.gb', '.gbc',
  '.nes', '.fds',
  '.z64', '.n64', '.v64',
  '.nds',
  '.iso', '.chd', '.bin', '.cue', '.cso', '.pbp', '.rvz', '.gcm', '.wbfs',
  '.cdi', '.gdi',
  '.md', '.smd', '.gen'
]);

// Ignorowane metadane i pliki systemowe
export const IGNORED_EXTENSIONS = new Set([
  '.xml', '.sqlite', '.torrent', '.txt', '.json', '.log',
  '.jpg', '.png', '.jpeg', '.gif', '.webp', '.bmp'
]);

/**
 * Formatowanie rozmiaru bajtów do czytelnej postaci (np. 14.5 MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Pobiera miniaturę dla danego identyfikatora IA
 */
export function getThumbnailUrl(identifier) {
  if (!identifier) return '';
  return `https://archive.org/services/img/${encodeURIComponent(identifier)}`;
}

/**
 * Pobiera bezpośredni link pobierania pliku
 */
export function getDownloadUrl(identifier, filename) {
  if (!identifier || !filename) return '';
  // Internet archive encode filenames
  return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(filename)}`;
}

/**
 * Bezpieczne budowanie zapytania wyszukiwania dla Internet Archive
 */
function buildSearchQuery(queryText, platformId, trustedOnly) {
  const parts = ['mediatype:(software)'];

  // Czyszczenie i przygotowanie tekstu zapytania
  const cleanText = (queryText || '').trim().replace(/[^\w\s\-\.]/gi, ' ');
  if (cleanText) {
    const terms = cleanText.split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      // Wyszukaj po tytule lub opisie
      const titleMatches = terms.map(t => `title:${t}*`).join(' AND ');
      parts.push(`(${titleMatches})`);
    }
  }

  // Filtr platformy
  if (platformId && platformId !== 'all') {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (platform && platform.queryFilter) {
      parts.push(platform.queryFilter);
    }
  }

  // Filtr zaufanych kolekcji (No-Intro, Redump, TOSEC)
  if (trustedOnly) {
    parts.push('(collection:(no-intro*) OR collection:(redump*) OR collection:(tosec*) OR collection:(hearto*))');
  }

  // Wykluczenia pustych paczek i systemowych kontenerów
  parts.push('-collection:(emptyfiles)');
  parts.push('-mediatype:(collection)');

  return parts.join(' AND ');
}

/**
 * Wyszukiwanie gier w Internet Archive
 */
export async function searchGames({ query = '', platformId = 'all', trustedOnly = false, page = 1, rows = 36, signal }) {
  const searchQuery = buildSearchQuery(query, platformId, trustedOnly);

  const params = new URLSearchParams();
  params.append('q', searchQuery);
  params.append('fl[]', 'identifier');
  params.append('fl[]', 'title');
  params.append('fl[]', 'description');
  params.append('fl[]', 'downloads');
  params.append('fl[]', 'publicdate');
  params.append('fl[]', 'year');
  params.append('fl[]', 'collection');
  params.append('sort[]', '-downloads');
  params.append('rows', String(rows));
  params.append('start', String((page - 1) * rows));
  params.append('output', 'json');

  const url = `https://archive.org/advancedsearch.php?${params.toString()}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Błąd API Internet Archive (${response.status}: ${response.statusText})`);
  }

  const data = await response.json();
  const docs = data.response?.docs || [];
  const total = data.response?.numFound || 0;

  // Wzbogacenie obiektów o rozpoznaną platformę i URL miniatury
  const games = docs.map(doc => {
    return {
      identifier: doc.identifier,
      title: doc.title || doc.identifier,
      description: doc.description || '',
      downloads: doc.downloads || 0,
      year: doc.year || '',
      collections: Array.isArray(doc.collection) ? doc.collection : (doc.collection ? [doc.collection] : []),
      thumbnail: getThumbnailUrl(doc.identifier)
    };
  });

  return {
    total,
    page,
    rows,
    totalPages: Math.ceil(total / rows),
    games
  };
}

/**
 * Pobiera listę plików w danym archiwum i wyłania pliki ROM
 */
export async function fetchGameFiles(identifier, signal) {
  if (!identifier) throw new Error('Brak identyfikatora archiwum');

  const url = `https://archive.org/metadata/${encodeURIComponent(identifier)}/files`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać listy plików (${response.status})`);
  }

  const data = await response.json();
  const rawFiles = data.result || data.files || [];

  const romFiles = [];
  const otherFiles = [];

  for (const f of rawFiles) {
    const name = f.name || '';
    const size = parseInt(f.size || '0', 10);
    const format = f.format || '';

    // Sprawdź czy to plik systemowy/metadane
    const lowerName = name.toLowerCase();
    const isSystemMeta = lowerName.endsWith('_archive.torrent') ||
                         lowerName.endsWith('_files.xml') ||
                         lowerName.endsWith('_meta.xml') ||
                         lowerName.endsWith('_meta.sqlite') ||
                         lowerName.endsWith('_thumb.jpg') ||
                         lowerName.startsWith('__ia_thumb');

    if (isSystemMeta) continue;

    // Rozpoznawanie rozszerzenia
    const dotIdx = lowerName.lastIndexOf('.');
    const ext = dotIdx !== -1 ? lowerName.substring(dotIdx) : '';

    const fileItem = {
      name,
      filename: name.split('/').pop(),
      size,
      formattedSize: formatBytes(size),
      format,
      extension: ext,
      downloadUrl: getDownloadUrl(identifier, name),
      isRom: ROM_EXTENSIONS.has(ext) || format === 'ZIP' || format === '7z'
    };

    if (fileItem.isRom) {
      romFiles.push(fileItem);
    } else if (!IGNORED_EXTENSIONS.has(ext)) {
      otherFiles.push(fileItem);
    }
  }

  // Sortuj pliki ROM alfabetycznie
  romFiles.sort((a, b) => a.filename.localeCompare(b.filename));
  otherFiles.sort((a, b) => a.filename.localeCompare(b.filename));

  return {
    identifier,
    romFiles,
    otherFiles,
    totalFilesCount: rawFiles.length
  };
}
