/*import { useState } from 'react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import BookLibrary from './pages/BookLibrary';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [preselectedCharacterId, setPreselectedCharacterId] = useState(null);

  const handleBookSelect = (book, docId, characterId = null) => {
    setSelectedBook(book);
    setDocumentId(docId);
    setPreselectedCharacterId(characterId);
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedBook(null);
    setDocumentId(null);
    setPreselectedCharacterId(null);
  };

  const handleGoToLibrary = () => {
    setCurrentPage('library');
  };

  return (
    <div className="app">
      {currentPage === 'home' && (
        <Home 
          onBookSelect={handleBookSelect}
          onGoToLibrary={handleGoToLibrary}
        />
      )}
      {currentPage === 'library' && (
        <BookLibrary 
          onBookSelect={handleBookSelect}
          onBack={handleBackToHome}
        />
      )}
      {currentPage === 'chat' && (
        <Chat 
          book={selectedBook} 
          documentId={documentId}
          preselectedCharacterId={preselectedCharacterId}
          onBack={handleBackToHome} 
        />
      )}
    </div>
  );
}

*/
// src/App.jsx
import { useState } from 'react';
import FrontPage from './pages/FontPage'; // Import the existing `FontPage.jsx` file
import Home from './pages/Home';
import Chat from './pages/Chat';
import BookLibrary from './pages/BookLibrary';

function App() {
  const [currentPage, setCurrentPage] = useState('frontpage'); // Start with FrontPage
  const [selectedBook, setSelectedBook] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [preselectedCharacterId, setPreselectedCharacterId] = useState(null);

  const handleBookSelect = (book, docId, characterId = null) => {
    setSelectedBook(book);
    setDocumentId(docId);
    setPreselectedCharacterId(characterId);
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home'); // Go back to Home (book selection)
    setSelectedBook(null);
    setDocumentId(null);
    setPreselectedCharacterId(null);
  };

  const handleGoToLibrary = () => {
    setCurrentPage('library');
  };

  const handleGoToHomeFromFront = () => {
    setCurrentPage('home'); // Navigate from FrontPage to Home on "Explore Books" click
  };

  return (
    <div className="app">
      {currentPage === 'frontpage' && (
        <FrontPage 
          onGoToHome={handleGoToHomeFromFront} // New prop for navigation to Home
        />
      )}
      {currentPage === 'home' && (
        <Home 
          onBookSelect={handleBookSelect}
          onGoToLibrary={handleGoToLibrary}
        />
      )}
      {currentPage === 'library' && (
        <BookLibrary 
          onBookSelect={handleBookSelect}
          onBack={handleBackToHome}
        />
      )}
      {currentPage === 'chat' && (
        <Chat 
          book={selectedBook} 
          documentId={documentId}
          preselectedCharacterId={preselectedCharacterId}
          onBack={handleBackToHome} 
        />
      )}
    </div>
  );
}

export default App;