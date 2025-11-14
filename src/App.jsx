/*import React, { useState } from "react";
import AppLayout from "./components/AppLayout.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatHeader from "./components/ChatHeader.jsx";
import MessageList from "./components/MessageList.jsx";
import MessageComposer from "./components/MessageComposer.jsx";
import { CHARACTERS } from "./data/characters.js";
import { INITIAL_MESSAGES } from "./data/mockMessages.js";
import "./styles/chat.css";

export default function App() {
  const [selectedId, setSelectedId] = useState(CHARACTERS[0].id);
  const selectedCharacter = CHARACTERS.find(c => c.id === selectedId);
  const [threads, setThreads] = useState(INITIAL_MESSAGES);

  const messages = threads[selectedId] ?? [];

  function handleSend(text) {
    if (!text.trim()) return;

    const newMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setThreads(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));

    // Mock character reply
    setTimeout(() => {
      const reply = {
        id: crypto.randomUUID(),
        sender: "character",
        text: selectedCharacter.replyTemplate(text),
        timestamp: new Date().toISOString(),
      };
      setThreads(prev => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), reply],
      }));
    }, 600);
  }

  return (
    <AppLayout
      sidebar={
        <Sidebar
          characters={CHARACTERS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      }
      content={
        <>
          <ChatHeader character={selectedCharacter} />
          <MessageList messages={messages} character={selectedCharacter} />
          <MessageComposer onSend={handleSend} />
        </>
      }
    />
  );
}
*/



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/chat/:bookId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}
