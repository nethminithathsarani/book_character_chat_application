import React from "react";
import CharacterItem from "./CharacterItem.jsx";

export default function Sidebar({ characters, selectedId, onSelect }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Characters</h2>
        <p className="muted">Pick a voice from literature</p>
      </div>
      <ul className="character-list">
        {characters.map(c => (
          <CharacterItem
            key={c.id}
            character={c}
            active={c.id === selectedId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </ul>
    </div>
  );
}
