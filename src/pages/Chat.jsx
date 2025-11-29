import { useState, useEffect } from 'react';
import CharacterCard from '../components/CharacterCard';
import ChatMessage from '../components/ChatMessage';
import { extractCharacters, getCharacterGreeting, sendChatMessageStream, pollDocumentStatus, getBookCharacters, getMovieCharacters, getChatHistory, clearChatHistory } from '../services/api';
import '../styles/Chat.css';

const API_BASE_URL = 'http://localhost:8000/api/v1';

function Chat({ book, documentId, preselectedCharacterId, onBack }) {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [progress, setProgress] = useState(null); // numeric percent from backend

  // Determine default content: prefer explicit is_default flag, then documentId prefix
  const isDefaultContent = (book?.is_default === true) || documentId?.startsWith('default_');
  const isDefaultMovie = isDefaultContent && !!book?.movie_id;
  const isDefaultBook = isDefaultContent && !!book?.book_id && !book?.movie_id;
  const isLibraryBook = book?.isLibrary === true;

  useEffect(() => {
    // Load characters based on content type
    if (isDefaultContent) {
      if (isDefaultMovie && book.movie_id) {
        loadDefaultMovieCharacters();
      } else if (isDefaultBook && book.book_id) {
        loadDefaultBookCharacters();
      }
    } else if (isLibraryBook && book?.book_id) {
      // Load library book characters
      loadLibraryBookCharacters();
    } else if (documentId) {
      // Try to load characters for uploaded book
      loadUploadedBookCharacters();
    }
  }, [book, documentId, isDefaultContent, isDefaultMovie, isDefaultBook, isLibraryBook]);

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
      // Filter out unwanted characters
      const filteredCharacters = response.characters.filter(
        char => !char.name.includes('Company of Dwarves') && 
               !char.name.includes('Meriadoc Brandybuck') && 
               !char.name.includes('Peregrin Took') &&
               !char.name.includes('Frank & Susan Heffley')
      );
      setCharacters(filteredCharacters);
    } catch (error) {
      console.error('Failed to load default book characters:', error);
    }
  };

  const loadDefaultMovieCharacters = async () => {
    try {
      const response = await getMovieCharacters(book.movie_id);
      // Filter out unwanted characters
      const filteredCharacters = response.characters.filter(
        char => !char.name.includes('Company of Dwarves') && 
               !char.name.includes('Meriadoc Brandybuck') && 
               !char.name.includes('Peregrin Took') &&
               !char.name.includes('Frank & Susan Heffley')
      );
      setCharacters(filteredCharacters);
    } catch (error) {
      console.error('Failed to load default movie characters:', error);
    }
  };

  const loadLibraryBookCharacters = async () => {
    try {
      console.log('📚 Loading library book characters for:', book.book_id);
      const bookIdentifier = `library_${book.book_id}`;
      const response = await fetch(`${API_BASE_URL}/books/${bookIdentifier}/characters`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Loaded library characters:', data.characters.length);
        setCharacters(data.characters);
      } else {
        console.log('❌ Characters not found for library book');
        // Characters not extracted yet - will show extract UI
        setCharacters([]);
      }
    } catch (error) {
      console.error('Failed to load library book characters:', error);
      setCharacters([]);
    }
  };

  const loadUploadedBookCharacters = async () => {
    try {
      console.log('📄 Loading uploaded book characters for:', documentId);
      const response = await fetch(`${API_BASE_URL}/books/${documentId}/characters`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Loaded uploaded book characters:', data.characters.length);
        setCharacters(data.characters);
      } else {
        console.log('❌ Characters not found for uploaded book');
        // Characters not extracted yet - will show extract UI
        setCharacters([]);
      }
    } catch (error) {
      console.error('Failed to load uploaded book characters:', error);
      setCharacters([]);
    }
  };

  const handleExtractCharacters = async () => {
    setExtracting(true);
    setStatusMessage('Checking document status...');
    setProgress(null);
    
    try {
      // Wait for document to be ready
      await pollDocumentStatus(documentId, (status) => {
        // Some backends may return progress as float or string; normalize
        const pct = typeof status.progress === 'number' ? status.progress : parseFloat(status.progress);
        setProgress(!isNaN(pct) ? Math.min(Math.max(pct, 0), 100) : null);
        setStatusMessage(`Processing: ${status.status}`);
      });
      
      setStatusMessage('Extracting characters...');
      setProgress(null);
      
      // Extract fewer characters to avoid timeout
      const result = await extractCharacters(documentId, 5);
      // Filter out unwanted characters
      const filteredCharacters = result.characters.filter(
        char => !char.name.includes('Company of Dwarves') && 
               !char.name.includes('Meriadoc Brandybuck') && 
               !char.name.includes('Peregrin Took') &&
               !char.name.includes('Frank & Susan Heffley')
      );
      setCharacters(filteredCharacters);
      setStatusMessage('');
    } catch (error) {
      console.error('Character extraction failed:', error);
      alert('Failed to extract characters: ' + error.message);
      setStatusMessage('');
    } finally {
      setExtracting(false);
      setProgress(null);
    }
  };

  const handleSelectCharacter = async (character) => {
    console.log('🎯 Selecting character:', character.name, character.character_id);
    console.log('📚 Document ID:', documentId);
    console.log('📖 Is default content:', isDefaultContent);
    console.log('🎬 Is default movie:', isDefaultMovie);
    console.log('📚 Is default book:', isDefaultBook);
    
    setSelectedCharacter(character);
    setMessages([]);
    setLoadingHistory(true);

    try {
      // Load previous chat history for ALL books (not just default)
      if (documentId) {
        console.log('🔍 Loading chat history from backend...');
        try {
          const historyData = await getChatHistory(documentId, character.character_id);
          console.log('📥 History data received:', historyData);
          
          if (historyData.conversation_history && historyData.conversation_history.length > 0) {
            // User has chatted with this character before - load history
            console.log('✅ Found previous history! Loading', historyData.conversation_history.length, 'messages');
            setMessages(historyData.conversation_history);
            setLoadingHistory(false);
            return; // Exit early, don't fetch greeting
          } else {
            console.log('📭 No previous history found');
          }
        } catch (historyError) {
          // If history fetch fails, continue to greeting
          console.log('❌ Error loading history:', historyError);
          console.log('➡️ Continuing to greeting...');
        }
      } else {
        console.log('⏭️ Skipping history load (no documentId)');
      }

      // First time chatting or not a default book - get greeting
      console.log('👋 Fetching greeting...');
      const result = await getCharacterGreeting(documentId, character.character_id);
      console.log('✉️ Greeting received:', result);
      setMessages([{
        role: 'assistant',
        content: result.greeting
      }]);
    } catch (error) {
      console.error('❌ Failed to get greeting:', error);
      // Fallback message if greeting fails
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm ${character.name}. ${character.description} What would you like to talk about?`
      }]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleClearChat = async () => {
    if (!selectedCharacter || !documentId) return;
    
    const confirmClear = window.confirm('Are you sure you want to clear this chat history? This cannot be undone.');
    if (!confirmClear) return;

    try {
      await clearChatHistory(documentId, selectedCharacter.character_id);
      setMessages([]);
      
      // Fetch greeting again after clearing
      const result = await getCharacterGreeting(documentId, selectedCharacter.character_id);
      setMessages([{
        role: 'assistant',
        content: result.greeting
      }]);
      
      alert('Chat history cleared successfully!');
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat history. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Store current messages before updating
    const currentMessages = [...messages];
    
    // Add user message
    const newMessages = [...currentMessages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    
    // Add empty assistant message that will be filled with streaming text
    const assistantMessageIndex = newMessages.length;
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    
    setChatLoading(true);

    try {
      // Use current messages for conversation history (before adding new user message)
      const conversationHistory = currentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Use streaming API with real-time updates
      const assistantResponse = await sendChatMessageStream(
        documentId,
        selectedCharacter.character_id,
        userMessage,
        conversationHistory,
        (chunk, fullText) => {
          // Update the assistant message with accumulated text
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[assistantMessageIndex] = {
              role: 'assistant',
              content: fullText
            };
            return updatedMessages;
          });
        }
      );
      
      // Save chat exchange to backend for ALL books
      if (documentId && assistantResponse) {
        try {
          const params = new URLSearchParams({
            document_id: documentId,
            character_id: selectedCharacter.character_id,
            character_name: selectedCharacter.name,
            user_message: userMessage,
            assistant_response: assistantResponse
          });
          await fetch(`${API_BASE_URL}/chat/session/save?${params}`, {
            method: 'POST'
          });
          console.log('💾 Chat message saved to backend');
        } catch (saveError) {
          console.error('Failed to save chat message:', saveError);
          // Don't block UI on save errors
        }
      }
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: 'Sorry, I had trouble responding. Please try again.'
        };
        return updatedMessages;
      });
    } finally {
      setChatLoading(false);
    }
  };

  // When there are no characters and content is not default, we're in extract mode
  const isExtractMode = (characters.length === 0 && !isDefaultContent);

  return (
    <div
      className={`chat-container ${selectedCharacter ? 'with-chat-bg' : (characters.length === 0 && !isDefaultContent ? 'with-characters-bg' : '')}`}
      style={{ '--book-color': book.color }}
    >
      <div className="chat-header" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="book-info">
          {book?.cover ? (
            <img src={book.cover} alt={book.title} className="header-cover" />
          ) : (
            <div className="header-cover header-cover-fallback">📚</div>
          )}

          <div className="book-meta">
            <h2 className="book-title">{book.title}</h2>
            <p className="book-subtitle">{book.author || (book.movie_id ? 'Movie' : 'Book')}</p>
          </div>
        </div>

        {/* Header actions removed: Change / Clear buttons hidden across chat and characters pages */}
      </div>

      {characters.length === 0 && !isDefaultContent ? (
        <div className="character-select-screen extract-mode">
          <div className="extract-card">
            <h3>Discover Characters</h3>
            <div className="extract-characters-container">
              <p>Extract characters from this book to start chatting</p>
              {extracting && (
                <div className="progress-wrapper">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress ?? 10}%` }} />
                  </div>
                  <div className="progress-info">
                    {progress != null ? `${progress}%` : 'Preparing...'}
                  </div>
                </div>
              )}
              {statusMessage && (
                <p className="status-text">{statusMessage}{progress != null ? ` (${progress}%)` : ''}</p>
              )}
              <button
                className="extract-characters-btn"
                onClick={handleExtractCharacters}
                disabled={!documentId || extracting}
              >
                {extracting ? 'Processing...' : 'Extract Characters'}
              </button>
            </div>
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
                {(() => {
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
                    'idaho': '/books_images/Dune/Du_Duncan Idaho.png',
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
                    'quincey': '/books_images/Dracula/Quincey Morris.png',
                    'morris': '/books_images/Dracula/Quincey Morris.png',
                    
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
                    
                    // Diary of a Wimpy Kid
                    'greg': '/books_images/Diary of a Wimpy Kid/DWK_Greg Heffley.png',
                    'rowley': '/books_images/Diary of a Wimpy Kid/DWK_Rowley Jefferson.png',
                    'rodrick': '/books_images/Diary of a Wimpy Kid/DWK_Rodrick Heffley.png',
                    'frank': '/books_images/Diary of a Wimpy Kid/DWK_Frank & Susan Heffley.png',
                    'manny': '/books_images/Diary of a Wimpy Kid/Manny Heffley.png',
                    
                    // Hunger Games
                    'katniss': '/books_images/Hunger games/Katniss Everdeen.png',
                    'everdeen': '/books_images/Hunger games/Katniss Everdeen.png',
                    'peeta': '/books_images/Hunger games/Peeta Mellark.png',
                    'mellark': '/books_images/Hunger games/Peeta Mellark.png',
                    'gale': '/books_images/Hunger games/Gale Hawthorne.png',
                    'hawthorne': '/books_images/Hunger games/Gale Hawthorne.png',
                    'haymitch': '/books_images/Hunger games/Haymitch Abernathy.png',
                    'abernathy': '/books_images/Hunger games/Haymitch Abernathy.png',
                    'primrose': '/books_images/Hunger games/Primrose Everdeen.png',
                    'prim': '/books_images/Hunger games/Primrose Everdeen.png',
                    'effie': '/books_images/Hunger games/effie trinket.png',
                    'trinket': '/books_images/Hunger games/effie trinket.png',
                    'snow': '/books_images/Hunger games/President Snow.png',
                    'capitol': '/books_images/Hunger games/Capitol Government (Generic Capitol Enforcer).png',
                    'enforcer': '/books_images/Hunger games/Capitol Government (Generic Capitol Enforcer).png',
                    
                    // Lord of the Rings
                    'frodo': '/books_images/LOTR/Frodo Baggins.jpg',
                    'aragorn': '/books_images/LOTR/Aragorn.jpg',
                    'gandalf': '/books_images/LOTR/Gandalf.png',
                    'samwise': '/books_images/LOTR/Samwise Gamgee.jpg',
                    'sam': '/books_images/LOTR/Samwise Gamgee.jpg',
                    'legolas': '/books_images/LOTR/Legolas.jpg',
                    'gimli': '/books_images/LOTR/Gimli.jpg',
                    'boromir': '/books_images/LOTR/Boromir.png',
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
                    
                    // Frankenstein
                    'victor': '/books_images/Frankenstein/Victor Frankenstein.png',
                    'frankenstein': '/books_images/Frankenstein/Victor Frankenstein.png',
                    'creature': '/books_images/Frankenstein/The Creature.png',
                    'monster': '/books_images/Frankenstein/The Creature.png',
                    
                    // Movie: Inception
                    'cobb': '/Movie/Inception/INS_Cobb.png',
                    'ariadne': '/Movie/Inception/INS_Ariadne.png',
                    'eames': '/Movie/Inception/INS_Eames.png',
                    
                    // Movie: The Godfather
                    'don': '/Movie/The Godfather/GOD_Don.png',
                    'vito': '/Movie/The Godfather/GOD_Don.png',
                    'corleone': '/Movie/The Godfather/GOD_Don.png',
                    'michael': '/Movie/The Godfather/GOD_Consigliere.png',
                    'consigliere': '/Movie/The Godfather/GOD_Consigliere.png',
                    'santino': '/Movie/The Godfather/GOD_Enforcer.png',
                    'sonny': '/Movie/The Godfather/GOD_Enforcer.png',
                    'enforcer': '/Movie/The Godfather/GOD_Enforcer.png',
                    
                    // Movie: Scooby-Doo
                    'scooby': '/Movie/Scooby-Doo/SD_Scooby.png',
                    'scooby-doo': '/Movie/Scooby-Doo/SD_Scooby.png',
                    'shaggy': '/Movie/Scooby-Doo/SD_Shaggy.png',
                    'norville': '/Movie/Scooby-Doo/SD_Shaggy.png',
                    'rogers': '/Movie/Scooby-Doo/SD_Shaggy.png',
                    'velma': '/Movie/Scooby-Doo/SD_Velma.png',
                    'dinkley': '/Movie/Scooby-Doo/SD_Velma.png',
                    'fred': '/Movie/Scooby-Doo/SD_Fred.png',
                    'jones': '/Movie/Scooby-Doo/SD_Fred.png',
                    'daphne': '/Movie/Scooby-Doo/SD_Daphne.png',
                    'blake': '/Movie/Scooby-Doo/SD_Daphne.png',
                    
                    // Movie: Pirates of the Caribbean
                    'jack': '/Movie/Pirates of the Caribbean/POC_Captain Jack Sparrow.png',
                    'sparrow': '/Movie/Pirates of the Caribbean/POC_Captain Jack Sparrow.png',
                    'elizabeth': '/Movie/Pirates of the Caribbean/POC_Elizabeth Swann.png',
                    'swann': '/Movie/Pirates of the Caribbean/POC_Elizabeth Swann.png',
                    'will': '/Movie/Pirates of the Caribbean/POC_William Will Turner.png',
                    'turner': '/Movie/Pirates of the Caribbean/POC_William Will Turner.png',
                    'william': '/Movie/Pirates of the Caribbean/POC_William Will Turner.png',
                    'barbossa': '/Movie/Pirates of the Caribbean/POC_Captain Hector Barbossa.png',
                    'hector': '/Movie/Pirates of the Caribbean/POC_Captain Hector Barbossa.png',
                    
                    // Movie: Charlie and the Chocolate Factory
                    'charlie': '/Movie/Charlie and the Chocolate Factor/CCF_Charlie Bucket.png',
                    'bucket': '/Movie/Charlie and the Chocolate Factor/CCF_Charlie Bucket.png',
                    'willy': '/Movie/Charlie and the Chocolate Factor/CCF_Willy Wonka.png',
                    'wonka': '/Movie/Charlie and the Chocolate Factor/CCF_Willy Wonka.png',
                    'augustus': '/Movie/Charlie and the Chocolate Factor/CCF_Augustus Gloop.png',
                    'gloop': '/Movie/Charlie and the Chocolate Factor/CCF_Augustus Gloop.png',
                    'veruca': '/Movie/Charlie and the Chocolate Factor/CCF_Veruca Salt.png',
                    'salt': '/Movie/Charlie and the Chocolate Factor/CCF_Veruca Salt.png',
                    'violet': '/Movie/Charlie and the Chocolate Factor/CCF_Violet Beauregarde.png',
                    'beauregarde': '/Movie/Charlie and the Chocolate Factor/CCF_Violet Beauregarde.png',
                    'mike': '/Movie/Charlie and the Chocolate Factor/CCF_Mike Teavee.png',
                    'teavee': '/Movie/Charlie and the Chocolate Factor/CCF_Mike Teavee.png',
                    'grandpa': '/Movie/Charlie and the Chocolate Factor/CCF_Grandpa Joe.png',
                    'joe': '/Movie/Charlie and the Chocolate Factor/CCF_Grandpa Joe.png',
                  };
                  
                  // Smart matching function with debug logging
                  const findImage = (name) => {
                    const normalized = name.toLowerCase().trim();
                    console.log('Chat - Looking for:', name, '→', normalized);
                    
                    if (characterImages[normalized]) {
                      console.log('✓ Direct match:', characterImages[normalized]);
                      return characterImages[normalized];
                    }
                    
                    const firstName = normalized.split(' ')[0];
                    if (characterImages[firstName]) {
                      console.log('✓ First name match:', firstName, '→', characterImages[firstName]);
                      return characterImages[firstName];
                    }
                    
                    const nameParts = normalized.split(' ');
                    for (const part of nameParts) {
                      if (characterImages[part]) {
                        console.log('✓ Word match:', part, '→', characterImages[part]);
                        return characterImages[part];
                      }
                    }
                    
                    console.log('✗ No match found');
                    return null;
                  };
                  
                  const characterImage = findImage(selectedCharacter.name);
                  return characterImage ? (
                    <img src={characterImage} alt={selectedCharacter.name} className="character-image-large" />
                  ) : (
                    selectedCharacter.name.charAt(0)
                  );
                })()}
              </div>
              <h3>{selectedCharacter.name}</h3>
              <p className="character-desc">
                {selectedCharacter.description ? selectedCharacter.description.replace(/☁️|☁/g, '').trim() : ''}
              </p>
            </div>
            <button 
              className="change-character-btn"
              onClick={() => setSelectedCharacter(null)}
            >
              Change Character
            </button>
            {documentId && (
              <button 
                className="clear-chat-btn"
                onClick={handleClearChat}
                title="Clear conversation history"
              >
                🗑️ Clear Chat
              </button>
            )}
          </div>

          <div className="chat-main">
            {loadingHistory ? (
              <div className="loading-history">
                <p>Loading chat history...</p>
              </div>
            ) : (
              <>
                <div className="messages-container">
                  {messages.map((msg, idx) => (
                    <ChatMessage 
                      key={idx}
                      message={msg}
                      characterName={selectedCharacter.name}
                      bookColor={book.color}
                      isTyping={chatLoading && idx === messages.length - 1 && msg.role === 'assistant' && !msg.content}
                    />
                  ))}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
