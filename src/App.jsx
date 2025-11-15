import React, { useState, useEffect, Suspense } from 'react';
const UploadStorybook = React.lazy(() => import('./components/UploadStorybook'));
const StorySummary = React.lazy(() => import('./components/StorySummary'));
const CharacterDetails = React.lazy(() => import('./components/CharacterDetails'));
const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
import BookLibrary from './components/BookLibrary';

// Sample books library
const initialBooks = [
  {
    id: '1',
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    fileName: 'harry_potter_1.pdf',
    uploadDate: new Date('2024-10-15'),
    coverImage: 'https://images.unsplash.com/photo-1625675337903-ee71413606a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJyeSUyMHBvdHRlciUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NjI0NDEwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    characterCount: 6,
  },
  {
    id: '2',
    title: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
    fileName: 'narnia.pdf',
    uploadDate: new Date('2024-10-20'),
    coverImage: 'https://images.unsplash.com/photo-1711185892188-13f35959d3ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwc3Rvcnlib29rfGVufDF8fHx8MTc2MjQ0MTAxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    characterCount: 8,
  },
  {
    id: '3',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    fileName: 'the_hobbit.pdf',
    uploadDate: new Date('2024-10-25'),
    coverImage: 'https://images.unsplash.com/photo-1706932527793-aba6d47814af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpYyUyMGJvb2slMjBzcGVsbHxlbnwxfHx8fDE3NjI0NDEwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    characterCount: 7,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('upload');
  const [storyData, setStoryData] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [uploadedBooks, setUploadedBooks] = useState(initialBooks);
  const [previousScreen, setPreviousScreen] = useState('summary'); // Track where user came from before chat

  const handleStoryUploaded = (data) => {
    // Add the new book to the library
    const newBook = {
      id: Date.now().toString(),
      title: data.title,
      author: data.author,
      fileName: data.fileName,
      uploadDate: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1625675337903-ee71413606a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJyeSUyMHBvdHRlciUyMGJvb2slMjBjb3ZlcnxlbnwxfHx8fDE3NjI0NDEwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      characterCount: 6,
    };
    setUploadedBooks((prev) => [newBook, ...prev]);

    setStoryData(data);
    setCurrentScreen('summary');
  };

  const handleBookSelect = (book) => {
    setStoryData({
      title: book.title,
      author: book.author,
      fileName: book.fileName,
    });
    setCurrentScreen('summary');
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setCurrentScreen('character-details');
  };

  const handleDirectChat = (character) => {
    setSelectedCharacter(character);
    setPreviousScreen('summary');
    setCurrentScreen('chat');
  };

  const handleStartChat = () => {
    setPreviousScreen('character-details');
    setCurrentScreen('chat');
  };

  const handleBackToSummary = () => {
    setSelectedCharacter(null);
    setCurrentScreen('summary');
  };

  const handleBackToCharacterDetails = () => {
    setCurrentScreen('character-details');
  };

  const handleBackToSummaryFromChat = () => {
    setCurrentScreen(previousScreen);
  };

  const handleBackToUpload = () => {
    setStoryData(null);
    setSelectedCharacter(null);
    setCurrentScreen('upload');
  };

  return (
    <Suspense fallback={<div />}> 
      <div className="min-h-screen">
        {currentScreen === 'upload' && (
          <UploadStorybook 
            onStoryUploaded={handleStoryUploaded}
            uploadedBooks={uploadedBooks}
            onBookSelect={handleBookSelect}
          />
        )}
        
        {currentScreen === 'summary' && storyData && (
          <StorySummary 
            storyData={storyData} 
            onCharacterSelect={handleCharacterSelect}
            onDirectChat={handleDirectChat}
            onBack={handleBackToUpload}
          />
        )}
        
        {currentScreen === 'character-details' && selectedCharacter && (
          <CharacterDetails
            character={selectedCharacter}
            onStartChat={handleStartChat}
            onBack={handleBackToSummary}
          />
        )}
        
        {currentScreen === 'chat' && selectedCharacter && (
          <ChatInterface
            character={selectedCharacter}
            onBack={handleBackToCharacterDetails}
            onBackToSummary={handleBackToSummaryFromChat}
          />
        )}
      </div>
    </Suspense>
  );
}
