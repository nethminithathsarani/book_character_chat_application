import { useState, useEffect, useRef } from "react";
import CharacterCard from "../components/CharacterCard";
import {
  getBookCharacters,
  getMovieCharacters,
  startMultiCharacterDebate,
} from "../services/api";
import "../styles/MultiCharacterDebate.css";

function MultiCharacterDebate({ book, documentId, onBack }) {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [debateTopic, setDebateTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDebating, setIsDebating] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const messagesEndRef = useRef(null);

  const isDefaultContent =
    book?.is_default === true || documentId?.startsWith("default_");
  const isDefaultMovie = isDefaultContent && !!book?.movie_id;
  const isDefaultBook = isDefaultContent && !!book?.book_id && !book?.movie_id;

  useEffect(() => {
    loadCharacters();
  }, [book, documentId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const loadCharacters = async () => {
    setLoadingCharacters(true);
    try {
      let response;
      if (isDefaultMovie && book.movie_id) {
        response = await getMovieCharacters(book.movie_id);
      } else if (isDefaultBook && book.book_id) {
        response = await getBookCharacters(book.book_id);
      }

      if (response?.characters) {
        setCharacters(response.characters);
      }
    } catch (error) {
      console.error("Failed to load characters:", error);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const toggleCharacterSelection = (character) => {
    setSelectedCharacters((prev) => {
      const isSelected = prev.some(
        (c) => c.character_id === character.character_id
      );
      if (isSelected) {
        return prev.filter((c) => c.character_id !== character.character_id);
      } else if (prev.length < 5) {
        return [...prev, character];
      }
      return prev;
    });
  };

  const startDebate = async () => {
    if (selectedCharacters.length < 2 || !debateTopic.trim()) {
      return;
    }

    setDebateStarted(true);
    setIsDebating(true);
    setMessages([]);

    try {
      const response = await startMultiCharacterDebate(
        documentId,
        selectedCharacters.map((c) => c.character_id),
        debateTopic,
        5 // number of rounds
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setIsDebating(false);
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.character_name && parsed.message) {
                setMessages((prev) => [
                  ...prev,
                  {
                    character_id: parsed.character_id,
                    character_name: parsed.character_name,
                    content: parsed.message,
                    round: parsed.round,
                  },
                ]);
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Debate failed:", error);
      setIsDebating(false);
    }
  };

  const resetDebate = () => {
    setDebateStarted(false);
    setMessages([]);
    setDebateTopic("");
  };

  const getCharacterColor = (characterId) => {
    const colors = [
      "#D4AF37", // Gold
      "#8B4789", // Burgundy
      "#4A7C7E", // Teal
      "#B8860B", // Dark goldenrod
      "#6B4423", // Brown
    ];
    const index = selectedCharacters.findIndex(
      (c) => c.character_id === characterId
    );
    return colors[index % colors.length];
  };

  return (
    <div className={`debate-container ${debateStarted ? "debate-active" : ""}`}>
      <div className="debate-header">
        <button onClick={onBack} className="back-button">
          ← Back to Chat
        </button>
        <div className="debate-title">
          <h1>Multi-Character Debate</h1>
          <p>Select 2-5 characters and watch them discuss a topic</p>
        </div>
      </div>

      {!debateStarted ? (
        <div className="debate-setup">
          <div className="setup-section">
            <h2>Select Characters ({selectedCharacters.length}/5)</h2>
            <p className="helper-text">
              Choose at least 2 characters to start a debate
            </p>

            {loadingCharacters ? (
              <div className="loading-state">Loading characters...</div>
            ) : (
              <div className="character-grid">
                {characters.map((character) => (
                  <div
                    key={character.character_id}
                    onClick={() => toggleCharacterSelection(character)}
                    className={`character-select-card ${
                      selectedCharacters.some(
                        (c) => c.character_id === character.character_id
                      )
                        ? "selected"
                        : ""
                    }`}
                  >
                    <div
                      className="character-avatar"
                      style={{
                        background: selectedCharacters.some(
                          (c) => c.character_id === character.character_id
                        )
                          ? getCharacterColor(character.character_id)
                          : "#C9A9A6",
                      }}
                    >
                      {character.name.charAt(0)}
                    </div>
                    <div className="character-info">
                      <h3>{character.name}</h3>
                      <p>
                        {character.role || character.description?.slice(0, 60)}
                        ...
                      </p>
                    </div>
                    {selectedCharacters.some(
                      (c) => c.character_id === character.character_id
                    ) && <div className="selected-badge">✓</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="setup-section">
            <h2>Debate Topic</h2>
            <textarea
              className="topic-input"
              placeholder="What should these characters discuss? (e.g., 'What is the meaning of courage?', 'Should power be used for personal gain?', 'What makes a true hero?')"
              value={debateTopic}
              onChange={(e) => setDebateTopic(e.target.value)}
              rows={4}
            />
          </div>

          <button
            className="start-debate-button"
            onClick={startDebate}
            disabled={selectedCharacters.length < 2 || !debateTopic.trim()}
          >
            {selectedCharacters.length < 2
              ? "Select at least 2 characters"
              : !debateTopic.trim()
              ? "Enter a debate topic"
              : `Start Debate with ${selectedCharacters.length} Characters`}
          </button>
        </div>
      ) : (
        <div className="debate-stage">
          <div className="debate-info">
            <h2>{debateTopic}</h2>
            <div className="debate-participants">
              {selectedCharacters.map((char) => (
                <div
                  key={char.character_id}
                  className="participant-badge"
                  style={{
                    background: getCharacterColor(char.character_id),
                  }}
                >
                  {char.name}
                </div>
              ))}
            </div>
          </div>

          <div className="debate-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="debate-message">
                <div className="message-header">
                  <div
                    className="character-badge"
                    style={{
                      background: getCharacterColor(msg.character_id),
                    }}
                  >
                    {msg.character_name.charAt(0)}
                  </div>
                  <div className="message-meta">
                    <span className="character-name">{msg.character_name}</span>
                    {msg.round && (
                      <span className="round-badge">Round {msg.round}</span>
                    )}
                  </div>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isDebating && (
              <div className="debate-message typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="debate-controls">
            <button
              onClick={resetDebate}
              className="reset-button"
              disabled={isDebating}
            >
              Start New Debate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiCharacterDebate;
