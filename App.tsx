
import React, { useState, useEffect, useRef } from 'react';
import { VideoMetadata } from './types';
import { generateVideoInsights } from './services/geminiService';
import { Button } from './components/Button';
import { VideoCard } from './components/VideoCard';

const App: React.FC = () => {
  const [uploads, setUploads] = useState<VideoMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('streamshort_history');
    if (saved) {
      try {
        setUploads(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const saveToHistory = (newUploads: VideoMetadata[]) => {
    setUploads(newUploads);
    localStorage.setItem('streamshort_history', JSON.stringify(newUploads));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert("Please upload a valid video file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Step 1: Analyze with Gemini
      setUploadProgress(30);
      const insights = await generateVideoInsights(file.name, file.size);
      
      setUploadProgress(60);
      // Create a local object URL for preview (Simulating backend upload)
      const localUrl = URL.createObjectURL(file);
      
      const newVideo: VideoMetadata = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: localUrl,
        shortUrl: `https://str.short/${insights.slug}`,
        slug: insights.slug,
        aiTitle: insights.title,
        aiDescription: insights.description,
        tags: insights.tags,
        createdAt: Date.now(),
      };

      setUploadProgress(100);
      setTimeout(() => {
        saveToHistory([newVideo, ...uploads]);
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);

    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong during the AI analysis.");
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    saveToHistory(uploads.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Stream<span className="text-sky-400">Short</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </nav>

      {/* Hero / Upload Section */}
      <main className="max-w-7xl mx-auto px-6 mt-12 md:mt-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Share your videos with <br />
          <span className="gradient-text">AI-Powered Short Links</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Upload any video, and let Gemini create catchy titles, summaries, and instant short URLs for sharing across social platforms.
        </p>

        <div className="max-w-3xl mx-auto">
          <div 
            className={`glass rounded-3xl p-8 md:p-12 border-2 border-dashed transition-all duration-300 ${
              isUploading ? 'border-sky-500/50 scale-[0.98]' : 'border-slate-700 hover:border-sky-500/30'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-full max-w-md bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full transition-all duration-500 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sky-400 font-medium animate-pulse">
                  {uploadProgress < 40 ? 'Analyzing video data...' : uploadProgress < 80 ? 'Generating metadata with Gemini...' : 'Finalizing short link...'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Drag & drop your video</h3>
                <p className="text-slate-500 text-sm mb-8">MP4, MOV, WEBM up to 2GB</p>
                
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*" 
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <Button size="lg" className="rounded-2xl" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {uploads.length > 0 && (
          <div className="mt-24 text-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Uploads</h2>
              <Button variant="outline" size="sm" onClick={() => {
                if(confirm('Clear all history?')) {
                  saveToHistory([]);
                }
              }}>
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map(video => (
                <VideoCard key={video.id} video={video} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {uploads.length === 0 && !isUploading && (
          <div className="mt-24 py-20 border border-slate-800/50 rounded-3xl bg-slate-900/30">
            <p className="text-slate-500">No upload history yet. Start by sharing your first video!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © 2024 StreamShort AI. Built for the future of content.
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
