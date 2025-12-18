
import React, { useState } from 'react';
import { VideoMetadata } from '../types';
import { Button } from './Button';

interface VideoCardProps {
  video: VideoMetadata;
  onDelete?: (id: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(video.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-300">
      <div className="aspect-video bg-slate-900 relative group">
        <video 
          src={video.url} 
          className="w-full h-full object-cover"
          muted
          onMouseOver={e => (e.target as HTMLVideoElement).play()}
          onMouseOut={e => {
            const v = e.target as HTMLVideoElement;
            v.pause();
            v.currentTime = 0;
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <span className="text-white text-sm font-medium">Hover to Preview</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg truncate text-slate-100">{video.aiTitle}</h3>
          <p className="text-xs text-slate-400 mt-1">{video.name} • {(video.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {video.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/20">
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input 
            readOnly 
            value={video.shortUrl} 
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
          />
          <Button size="sm" onClick={copyToClipboard} variant={copied ? 'secondary' : 'primary'}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        {onDelete && (
          <button 
            onClick={() => onDelete(video.id)}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors w-full text-center pt-2"
          >
            Remove from history
          </button>
        )}
      </div>
    </div>
  );
};
