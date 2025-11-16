import { useState } from 'react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import BookLibrary from './pages/BookLibrary';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const handleBookSelect = (book, docId) => {
    setSelectedBook(book);
    setDocumentId(docId);
    setCurrentPage('chat');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedBook(null);
    setDocumentId(null);
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
          onBack={handleBackToHome} 
        />
      )}
    </div>
  );
}

export default App;
