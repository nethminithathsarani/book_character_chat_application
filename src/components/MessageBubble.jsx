import React from "react";

export default function MessageBubble({ sender, text, timestamp, avatar, name }) {
  const isUser = sender === "user";
  const date = new Date(timestamp);

  return (
    <div className={`message-row ${isUser ? "right" : "left"}`}>
      {!isUser && avatar && (
        <img className="avatar sm" src={avatar} alt={name} />
      )}
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-character"}`}>
        {!isUser && <div className="bubble-name">{name}</div>}
        <div className="bubble-text">{text}</div>
        <div className="bubble-time">
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
