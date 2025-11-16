const API_BASE_URL = 'http://localhost:8000/api/v1';

export const uploadBook = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
};

export const extractCharacters = async (documentId, maxCharacters = 10) => {
  const response = await fetch(`${API_BASE_URL}/characters/extract-characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_id: documentId,
      max_characters: maxCharacters,
      include_personality: false
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Character extraction failed');
  }

  return response.json();
};

export const getCharacterGreeting = async (documentId, characterId) => {
  const response = await fetch(`${API_BASE_URL}/chat/greeting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_id: documentId,
      character_id: characterId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get greeting');
  }

  return response.json();
};

export const sendChatMessage = async (documentId, characterId, message, conversationHistory = []) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_id: documentId,
      character_id: characterId,
      message: message,
      conversation_history: conversationHistory
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Chat failed');
  }

  return response.json();
};
