/**
 * nRomSearch - API Client dla Internet Archive & Repozytoriów Gier Retro
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
    daijishoCode: 'all',
    repoFile: null,
    libretroSystem: null
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
    daijishoCode: 'snes',
    repoFile: 'SNESGames.json',
    libretroSystem: 'Nintendo_-_Super_Nintendo_Entertainment_System'
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
    daijishoCode: 'gba',
    repoFile: 'GBAGames.json',
    libretroSystem: 'Nintendo_-_Game_Boy_Advance'
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
    daijishoCode: 'gbc',
    repoFile: 'GBCGames.json',
    libretroSystem: 'Nintendo_-_Game_Boy_Color'
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
    daijishoCode: 'nes',
    repoFile: 'NESGames.json',
    libretroSystem: 'Nintendo_-_Nintendo_Entertainment_System'
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
    daijishoCode: 'n64',
    repoFile: 'N64Games.json',
    libretroSystem: 'Nintendo_-_Nintendo_64'
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
    daijishoCode: 'nds',
    repoFile: 'DSGames.json',
    libretroSystem: 'Nintendo_-_Nintendo_DS'
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
    daijishoCode: 'gc',
    repoFile: 'GamecubeGames.json',
    libretroSystem: 'Nintendo_-_GameCube'
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
    daijishoCode: 'psx',
    repoFile: 'PS1Games.json',
    libretroSystem: 'Sony_-_PlayStation'
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
    daijishoCode: 'ps2',
    repoFile: 'PS2Games.json',
    libretroSystem: 'Sony_-_PlayStation_2'
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
    daijishoCode: 'psp',
    repoFile: null,
    libretroSystem: 'Sony_-_PlayStation_Portable'
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
    daijishoCode: 'megadrive',
    repoFile: 'SegaGenesisGames.json',
    libretroSystem: 'Sega_-_Mega_Drive_-_Genesis'
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
    daijishoCode: 'dc',
    repoFile: 'DreamcastGames.json',
    libretroSystem: 'Sega_-_Dreamcast'
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
    daijishoCode: 'arcade',
    repoFile: 'ArcadeGames.json',
    libretroSystem: 'FBNeo_-_Arcade_Games'
  }
];

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

export const IGNORED_EXTENSIONS = new Set([
  '.xml', '.sqlite', '.torrent', '.txt', '.json', '.log',
  '.jpg', '.png', '.jpeg', '.gif', '.webp', '.bmp'
]);

// Podręczna pamięć podręczna pobranych katalogów z repozytorium GitHub
const catalogCache = new Map();

function normalizeStr(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Czyści nazwę gry z dopisków regionalnych i znaków specjalnych
 */
export function cleanGameTitle(rawTitle) {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/\s*†.*$/, '')
    .replace(/\s*-\s*•.*$/, '')
    .replace(/\s*\(v\d+(\.\d+)?\)/i, '')
    .replace(/\s*\[.*?\]/g, '')
    .trim();
}

/**
 * Buduje URL oficjalnego boxartu z repozytorium Libretro Thumbnails
 */
export function getLibretroBoxart(platform, cleanTitle) {
  if (!platform || !platform.libretroSystem || !cleanTitle) return '';
  // Usuń akcenty dla kompatybilności z bazą Libretro (np. Pokémon -> Pokemon)
  const asciiTitle = cleanTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const formatted = asciiTitle.replace(/[\/\\:*?"<>|]/g, ' -').replace(/\s+/g, ' ').trim();
  return `https://raw.githubusercontent.com/libretro-thumbnails/${platform.libretroSystem}/master/Named_Boxarts/${encodeURIComponent(formatted + ' (USA).png')}`;
}

/**
 * Formatowanie bajtów do czytelnej postaci (MB / GB)
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
 * Pobiera miniaturę dla danego identyfikatora Internet Archive
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
  return `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(filename)}`;
}

/**
 * Pobiera pełną bazę gier dla danej konsoli z repozytorium GitHub
 */
export async function fetchPlatformCatalog(platformId, signal) {
  if (catalogCache.has(platformId)) {
    return catalogCache.get(platformId);
  }

  const platform = PLATFORMS.find(p => p.id === platformId);
  if (!platform || !platform.repoFile) {
    return [];
  }

  const url = `https://raw.githubusercontent.com/Elbriga14/EveryVideoGameEver/master/GamesDB/${platform.repoFile}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać listy gier z repozytorium (${response.status})`);
  }

  const data = await response.json();
  const processed = data.map(item => {
    const rawName = item.Game || '';
    const clean = cleanGameTitle(rawName);
    return {
      title: clean || rawName,
      rawTitle: rawName,
      cleanTitle: clean,
      year: item.Year ? String(item.Year) : '',
      developer: item.Dev || '',
      publisher: item.Publisher || '',
      platformId: platform.id,
      platformName: platform.shortName,
      thumbnail: getLibretroBoxart(platform, clean),
      isCatalog: true
    };
  });

  catalogCache.set(platformId, processed);
  return processed;
}

/**
 * Przeszukiwanie bazy gier z repozytorium (natychmiastowe filtrowanie w pamięci)
 */
