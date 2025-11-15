// Lightweight API client for frontend actions
export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);

  const res = await fetch('/api/v1/upload', {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  return res.json(); // expected { document_id }
}

export async function extractCharacters(document_id) {
  const res = await fetch('/api/v1/extract_characters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Extract failed: ${res.status} ${text}`);
  }
  return res.json(); // expected { characters: [...] }
}

export async function generateAvatar(payload) {
  // payload: { name, traits }
  const res = await fetch('/api/generate-avatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Avatar generation failed: ${res.status} ${text}`);
  }
  return res.json(); // expected { avatar_base64 }
}

export async function sendChatMessage({ character_id, message, session_id }) {
  const url = `/api/v1/chat/${encodeURIComponent(character_id)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chat request failed: ${res.status} ${text}`);
  }
  return res.json(); // expected { reply: { role, content, emotion? } }
}
