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

export const uploadBook = async (file, saveToLibrary = false, title = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Upload API called with saveToLibrary:', saveToLibrary);
  
  if (saveToLibrary) {
    formData.append('save_to_library', 'true');
    // Use provided title or extract from filename
    const bookTitle = title || file.name.replace('.pdf', '');
    formData.append('title', bookTitle);
    console.log('Added save_to_library and title to form data:', bookTitle);
  }

  console.log('Uploading to:', `${API_BASE_URL}/upload`);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  console.log('Upload response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload error response:', errorText);
    try {
      const error = JSON.parse(errorText);
      throw new Error(error.detail || 'Upload failed');
    } catch {
      throw new Error(`Upload failed: ${errorText}`);
    }
  }

  return response.json();
};

// Library Management API
export const getLibraryBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/library`);
  if (!response.ok) {
    throw new Error('Failed to fetch library books');
  }
  return response.json();
};

export const getLibraryBookCharacters = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/library/${bookId}/characters`);
  if (!response.ok) {
    throw new Error('Failed to fetch library book characters');
  }
  return response.json();
};

export const toggleFavorite = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/library/${bookId}/favorite`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }
  return response.json();
};

export const removeFromLibrary = async (bookId, deleteFiles = false) => {
  const url = `${API_BASE_URL}/library/${bookId}${deleteFiles ? '?delete_files=true' : ''}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    let errorMessage = 'Failed to remove from library';
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

export const saveToLibrary = async (documentId, title, metadata = {}) => {
  // According to API spec: POST /api/library expects JSON with required fields:
  // document_id, title, file_path, file_size
  // Optional: author, description, cover_image, page_count
  
  // Try to get file_size from document info if not provided
  let fileSize = metadata.file_size;
  if (!fileSize && documentId) {
    try {
      const docStatus = await getDocumentStatus(documentId);
      fileSize = docStatus.file_size || 0;
    } catch (error) {
      console.warn('Could not fetch document status for file_size:', error);
      fileSize = 0; // Default fallback
    }
  }
  
  const requestBody = {
    document_id: documentId,
    title: title,
    file_path: metadata.file_path || `data/uploads/${documentId}.pdf`,
    file_size: fileSize,
    author: metadata.author || null,
    description: metadata.description || null,
    cover_image: metadata.cover_image || null,
    page_count: metadata.page_count || null
  };
  
  console.log('Saving to library with request body:', requestBody);
  
  const response = await fetch(`${API_BASE_URL}/library`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    let errorMessage = 'Failed to save to library';
    
    try {
      const error = await response.json();
      console.error('Save to library error response:', error);
      
      // Handle different error response formats
      if (Array.isArray(error)) {
        // If error is an array, extract messages from each item
        errorMessage = error.map(err => {
          if (typeof err === 'object' && err.msg) {
            return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
          } else if (typeof err === 'string') {
            return err;
          } else {
            return JSON.stringify(err);
          }
        }).join(', ');
      } else if (error.detail) {
        // Handle FastAPI detail format (could be string or array)
        if (Array.isArray(error.detail)) {
          errorMessage = error.detail.map(err => {
            if (typeof err === 'object' && err.msg) {
              return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
            } else if (typeof err === 'string') {
              return err;
            } else {
              return JSON.stringify(err);
            }
          }).join(', ');
        } else {
          errorMessage = error.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = JSON.stringify(error);
      }
    } catch {
      // If response is not JSON, try to get text
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
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

// Unified Books API - Check if characters are already extracted
export const checkBookCharacters = async (bookIdentifier) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookIdentifier}/characters`);
  
  if (response.ok) {
    // Characters exist (200)
    return { exists: true, data: await response.json() };
  } else if (response.status === 404) {
    // Characters not extracted yet (404)
    return { exists: false, data: null };
  } else {
    // Other error
    const error = await response.json();
    throw new Error(error.detail || 'Failed to check characters');
  }
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