export async function searchCatalog({ query = '', platformId = 'snes', page = 1, rows = 36, signal }) {
  let allGames = [];

  if (platformId === 'all') {
    // Jeśli wybrano "Wszystkie", pobierz popularne platformy
    const targetPlatforms = ['snes', 'gba', 'ps1', 'genesis', 'n64'];
    const results = await Promise.all(targetPlatforms.map(id => fetchPlatformCatalog(id, signal).catch(() => [])));
    allGames = results.flat();
  } else {
    allGames = await fetchPlatformCatalog(platformId, signal);
  }

  const cleanQ = normalizeStr((query || '').trim());
  let filtered = allGames;

  if (cleanQ) {
    filtered = allGames.filter(g => {
      const normTitle = normalizeStr(g.cleanTitle);
      const normPub = normalizeStr(g.publisher);
      return normTitle.includes(cleanQ) || normPub.includes(cleanQ);
    });
  }

  const total = filtered.length;
  const start = (page - 1) * rows;
  const pagedGames = filtered.slice(start, start + rows);

  return {
    total,
    page,
    rows,
    totalPages: Math.ceil(total / rows),
    games: pagedGames
  };
}

/**
 * Bezpieczne budowanie zapytania dla Internet Archive
 */
function buildSearchQuery(queryText, platformId, trustedOnly) {
  const parts = ['mediatype:(software)'];

  const cleanText = (queryText || '').trim().replace(/[^\w\s\-\.]/gi, ' ');
  if (cleanText) {
    const terms = cleanText.split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      const titleMatches = terms.map(t => `title:${t}*`).join(' AND ');
      parts.push(`(${titleMatches})`);
    }
  }

  if (platformId && platformId !== 'all') {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (platform && platform.queryFilter) {
      parts.push(platform.queryFilter);
    }
  }

  if (trustedOnly) {
    parts.push('(collection:(no-intro*) OR collection:(redump*) OR collection:(tosec*) OR collection:(hearto*))');
  }

  parts.push('-collection:(emptyfiles)');
  parts.push('-mediatype:(collection)');

  return parts.join(' AND ');
}

/**
 * Wyszukiwanie bezpośrednie w Internet Archive
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

  const games = docs.map(doc => {
    return {
      identifier: doc.identifier,
      title: doc.title || doc.identifier,
      cleanTitle: cleanGameTitle(doc.title || doc.identifier),
      description: doc.description || '',
      downloads: doc.downloads || 0,
      year: doc.year || '',
      collections: Array.isArray(doc.collection) ? doc.collection : (doc.collection ? [doc.collection] : []),
      thumbnail: getThumbnailUrl(doc.identifier),
      isCatalog: false
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
 * Szuka pliku ROM w Internet Archive dla konkretnego tytułu z katalogu
 */
export async function findRomForCatalogGame(game, signal) {
  const platform = PLATFORMS.find(p => p.id === game.platformId);
  const cleanTitle = game.cleanTitle;

  // Zapytanie wyszukujące pozycje odpowiadające konkretnemu tytułowi gry
  const query = `title:("${cleanTitle}") ${platform?.queryFilter ? 'AND ' + platform.queryFilter : ''} AND mediatype:(software)`;
  const params = new URLSearchParams({
    q: query,
    'fl[]': 'identifier,title,downloads,description',
    'sort[]': '-downloads',
    rows: '5',
    output: 'json'
  });

  const url = `https://archive.org/advancedsearch.php?${params.toString()}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Błąd zapytania IA (${response.status})`);
  }

  const data = await response.json();
  const docs = data.response?.docs || [];

  if (docs.length === 0) {
    // Fallback: próba wyszukania bez cudzysłowu
    const fallbackQuery = `title:(${cleanTitle}) ${platform?.queryFilter ? 'AND ' + platform.queryFilter : ''} AND mediatype:(software)`;
    const fallbackParams = new URLSearchParams({
      q: fallbackQuery,
      'fl[]': 'identifier,title,downloads',
      'sort[]': '-downloads',
      rows: '3',
      output: 'json'
    });
    const fallbackRes = await fetch(`https://archive.org/advancedsearch.php?${fallbackParams.toString()}`, { signal });
    const fallbackData = await fallbackRes.json();
    const fallbackDocs = fallbackData.response?.docs || [];
    if (fallbackDocs.length > 0) {
      return fetchGameFiles(fallbackDocs[0].identifier, signal);
    }
    return {
      identifier: null,
      romFiles: [],
      otherFiles: [],
      totalFilesCount: 0,
      searchUrl: `https://archive.org/search.php?query=${encodeURIComponent(cleanTitle + ' ' + (platform?.shortName || ''))}`
    };
  }

  // Pobierz pliki z pierwszego (najpopularniejszego) archiwum
  return fetchGameFiles(docs[0].identifier, signal);
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

    const lowerName = name.toLowerCase();
    const isSystemMeta = lowerName.endsWith('_archive.torrent') ||
                         lowerName.endsWith('_files.xml') ||
                         lowerName.endsWith('_meta.xml') ||
                         lowerName.endsWith('_meta.sqlite') ||
                         lowerName.endsWith('_thumb.jpg') ||
                         lowerName.startsWith('__ia_thumb');

    if (isSystemMeta) continue;

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

  romFiles.sort((a, b) => a.filename.localeCompare(b.filename));
  otherFiles.sort((a, b) => a.filename.localeCompare(b.filename));

  return {
    identifier,
    romFiles,
    otherFiles,
    totalFilesCount: rawFiles.length
  };
}
