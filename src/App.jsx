
// src/App.jsx
import { useState } from 'react';
import FrontPage from './pages/FontPage';
import Home from './pages/Home';
import Chat from './pages/Chat';
import BookLibrary from './pages/BookLibrary';

function App() {
  const [currentPage, setCurrentPage] = useState('frontpage');
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

  const handleGoToHomeFromFront = () => {
    setCurrentPage('home');
  };

  return (
    <div className="app">
      {currentPage === 'frontpage' && (
        <FrontPage
          onGoToHome={handleGoToHomeFromFront}
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