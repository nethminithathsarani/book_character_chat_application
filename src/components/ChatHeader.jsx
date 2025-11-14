import React from "react";

export default function ChatHeader({ character }) {
  return (
    <header className="chat-header">
      <div className="chat-title">
        <img src={character.avatar} alt={character.name} className="avatar lg" />
        <div>
          <h1>{character.name}</h1>
          <p className="muted">{character.book}</p>
        </div>
      </div>
      <div className="chat-actions">
        <button className="btn ghost">Search</button>
        <button className="btn ghost">Settings</button>
      </div>
    </header>
  );
}
