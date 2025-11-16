import { useState } from 'react';
import CharacterCard from '../components/CharacterCard';
import ChatMessage from '../components/ChatMessage';
import { extractCharacters, getCharacterGreeting, sendChatMessage } from '../services/api';
import '../styles/Chat.css';

function Chat({ book, documentId, onBack }) {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const handleExtractCharacters = async () => {
    setExtracting(true);
    try {
      const result = await extractCharacters(documentId);
      setCharacters(result.characters);
    } catch (error) {
      console.error('Character extraction failed:', error);
      alert('Failed to extract characters: ' + error.message);
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
    setChatLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const result = await sendChatMessage(
        documentId,
        selectedCharacter.character_id,
        userMessage,
        conversationHistory
      );
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.response 
      }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble responding. Please try again.' 
      }]);
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

      {characters.length === 0 ? (
        <div className="character-select-screen">
          <div className="extract-card">
            <div className="extract-icon">🎭</div>
            <h3>Discover Characters</h3>
            <p>Extract characters from this book to start chatting</p>
            <button 
              className="extract-button"
              onClick={handleExtractCharacters}
              disabled={extracting}
            >
              {extracting ? 'Extracting...' : 'Extract Characters'}
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
