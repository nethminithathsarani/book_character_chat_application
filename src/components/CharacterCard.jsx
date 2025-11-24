import '../styles/CharacterCard.css';

// Character image mapping - using base names for easier matching
const characterImages = {
  // Harry Potter
  'harry': '/books_images/HP/HP_harry.jpg',
  'hermione': '/books_images/HP/Harry_hermione.jpg',
  'ron': '/books_images/HP/Harry_ron.jpg',
  'dumbledore': '/books_images/HP/Harry_dumbledore.jpg',
  'hagrid': '/books_images/HP/Harry_hagrid.jpg',
  'snape': '/books_images/HP/Harry_snape.jpg',
  'sirius': '/books_images/HP/Harry_sirius.jpg',
  'voldemort': '/books_images/HP/Harry_voldermort.jpg',
  
  // Dune
  'paul': '/books_images/Dune/Du_Paul Atreides.png',
  'jessica': '/books_images/Dune/Du_Lady Jessica.png',
  'leto': '/books_images/Dune/Du_Duke Leto Atreides.png',
  'chani': '/books_images/Dune/Du_Chani.png',
  'duncan': '/books_images/Dune/Du_Duncan Idaho.png',
  'gurney': '/books_images/Dune/Du_Gurney Halleck.png',
  'halleck': '/books_images/Dune/Du_Gurney Halleck.png',
  'stilgar': '/books_images/Dune/Du_Stilgar.png',
  'baron': '/books_images/Dune/Du_Baron Vladimir Harkonnen.png',
  'harkonnen': '/books_images/Dune/Du_Baron Vladimir Harkonnen.png',
  'vladimir': '/books_images/Dune/Du_Baron Vladimir Harkonnen.png',
  'feyd': '/books_images/Dune/Du_Feyd-Rautha.png',
  'feyd-rautha': '/books_images/Dune/Du_Feyd-Rautha.png',
  'rautha': '/books_images/Dune/Du_Feyd-Rautha.png',
  
  // Dracula
  'dracula': '/books_images/Dracula/D_Count Dracula.png',
  'jonathan': '/books_images/Dracula/D_Jonathan Harker.png',
  'mina': '/books_images/Dracula/D_Mina Harker.png',
  'helsing': '/books_images/Dracula/D_Van Helsing.png',
  'seward': '/books_images/Dracula/D_Dr. Seward.png',
  'arthur': '/books_images/Dracula/D_Arthur Holmwood.png',
  'holmwood': '/books_images/Dracula/D_Arthur Holmwood.png',
  
  // Frankenstein
  'victor': '/books_images/Frankenstein/Victor Frankenstein.png',
  'frankenstein': '/books_images/Frankenstein/Victor Frankenstein.png',
  'creature': '/books_images/Frankenstein/The Creature.png',
  'monster': '/books_images/Frankenstein/The Creature.png',
  
  // Percy Jackson
  'percy': '/books_images/Percy Jackson & The Olympians/PJC_Percy Jackson.png',
  'annabeth': '/books_images/Percy Jackson & The Olympians/PJC_Annabeth Chase.png',
  'grover': '/books_images/Percy Jackson & The Olympians/PJC_Grover Underwood.png',
  'luke': '/books_images/Percy Jackson & The Olympians/PJC_Luke Castellan.png',
  'chiron': '/books_images/Percy Jackson & The Olympians/PJC_Chiron.png',
  'nico': '/books_images/Percy Jackson & The Olympians/PJC_Nico di Angelo.png',
  'kronos': '/books_images/Percy Jackson & The Olympians/PJC_Kronos.png',
  
  // Sherlock Holmes
  'sherlock': '/books_images/Sherlock Holmes/SH_Sherlock Holmes.png',
  'watson': '/books_images/Sherlock Holmes/SH_Dr. John Watson.png',
  'hudson': '/books_images/Sherlock Holmes/SH_Mrs. Hudson.png',
  'moriarty': '/books_images/Sherlock Holmes/SH_Professor Moriarty.png',
  'lestrade': '/books_images/Sherlock Holmes/SH_Inspector Lestrade.png',
  
  // Chronicles of Narnia
  'aslan': '/books_images/The Chronicles of Narnia/CN_Aslan.png',
  'lucy': '/books_images/The Chronicles of Narnia/CN_Lucy Pevensie.png',
  'edmund': '/books_images/The Chronicles of Narnia/CN_Edmund Pevensie.png',
  'peter': '/books_images/The Chronicles of Narnia/CN_Peter Pevensie.png',
  'susan': '/books_images/The Chronicles of Narnia/CN_Susan Pevensie.png',
  'caspian': '/books_images/The Chronicles of Narnia/CN_Prince Caspian.png',
  'witch': '/books_images/The Chronicles of Narnia/CN_The White Witch.png',
  'telmarines': '/books_images/The Chronicles of Narnia/CN_The Telmarines.png',
  
  // Lord of the Rings
  'frodo': '/books_images/LOTR/Frodo Baggins.jpg',
  'aragorn': '/books_images/LOTR/Aragorn.jpg',
  'gandalf': '/books_images/LOTR/Gandalf.png',
  'samwise': '/books_images/LOTR/Samwise Gamgee.jpg',
  'sam': '/books_images/LOTR/Samwise Gamgee.jpg',
  'legolas': '/books_images/LOTR/Legolas.jpg',
  'gimli': '/books_images/LOTR/Gimli.jpg',
  'gollum': '/books_images/LOTR/Gollum.png',
  'saruman': '/books_images/LOTR/Saruman.jpg',
  'sauron': '/books_images/LOTR/Sauron.jpg',
  'merry': '/books_images/LOTR/Merry.jpg',
  'pippin': '/books_images/LOTR/Pippin.jpg',
  
  // The Hobbit
  'bilbo': '/books_images/The Hobbit/Bilbo Baggins.png',
  'thorin': '/books_images/The Hobbit/Thorin Oakenshield.png',
  'oakenshield': '/books_images/The Hobbit/Thorin Oakenshield.png',
  'smaug': '/books_images/The Hobbit/Smaug.png',
  'balin': '/books_images/The Hobbit/Balin.png',
  'dwalin': '/books_images/The Hobbit/Dwalin.png',
  'fíli': '/books_images/The Hobbit/Fíli.png',
  'fili': '/books_images/The Hobbit/Fíli.png',
  'kíli': '/books_images/The Hobbit/Kíli.png',
  'kili': '/books_images/The Hobbit/Kíli.png',
  'goblin': '/books_images/The Hobbit/Goblin King.png',
  
  // Diary of a Wimpy Kid
  'greg': '/books_images/Diary of a Wimpy Kid/DWK_Greg Heffley.png',
  'rowley': '/books_images/Diary of a Wimpy Kid/DWK_Rowley Jefferson.png',
  'rodrick': '/books_images/Diary of a Wimpy Kid/DWK_Rodrick Heffley.png',
  'frank': '/books_images/Diary of a Wimpy Kid/DWK_Frank & Susan Heffley.png',
};

