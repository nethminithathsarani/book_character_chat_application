import { useState } from 'react';
import { uploadBook } from '../services/api';
import '../styles/UploadSection.css';

function UploadSection({ onBookSelect }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setUploadError('Please upload a PDF file');
      return;
    }

    // Show save prompt
    setPendingFile(file);
    setShowSavePrompt(true);
    setUploadError(null);
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };

  const handleUpload = async (saveToLibrary) => {
    console.log('handleUpload called with saveToLibrary:', saveToLibrary);
    console.log('pendingFile:', pendingFile);
    
    if (!pendingFile) {
      console.error('No pending file!');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      console.log('Calling uploadBook with saveToLibrary:', saveToLibrary);
      const bookTitle = pendingFile.name.replace('.pdf', '');
      const result = await uploadBook(pendingFile, saveToLibrary, bookTitle);
      console.log('Upload result:', result);
      
      onBookSelect({
        id: result.document_id,
        title: result.filename.replace('.pdf', ''),
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        color: '#EC4899'
      }, result.document_id);
      
      // Reset state
      setShowSavePrompt(false);
      setPendingFile(null);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    setShowSavePrompt(false);
    setPendingFile(null);
    setUploadError(null);
  };

  return (
    <div className="upload-section">
      <div className="upload-card">
        <div className="upload-icon">✨</div>
        <h2>Upload Your Own Book</h2>
        <p>Share your story and chat with characters</p>
        
        {!showSavePrompt ? (
          <>
            <label className="upload-button">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              {uploading ? (
                <span className="loading">Uploading...</span>
              ) : (
                <>
                  <span className="upload-text">Choose PDF File</span>
                  <span className="upload-icon-small">📄</span>
                </>
              )}
            </label>
            
            {uploadError && (
              <div className="error-message">{uploadError}</div>
            )}
          </>
        ) : (
          <div className="save-prompt">
            <h3>Save to Library?</h3>
            <p className="prompt-text">
              Would you like to save "<strong>{pendingFile?.name.replace('.pdf', '')}</strong>" to your library?
              <br />
              <small>You can access saved books anytime without re-uploading.</small>
            </p>
            <div className="prompt-actions">
              <button 
                className="save-yes-btn" 
                onClick={() => handleUpload(true)}
                disabled={uploading}
              >
                📚 Yes, Save to Library
              </button>
              <button 
                className="save-no-btn" 
                onClick={() => handleUpload(false)}
                disabled={uploading}
              >
                💬 Just Chat This Time
              </button>
              <button 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadSection;
