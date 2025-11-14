/*import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/library.css";
import sherlockCover from "../assets/book-covers/sherlock.jpg";
import anneCover from "../assets/book-covers/anne.jpg";
import gandalfCover from "../assets/book-covers/gandalf.jpg";
import odysseusCover from "../assets/book-covers/odysseus.jpg";
import Navbar from "../components/Navbar";



const books = [
  {
    id: "sherlock",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    characters: 1,
    date: "Oct 15, 2024",
    cover: sherlockCover,
  },
  {
    id: "anne",
    title: "Anne of Green Gables",
    author: "L.M. Montgomery",
    characters: 1,
    date: "Oct 20, 2024",
    cover: anneCover,
  },
  {
    id: "gandalf",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    characters: 1,
    date: "Oct 25, 2024",
    cover: gandalfCover,
  },
  {
    id: "odysseus",
    title: "The Odyssey",
    author: "Homer",
    characters: 1,
    date: "Oct 30, 2024",
    cover: odysseusCover,
  },
];


export default function LibraryPage() {
  const navigate = useNavigate();

  return (
    <div className="library">
      <h1>Your Library</h1>
      <p className="muted">3 books</p>

      <div className="book-list">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.cover} alt={`${book.title} cover`} className="book-cover" />

            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Characters:</strong> {book.characters}</p>
            <p><strong>Date:</strong> {book.date}</p>
            <button
              className="btn primary"
              onClick={() => navigate(`/chat/${book.id}`)}
            >
              View Characters →
            </button>
          </div>
        ))}
      </div>

      <div className="library-actions">
        <div>
          <h3>📤 Upload Story</h3>
          <p>Upload any storybook in PDF or TXT format</p>
        </div>
        <div>
          <h3>🧙 Meet Characters</h3>
          <p>AI automatically detects and profiles characters</p>
        </div>
        <div>
          <h3>💬 Start Chatting</h3>
          <p>Have magical conversations with your favorite characters</p>
        </div>
      </div>
    </div>
  );
}
*/


import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/library.css";
import sherlockCover from "../assets/book-covers/sherlock.jpg";
import anneCover from "../assets/book-covers/anne.jpg";
import gandalfCover from "../assets/book-covers/gandalf.jpg";
import odysseusCover from "../assets/book-covers/odysseus.jpg";
import Navbar from "../components/Navbar";

const books = [
  {
    id: "sherlock",
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    characters: 1,
    date: "Oct 15, 2024",
    cover: sherlockCover,
  },
  {
    id: "anne",
    title: "Anne of Green Gables",
    author: "L.M. Montgomery",
    characters: 1,
    date: "Oct 20, 2024",
    cover: anneCover,
  },
  {
    id: "gandalf",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    characters: 1,
    date: "Oct 25, 2024",
    cover: gandalfCover,
  },
  {
    id: "odysseus",
    title: "The Odyssey",
    author: "Homer",
    characters: 1,
    date: "Oct 30, 2024",
    cover: odysseusCover,
  },
];

export default function LibraryPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="library">
        <h1>Your Library</h1>
        <p className="muted">3 books</p>

        <div className="book-list">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.cover} alt={`${book.title} cover`} className="book-cover" />
              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Characters:</strong> {book.characters}</p>
              <p><strong>Date:</strong> {book.date}</p>
              <button
                className="btn primary"
                onClick={() => navigate(`/chat/${book.id}`)}
              >
                View Characters →
              </button>
            </div>
          ))}
        </div>

        <div className="library-actions">
          <div>
            <h3>📤 Upload Story</h3>
            <p>Upload any storybook in PDF or TXT format</p>
          </div>
          <div>
            <h3>🧙 Meet Characters</h3>
            <p>AI automatically detects and profiles characters</p>
          </div>
          <div>
            <h3>💬 Start Chatting</h3>
            <p>Have magical conversations with your favorite characters</p>
          </div>
        </div>
      </div>
    </>
  );
}
