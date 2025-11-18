import { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';
import ChatMessage from '../components/ChatMessage';
import { extractCharacters, getCharacterGreeting, sendChatMessageStream, pollDocumentStatus, getBookCharacters, getChatHistory, clearChatHistory } from '../services/api';
import '../styles/Chat.css';

function Chat({ book, documentId, preselectedCharacterId, onBack }) {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Check if this is a default book
  const isDefaultBook = book?.book_id && book.book_id.includes('_');

  useEffect(() => {
    // If it's a default book, load characters from API
    if (isDefaultBook && book.book_id) {
      loadDefaultBookCharacters();
    }
  }, [book, isDefaultBook]);

  useEffect(() => {
    // If a character is preselected, auto-select it
    if (preselectedCharacterId && characters.length > 0) {
      const character = characters.find(c => c.character_id === preselectedCharacterId);
      if (character) {
        handleSelectCharacter(character);
      }
    }
  }, [preselectedCharacterId, characters]);

  const loadDefaultBookCharacters = async () => {
    try {
      const response = await getBookCharacters(book.book_id);
      setCharacters(response.characters);
    } catch (error) {
      console.error('Failed to load default book characters:', error);
    }
  };

  const handleExtractCharacters = async () => {
    setExtracting(true);
    setStatusMessage('Checking document status...');
    
    try {
      // Wait for document to be ready
      await pollDocumentStatus(documentId, (status) => {
        setStatusMessage(`Processing: ${status.status} (${status.progress}%)`);
      });
      
      setStatusMessage('Extracting characters...');
      
      // Extract fewer characters to avoid timeout
      const result = await extractCharacters(documentId, 5);
      setCharacters(result.characters);
      setStatusMessage('');
    } catch (error) {
      console.error('Character extraction failed:', error);
      alert('Failed to extract characters: ' + error.message);
      setStatusMessage('');
    } finally {
      setExtracting(false);
    }
  };

  const handleSelectCharacter = async (character) => {
    console.log('🎯 Selecting character:', character.name, character.character_id);
    console.log('📚 Document ID:', documentId);
    console.log('📖 Is default book:', isDefaultBook);
    
    setSelectedCharacter(character);
    setMessages([]);
    setLoadingHistory(true);

    try {
      // Load previous chat history for default books only
      if (isDefaultBook && documentId) {
        console.log('🔍 Loading chat history from backend...');
        try {
          const historyData = await getChatHistory(documentId, character.character_id);
          console.log('📥 History data received:', historyData);
          
          if (historyData.conversation_history && historyData.conversation_history.length > 0) {
            // User has chatted with this character before - load history
            console.log('✅ Found previous history! Loading', historyData.conversation_history.length, 'messages');
            setMessages(historyData.conversation_history);
            setLoadingHistory(false);
            return; // Exit early, don't fetch greeting
          } else {
            console.log('📭 No previous history found');
          }
        } catch (historyError) {
          // If history fetch fails, continue to greeting
          console.log('❌ Error loading history:', historyError);
          console.log('➡️ Continuing to greeting...');
        }
      } else {
        console.log('⏭️ Skipping history load (not a default book or no documentId)');
      }

      // First time chatting or not a default book - get greeting
      console.log('👋 Fetching greeting...');
      const result = await getCharacterGreeting(documentId, character.character_id);
      console.log('✉️ Greeting received:', result);
      setMessages([{
        role: 'assistant',
        content: result.greeting
      }]);
    } catch (error) {
      console.error('❌ Failed to get greeting:', error);
      // Fallback message if greeting fails
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm ${character.name}. ${character.description} What would you like to talk about?`
      }]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleClearChat = async () => {
    if (!selectedCharacter || !isDefaultBook) return;
    
    const confirmClear = window.confirm('Are you sure you want to clear this chat history? This cannot be undone.');
    if (!confirmClear) return;

    try {
      await clearChatHistory(documentId, selectedCharacter.character_id);
      setMessages([]);
      
      // Fetch greeting again after clearing
      const result = await getCharacterGreeting(documentId, selectedCharacter.character_id);
      setMessages([{
        role: 'assistant',
        content: result.greeting
      }]);
      
      alert('Chat history cleared successfully!');
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat history. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Store current messages before updating
    const currentMessages = [...messages];
    
    // Add user message
    const newMessages = [...currentMessages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    
    // Add empty assistant message that will be filled with streaming text
    const assistantMessageIndex = newMessages.length;
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    
    setChatLoading(true);

    try {
      // Use current messages for conversation history (before adding new user message)
      const conversationHistory = currentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Use streaming API with real-time updates
      await sendChatMessageStream(
        documentId,
        selectedCharacter.character_id,
        userMessage,
        conversationHistory,
        (chunk, fullText) => {
          // Update the assistant message with accumulated text
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[assistantMessageIndex] = {
              role: 'assistant',
              content: fullText
            };
            return updatedMessages;
          });
        }
      );
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I had trouble responding. Please try again.'
        };
        return updatedMessages;
      });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2 style={{ color: book.color }}>{book.title}</h2>
      </div>

      {characters.length === 0 && !isDefaultBook ? (
        <div className="character-select-screen">
          <div className="extract-card">
            <div className="extract-icon">🎭</div>
            <h3>Discover Characters</h3>
            <p>Extract characters from this book to start chatting</p>
            {statusMessage && (
              <p className="status-message">{statusMessage}</p>
            )}
            <button 
              className="extract-button"
              onClick={handleExtractCharacters}
              disabled={extracting}
            >
              {extracting ? 'Processing...' : 'Extract Characters'}
            </button>
          </div>
        </div>
      ) : !selectedCharacter ? (
        <div className="character-select-screen">
          <h3 className="select-title">Choose a Character</h3>
          <div className="characters-grid">
            {characters.map((char) => (
              <CharacterCard 
                key={char.character_id} 
                character={char}
                bookColor={book.color}
                onClick={() => handleSelectCharacter(char)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-screen">
          <div className="chat-sidebar">
            <div className="current-character" style={{ borderColor: book.color }}>
              <div className="character-avatar-large" style={{ background: book.color }}>
                {selectedCharacter.name.charAt(0)}
              </div>
              <h3>{selectedCharacter.name}</h3>
              <p className="character-desc">
                {selectedCharacter.description ? selectedCharacter.description.replace(/☁️|☁/g, '').trim() : ''}
              </p>
            </div>
            <button 
              className="change-character-btn"
              onClick={() => setSelectedCharacter(null)}
            >
              Change Character
            </button>
            {isDefaultBook && (
              <button 
                className="clear-chat-btn"
                onClick={handleClearChat}
                title="Clear conversation history"
              >
                🗑️ Clear Chat
              </button>
            )}
          </div>

          <div className="chat-main">
            {loadingHistory ? (
              <div className="loading-history">
                <p>Loading chat history...</p>
              </div>
            ) : (
              <>
                <div className="messages-container">
                  {messages.map((msg, idx) => (
                    <ChatMessage 
                      key={idx}
                      message={msg}
                      characterName={selectedCharacter.name}
                      bookColor={book.color}
                      isTyping={chatLoading && idx === messages.length - 1 && msg.role === 'assistant' && !msg.content}
                    />
                  ))}
                </div>

                <div className="input-area">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={chatLoading}
                  />
                  <button 
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={chatLoading || !inputMessage.trim()}
                    style={{ background: book.color }}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
