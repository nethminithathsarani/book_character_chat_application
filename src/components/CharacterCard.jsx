import '../styles/CharacterCard.css';

// Character image mapping for Harry Potter
const characterImages = {
  'harry': '/books_images/HP/HP_harry.jpg',
  'harry potter': '/books_images/HP/HP_harry.jpg',
  'hermione': '/books_images/HP/Harry_hermione.jpg',
  'hermione granger': '/books_images/HP/Harry_hermione.jpg',
  'ron': '/books_images/HP/Harry_ron.jpg',
  'ron weasley': '/books_images/HP/Harry_ron.jpg',
  'dumbledore': '/books_images/HP/Harry_dumbledore.jpg',
  'albus dumbledore': '/books_images/HP/Harry_dumbledore.jpg',
  'hagrid': '/books_images/HP/Harry_hagrid.jpg',
  'rubeus hagrid': '/books_images/HP/Harry_hagrid.jpg',
  'snape': '/books_images/HP/Harry_snape.jpg',
  'severus snape': '/books_images/HP/Harry_snape.jpg',
  'sirius': '/books_images/HP/Harry_sirius.jpg',
  'sirius black': '/books_images/HP/Harry_sirius.jpg',
  'voldemort': '/books_images/HP/Harry_voldermort.jpg',
  'lord voldemort': '/books_images/HP/Harry_voldermort.jpg'
};

function CharacterCard({ character, bookColor, onClick }) {
  // Remove cloud emoji and other unwanted emojis from description
  const cleanDescription = character.description 
    ? character.description.replace(/☁️|☁/g, '').trim()
    : '';
  
  // Get character image based on name
  const characterName = character.name.toLowerCase();
  const characterImage = characterImages[characterName];
  
  return (
    <div className="character-card" onClick={onClick}>
      <div className="character-avatar" style={{ background: bookColor }}>
        {characterImage ? (
          <img src={characterImage} alt={character.name} className="character-image" />
        ) : (
          character.name.charAt(0)
        )}
      </div>
      <h4>{character.name}</h4>
      <p>{cleanDescription}</p>
      <span className="character-role">{character.role}</span>
    </div>
  );
}

export default CharacterCard;
