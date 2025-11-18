import { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';
import ChatMessage from '../components/ChatMessage';
import { extractCharacters, getCharacterGreeting, sendChatMessageStream, pollDocumentStatus, getBookCharacters } from '../services/api';
import '../styles/Chat.css';

function Chat({ book, documentId, preselectedCharacterId, onBack }) {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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
    setSelectedCharacter(character);
    setMessages([]);

    try {
      const result = await getCharacterGreeting(documentId, character.character_id);
      setMessages([{
        role: 'assistant',
        content: result.greeting
      }]);
    } catch (error) {
      console.error('Failed to get greeting:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Add empty assistant message that will be filled with streaming text
    const assistantMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    
    setChatLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
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
            const newMessages = [...prev];
            newMessages[assistantMessageIndex] = {
              role: 'assistant',
              content: fullText
            };
            return newMessages;
          });
        }
      );
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I had trouble responding. Please try again.'
        };
        return newMessages;
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
              <p className="character-desc">{selectedCharacter.description}</p>
            </div>
            <button 
              className="change-character-btn"
              onClick={() => setSelectedCharacter(null)}
            >
              Change Character
            </button>
          </div>

          <div className="chat-main">
            <div className="messages-container">
              {messages.map((msg, idx) => (
                <ChatMessage 
                  key={idx}
                  message={msg}
                  characterName={selectedCharacter.name}
                  bookColor={book.color}
                />
              ))}
              {chatLoading && (
                <ChatMessage 
                  message={{ role: 'assistant', content: '' }}
                  characterName={selectedCharacter.name}
                  bookColor={book.color}
                  isTyping
                />
              )}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
