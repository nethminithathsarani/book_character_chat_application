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
