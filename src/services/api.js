const API_BASE_URL = 'http://localhost:8000/api/v1';

// Chat Session Management API
export const getChatHistory = async (documentId, characterId) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/session/history?document_id=${documentId}&character_id=${characterId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
};

export const clearChatHistory = async (documentId, characterId) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/session/clear?document_id=${documentId}&character_id=${characterId}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Failed to clear chat history');
  }
  return response.json();
};

export const listActiveSessions = async (documentId) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/session/list?document_id=${documentId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch active sessions');
  }
  return response.json();
};

// Default Books API
export const getDefaultBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/default-books`);
  if (!response.ok) {
    throw new Error('Failed to fetch default books');
  }
  return response.json();
};

export const getBookCharacters = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/default-books/${bookId}/characters`);
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  return response.json();
};

// Default Movies API
export const getDefaultMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/default-movies`);
  if (!response.ok) {
    throw new Error('Failed to fetch default movies');
  }
  return response.json();
};

export const getMovieCharacters = async (movieId) => {
  const response = await fetch(`${API_BASE_URL}/default-movies/${movieId}/characters`);
  if (!response.ok) {
    throw new Error('Failed to fetch movie characters');
  }
  return response.json();
};

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
      include_personality: false  // Disable personality to avoid timeout
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

export const sendChatMessageStream = async (documentId, characterId, message, conversationHistory = [], onChunk) => {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
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
    throw new Error(error.detail || 'Chat streaming failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.substring(6));
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          if (data.done) {
            return accumulatedText;
          }
          
          if (data.text) {
            accumulatedText += data.text;
            if (onChunk) {
              onChunk(data.text, accumulatedText);
            }
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }

  return accumulatedText;
};

export const getDocumentStatus = async (documentId) => {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/status`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get document status');
  }

  return response.json();
};

export const listDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to list documents');
  }

  return response.json();
};

export const listAllCharacters = async () => {
  const response = await fetch(`${API_BASE_URL}/characters`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to list characters');
  }

  return response.json();
};

export const pollDocumentStatus = async (documentId, onProgress, maxAttempts = 60) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const status = await getDocumentStatus(documentId);
    
    if (onProgress) {
      onProgress(status);
    }
    
    if (status.status.toLowerCase() === 'ready') {
      return status;
    }
    
    if (status.status.toLowerCase() === 'error') {
      throw new Error(status.message || 'Document processing failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }
  
  throw new Error('Document processing timeout');
};
