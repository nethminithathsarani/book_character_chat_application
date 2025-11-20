import { useState } from 'react';
import { uploadBook } from '../services/api';
import '../styles/UploadSection.css';

function UploadSection({ onBookSelect }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      setUploadError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const result = await uploadBook(file);
      
      onBookSelect({
        id: result.document_id,
        title: result.filename.replace('.pdf', ''),
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        color: '#EC4899'
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
        <div className="left">
          <div className="upload-icon">⬆️</div>
          <h2>Upload Your Own Book</h2>
          <p>Choose PDF File and share your story</p>

          <label className="upload-button">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload}
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
    </div>
  );
}

export default UploadSection;
