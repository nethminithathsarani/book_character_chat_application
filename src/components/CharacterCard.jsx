import '../styles/CharacterCard.css';

function CharacterCard({ character, bookColor, onClick }) {
  // Remove cloud emoji and other unwanted emojis from description
  const cleanDescription = character.description 
    ? character.description.replace(/☁️|☁/g, '').trim()
    : '';
  
  return (
    <div className="character-card" onClick={onClick}>
      <div className="character-avatar" style={{ background: bookColor }}>
        {character.name.charAt(0)}
      </div>
      <h4>{character.name}</h4>
      <p>{cleanDescription}</p>
      <span className="character-role">{character.role}</span>
    </div>
  );
}

export default CharacterCard;
