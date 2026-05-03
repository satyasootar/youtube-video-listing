import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

function formatDuration(duration) {
  const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = match[1] ? parseInt(match[1]) : 0;
  const m = match[2] ? parseInt(match[2]) : 0;
  const s = match[3] ? parseInt(match[3]) : 0;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(views) {
  const num = parseInt(views);
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num || 0;
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}

export default function VideoCard({ video, variant = 'default' }) {
  const { id, snippet, statistics, contentDetails } = video;
  
  if (variant === 'compact') {
    return (
      <Link to={`/video/${id}`} className="group flex gap-3 p-2 hover:bg-muted/40 rounded-2xl transition-colors">
        <div className="relative w-32 aspect-[16/10] rounded-xl overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url} 
            alt={snippet?.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md">
            {formatDuration(contentDetails?.duration)}
          </div>
        </div>
        <div className="flex flex-col justify-center py-1">
          <h3 className="text-sm font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
            {snippet?.title}
          </h3>
          <span className="text-xs text-muted-foreground mt-1 font-medium">
            {snippet?.channelTitle}
          </span>
          <div className="text-[11px] text-muted-foreground mt-0.5">
             {formatDuration(contentDetails?.duration)} {/* The reference design shows duration below in the text for compact cards */}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/video/${id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow">
        <img 
          src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url} 
          alt={snippet?.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
          {formatDuration(contentDetails?.duration)}
        </div>
      </div>
      <div className="flex flex-col pr-4">
        <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
          {snippet?.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="font-medium hover:text-foreground transition-colors">{snippet?.channelTitle}</span>
          {/* verified checkmark simulation */}
          <div className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2">
               <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {formatViews(statistics?.viewCount)} views • {timeAgo(snippet?.publishedAt)}
        </div>
      </div>
    </Link>
  );
}
