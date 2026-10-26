/**
 * Central localStorage manager for Platformer Adventure.
 * All persistent data goes through this module.
 */

const STORAGE_KEY = 'platformer_adventure_save_v2';

const DEFAULT_DATA = {
  bestScore: 0,
  totalCoins: 0,
  totalDiamonds: 0,
  ownedItems: ['skin_default'],
  equippedSkin: 'skin_default',
  settings: {
    music: true,
    sfx: true
  },
  sessionHistory: [] // last few sessions { score, coins, date }
};

function safeParse(raw) {
  try {
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;
    return data;
  } catch {
    return null;
  }
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse(raw);
  if (!parsed) {
    return { ...DEFAULT_DATA, ownedItems: [...DEFAULT_DATA.ownedItems], settings: { ...DEFAULT_DATA.settings }, sessionHistory: [] };
  }
  // Merge with defaults so new fields appear after updates
  return {
    bestScore: typeof parsed.bestScore === 'number' ? Math.max(0, parsed.bestScore) : 0,
    totalCoins: typeof parsed.totalCoins === 'number' ? Math.max(0, parsed.totalCoins) : 0,
    totalDiamonds: typeof parsed.totalDiamonds === 'number' ? Math.max(0, parsed.totalDiamonds) : 0,
    ownedItems: Array.isArray(parsed.ownedItems) ? parsed.ownedItems : [...DEFAULT_DATA.ownedItems],
    equippedSkin: typeof parsed.equippedSkin === 'string' ? parsed.equippedSkin : 'skin_default',
    settings: {
      music: parsed.settings?.music !== false,
      sfx: parsed.settings?.sfx !== false
    },
    sessionHistory: Array.isArray(parsed.sessionHistory) ? parsed.sessionHistory.slice(0, 10) : []
  };
}

export function saveData(data) {
  try {
    const toSave = {
      bestScore: Math.max(0, data.bestScore || 0),
      totalCoins: Math.max(0, data.totalCoins || 0),
      totalDiamonds: Math.max(0, data.totalDiamonds || 0),
      ownedItems: Array.isArray(data.ownedItems) ? data.ownedItems : ['skin_default'],
      equippedSkin: data.equippedSkin || 'skin_default',
      settings: {
        music: data.settings?.music !== false,
        sfx: data.settings?.sfx !== false
      },
      sessionHistory: Array.isArray(data.sessionHistory) ? data.sessionHistory.slice(0, 10) : []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.warn('Storage save failed', e);
    return false;
  }
}

export function resetAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Add a finished session to history and update best score / coins. Returns updated data. */
export function finalizeSession(score, sessionCoins) {
  const data = loadData();
  const earned = Math.max(0, Math.floor(sessionCoins));
  data.totalCoins += earned;
  if (score > data.bestScore) {
    data.bestScore = score;
  }
  data.sessionHistory.unshift({
    score,
    coins: earned,
    date: Date.now()
  });
  data.sessionHistory = data.sessionHistory.slice(0, 10);
  saveData(data);
  return data;
}

export function addDiamonds(amount) {
  const data = loadData();
  data.totalDiamonds = Math.max(0, data.totalDiamonds + Math.floor(amount));
  saveData(data);
  return data;
}

export function buyItem(itemId, price, currency) {
  const data = loadData();
  if (data.ownedItems.includes(itemId)) {
    return { ok: false, reason: 'already_owned', data };
  }
  if (currency === 'coin') {
    if (data.totalCoins < price) return { ok: false, reason: 'insufficient_coins', data };
    data.totalCoins -= price;
  } else if (currency === 'diamond') {
    if (data.totalDiamonds < price) return { ok: false, reason: 'insufficient_diamonds', data };
    data.totalDiamonds -= price;
  } else {
    return { ok: false, reason: 'invalid_currency', data };
  }
  data.ownedItems.push(itemId);
  saveData(data);
  return { ok: true, data };
}

export function equipSkin(itemId) {
  const data = loadData();
  if (!data.ownedItems.includes(itemId)) {
    return { ok: false, reason: 'not_owned', data };
  }
  data.equippedSkin = itemId;
  saveData(data);
  return { ok: true, data };
}

export function updateSettings(partial) {
  const data = loadData();
  data.settings = { ...data.settings, ...partial };
  saveData(data);
  return data;
}
