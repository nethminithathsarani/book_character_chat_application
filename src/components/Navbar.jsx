import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">📖 StoryChat</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/library">Library</Link></li>
        <li><Link to="/chat/sherlock">Chat</Link></li>
      </ul>
    </nav>
  );
}
