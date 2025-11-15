const DOCUMENT_KEY = 'document_id';
const SESSION_KEY = 'session_id';
const CHARACTER_KEY = 'selected_character';

export function saveDocumentId(id) {
  try { sessionStorage.setItem(DOCUMENT_KEY, id); } catch (e) {}
}
export function getDocumentId() {
  try { return sessionStorage.getItem(DOCUMENT_KEY); } catch (e) { return null; }
}

export function saveSelectedCharacter(character) {
  try { sessionStorage.setItem(CHARACTER_KEY, JSON.stringify(character)); } catch (e) {}
}
export function getSelectedCharacter() {
  try { const v = sessionStorage.getItem(CHARACTER_KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; }
}

export function ensureSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = cryptoRandomId();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch (e) {
    // fallback
    return null;
  }
}

export function getSessionId() {
  try { return sessionStorage.getItem(SESSION_KEY); } catch (e) { return null; }
}

function cryptoRandomId() {
  try {
    const arr = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(arr);
      return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
    }
  } catch (e) {}
  return Date.now().toString(36) + Math.random().toString(36).slice(2,10);
}
