import { useState } from 'react';
import { Upload, Wand2, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { MagicalParticles } from './MagicalParticles.jsx';
import { BookLibrary } from './BookLibrary.jsx';
import { uploadFile } from '../lib/api';
import { saveDocumentId } from '../lib/session';

export function UploadStorybook({ onStoryUploaded, uploadedBooks, onBookSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setIsAnalyzing(true);
    setProgress(0);

    // Upload to backend
    (async () => {
      try {
        const result = await uploadFile(file);
        // expected { document_id }
        if (result && result.document_id) {
          saveDocumentId(result.document_id);
        }

        // small progress animation to show activity
        const interval = setInterval(() => {
          setProgress((prev) => Math.min(100, prev + 20));
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            onStoryUploaded({
              title: file.name,
              author: 'Uploaded',
              fileName: file.name,
            });
            // Update URL to /characters for deep-linking (SPA friendly)
            try { history.pushState(null, '', '/characters'); } catch(e) {}
          }, 300);
        }, 900 + Math.random() * 600);
      } catch (err) {
        console.error('Upload failed', err);
        // fallback to local simulation so UX continues
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                onStoryUploaded({
                  title: file.name,
                  author: 'Uploaded (local)',
                  fileName: file.name,
                });
              }, 300);
              return 100;
            }
            return prev + 12;
          });
        }, 180);
        setIsAnalyzing(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Magical Particles */}
      <MagicalParticles color="purple" density={50} />
      
      {/* Decorative glowing elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 p-3 bg-purple-500/20 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/30 border border-purple-500/30">
            <Wand2 className="w-12 h-12 text-purple-300" />
          </div>
          <h1 className="text-white mb-3 flex items-center justify-center gap-3">
            Chat with Storybook Characters
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </h1>
          <p className="text-purple-200 max-w-md mx-auto">
            Upload your favorite storybook and bring its characters to life through magical conversation
          </p>
        </div>

        {/* Upload Card */}
        <Card className="w-full max-w-2xl bg-slate-800/80 backdrop-blur-sm border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
          <div
            className={`p-8 md:p-12 border-2 border-dashed rounded-lg m-4 md:m-6 transition-all duration-300 ${
              isDragging
                ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/30'
                : 'border-purple-500/30 bg-purple-500/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 shadow-lg shadow-purple-500/30">
                  <Upload className="w-12 h-12 md:w-16 md:h-16 text-purple-300" />
                </div>
              </div>
              
              {!isAnalyzing ? (
                <>
                  <h3 className="text-white mb-2">
                    Drop your storybook here
                  </h3>
                  <p className="text-purple-200 mb-6">
                    or click to browse files
                  </p>
                  <p className="text-purple-300 mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Supports PDF and TXT files
                  </p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 shadow-lg shadow-purple-500/30"
                    >
                      <span className="cursor-pointer">Upload File</span>
                    </Button>
                  </label>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <p className="text-white">
                      Analyzing story...
                    </p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="space-y-2">
                    <p className="text-purple-200 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      {progress < 30 && "Reading your storybook..."}
                      {progress >= 30 && progress < 60 && "Detecting magical characters..."}
                      {progress >= 60 && progress < 90 && "Generating character profiles..."}
                      {progress >= 90 && "Almost ready!"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Book Library */}
        {!isAnalyzing && (
          <BookLibrary books={uploadedBooks} onBookSelect={onBookSelect} />
        )}

        {/* Info Cards */}
        {!isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl pb-8">
            <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 border border-purple-500/30">
                <span className="text-2xl">📖</span>
              </div>
              <h4 className="text-white mb-2">Upload Story</h4>
              <p className="text-purple-200">
                Upload any storybook in PDF or TXT format
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                <span className="text-2xl">🎭</span>
              </div>
              <h4 className="text-white mb-2">Meet Characters</h4>
              <p className="text-blue-200">
                AI automatically detects and profiles characters
              </p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/20">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-white mb-2">Start Chatting</h4>
              <p className="text-amber-200">
                Have magical conversations with your favorite characters
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadStorybook;
