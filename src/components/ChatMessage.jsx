import '../styles/ChatMessage.css';

function ChatMessage({ message, characterName, bookColor, isTyping }) {
  return (
    <div className={`message ${message.role}`}>
      {message.role === 'assistant' && (
        <div className="message-avatar" style={{ background: bookColor }}>
          {characterName.charAt(0)}
        </div>
      )}
      <div className="message-bubble">
        {isTyping ? (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        ) : (
          <div className="message-content">{message.content}</div>
        )}
      </div>
      {message.role === 'user' && (
        <div className="message-avatar user-avatar">You</div>
      )}
    </div>
  );
}

export default ChatMessage;
