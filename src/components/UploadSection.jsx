import { useState } from 'react';
import { uploadBook } from '../services/api';
import '../styles/UploadSection.css';

function UploadSection({ onBookSelect }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setUploadError('Please upload a PDF file');
      return;
    }

    // Upload immediately without showing save prompt
    handleUpload(file);
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };

  const handleUpload = async (file) => {
    console.log('handleUpload called');
    
    setUploading(true);
    setUploadError(null);

    try {
      const bookTitle = file.name.replace('.pdf', '');
      const result = await uploadBook(file, false, bookTitle); // Don't save to library yet
      console.log('Upload result:', result);
      
      // Pass to parent with flag indicating save decision is pending
      onBookSelect({
        id: result.document_id,
        title: result.filename.replace('.pdf', ''),
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        color: '#EC4899',
        needsSavePrompt: true // Flag to show save prompt after extraction
      }, result.document_id);
      
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-card">
        <div className="upload-icon">✨</div>
        <h2>Upload Your Own Book</h2>
        <p>Share your story and chat with characters</p>
        
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
      </div>
    </div>
  );
}

export default UploadSection;