// Function to find character image by matching first name or key words
function findCharacterImage(characterName) {
  const normalizedName = characterName.toLowerCase().trim();
  
  // Log for debugging
  console.log('Looking for character image:', characterName, '→ normalized:', normalizedName);
  
  // Direct match
  if (characterImages[normalizedName]) {
    console.log('✓ Found direct match:', characterImages[normalizedName]);
    return characterImages[normalizedName];
  }
  
  // Try to find by first word (first name)
  const firstName = normalizedName.split(' ')[0];
  if (characterImages[firstName]) {
    console.log('✓ Found first name match:', firstName, '→', characterImages[firstName]);
    return characterImages[firstName];
  }
  
  // Try to match any word in the name
  const nameParts = normalizedName.split(' ');
  for (const part of nameParts) {
    if (characterImages[part]) {
      console.log('✓ Found word match:', part, '→', characterImages[part]);
      return characterImages[part];
    }
  }
  
  console.log('✗ No image found for:', characterName);
  return null;
}

function CharacterCard({ character, bookColor, onClick }) {
  // Remove cloud emoji and other unwanted emojis from description
  const cleanDescription = character.description 
    ? character.description.replace(/☁️|☁/g, '').trim()
    : '';
  
  // Get character image using smart matching
  const characterImage = findCharacterImage(character.name);
  
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
