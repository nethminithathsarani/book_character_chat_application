// src/pages/LandingPage.jsx
/*import React from "react";
import "../styles/landing.css";


export default function LandingPage() {
  return (
    <div className="landing">
      <div className="header">
        <span className="icon">✨</span>
        <h1>Chat with Storybook Characters</h1>
        <p>Upload your favorite storybook and bring its characters to life through magical conversation</p>
      </div>

      <div className="upload-box">
        <div className="drop-area">
          <p>📄 Drop your storybook here<br />or click to browse files</p>
          <small>Supports PDF and TXT files</small>
        </div>
        <button className="upload-btn">Upload File</button>
      </div>
    </div>
  );
}
*/


/*


import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>✨ Chat with Storybook Characters</h1>
      <p>
        Upload your favorite storybook and bring its characters to life through magical conversation
      </p>

      <div className="upload-box">
        <p>📄 Drop your storybook here<br />or click to browse files</p>
        <small>Supports PDF and TXT files</small>
        <button className="upload-btn" onClick={() => navigate("/library")}>
          Upload File
        </button>
      </div>
    </div>
  );
}
 */




/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import Navbar from "../components/Navbar";


export default function LandingPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setFileName(file.name);
      // TODO: upload logic here
      setTimeout(() => navigate("/library"), 1000); // simulate upload
    } else {
      alert("Only PDF and TXT files are supported.");
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      className={`landing ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <h1>✨ Chat with Storybook Characters</h1>
      <p>
        Upload your favorite storybook and bring its characters to life through magical conversation
      </p>

      <div className="upload-box">
        <label htmlFor="file-upload" className="drop-area">
          📄 Drop your storybook here<br />
          or click to browse files
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,.txt"
          onChange={handleBrowse}
          style={{ display: "none" }}
        />
        <small>Supports PDF and TXT files</small>
        <button
          className="upload-btn"
          onClick={() => document.getElementById("file-upload").click()}
        >
          Upload File
        </button>
        {fileName && <p className="file-preview">✅ Selected: {fileName}</p>}
      </div>
    </div>
  );
}
*/


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type === "application/pdf" || file.type === "text/plain") {
      setFileName(file.name);
      setTimeout(() => navigate("/library"), 1000); // simulate upload
    } else {
      alert("Only PDF and TXT files are supported.");
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <>
      <Navbar />
      <div
        className={`landing ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <h1>✨ Chat with Storybook Characters</h1>
        <p>
          Upload your favorite storybook and bring its characters to life through magical conversation
        </p>

        <div className="upload-box">
          <label htmlFor="file-upload" className="drop-area">
            📄 Drop your storybook here<br />
            or click to browse files
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.txt"
            onChange={handleBrowse}
            style={{ display: "none" }}
          />
          <small>Supports PDF and TXT files</small>
          <button
            className="upload-btn"
            onClick={() => document.getElementById("file-upload").click()}
          >
            Upload File
          </button>
          {fileName && <p className="file-preview">✅ Selected: {fileName}</p>}
        </div>
      </div>
    </>
  );
}
