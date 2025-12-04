import { useState, useEffect } from "react";
import FrontPage from "./pages/FrontPage";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import BookLibrary from "./pages/BookLibrary";

function App() {
  const [currentPage, setCurrentPage] = useState("frontpage");
  const [selectedBook, setSelectedBook] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [preselectedCharacterId, setPreselectedCharacterId] = useState(null);

  const handleBookSelect = (book, docId, characterId = null) => {
    setSelectedBook(book);
    setDocumentId(docId);
    setPreselectedCharacterId(characterId);
    setCurrentPage("chat");
  };

  // Ensure navigation starts at top of the page
  useEffect(() => {
    // Scroll to top whenever page changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" in window ? "instant" : "auto",
    });
  }, [currentPage]);

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedBook(null);
    setDocumentId(null);
    setPreselectedCharacterId(null);
  };

  const handleGoToLibrary = () => {
    setCurrentPage("library");
  };

  const handleGoToAllBooks = () => {
    setCurrentPage("allbooks");
  };

  const handleGoToHome = () => {
    setCurrentPage("home");
  };

  const handleGoToDebate = () => {
    setCurrentPage("debate");
  };

  return (
    <div className="app">
      {currentPage === "frontpage" && <FrontPage onGoToHome={handleGoToHome} />}
      {currentPage === "home" && (
        <Home
          onBookSelect={handleBookSelect}
          onGoToLibrary={handleGoToLibrary}
          onGoToAllBooks={handleGoToAllBooks}
        />
      )}
      {currentPage === "library" && (
        <BookLibrary
          onBookSelect={handleBookSelect}
          onBack={handleBackToHome}
          showOnlyLibrary={true}
        />
      )}
      {currentPage === "allbooks" && (
        <BookLibrary
          onBookSelect={handleBookSelect}
          onBack={handleBackToHome}
          showOnlyLibrary={false}
        />
      )}
      {currentPage === "chat" && (
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
