import React from "react";

export default function CharacterItem({ character, active, onClick }) {
  return (
    <li
      className={`character-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <img src={character.avatar} alt={character.name} className="avatar" />
      <div className="character-meta">
        <span className="name">{character.name}</span>
        <span className="book muted">{character.book}</span>
      </div>
    </li>
  );
}
