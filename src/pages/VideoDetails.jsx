import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Loader2, Play, Bookmark, X, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api';

import { useAppContext } from '../context/AppContext';

function formatNumber(numStr) {
  const num = parseInt(numStr);
  if (isNaN(num)) return '0';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
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
  return 'just now';
}

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

export default function VideoDetails() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  
  const { addToHistory, likedVideos, toggleLike, watchLater, toggleWatchLater } = useAppContext();

  const shareUrl = `${import.meta.env.VITE_APP_URL || window.location.origin}/video/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [videoRes, relatedRes, commentsRes] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/related/${id}?page=1&limit=15`),
          api.get(`/comments/${id}`)
        ]);

        if (videoRes.data?.data?.video?.items) {
          const fetchedVideo = videoRes.data.data.video.items;
          setVideo(fetchedVideo);
          addToHistory(fetchedVideo);
        }
        if (relatedRes.data?.data?.data) {
          setRelatedVideos(relatedRes.data.data.data.map(item => item.items));
        }
        if (commentsRes.data?.data) {
          const c = Array.isArray(commentsRes.data.data) ? commentsRes.data.data : [];
          setComments(c);
        }
      } catch (err) {
        console.error("Error fetching video details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!video) return <div className="p-8 text-center text-muted-foreground text-lg">Video not found.</div>;

  const { snippet, statistics } = video;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto">
      {/* Main Video Area */}
      <div className="flex-1 lg:max-w-[70%]">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl mb-6 relative group">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${id}?autoplay=1`} 
            title={snippet?.title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        
        {/* Video Metadata */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight mb-4">
            {snippet?.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* Channel Info */}
            <div className="flex items-center gap-4">
              <Link to="/channel" className="flex-shrink-0">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(snippet?.channelTitle || 'C')}&background=random`} 
                  alt="Channel" 
                  className="w-12 h-12 rounded-full ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer" 
                />
              </Link>
              <div>
                <Link to="/channel" className="font-bold text-foreground text-base hover:text-primary transition-colors flex items-center gap-1.5">
                  {snippet?.channelTitle}
                  <div className="w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2">
                       <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground font-medium">1.2M subscribers</p>
              </div>
              <button className="ml-4 bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105">
                Subscribe
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
              <div className="flex items-center bg-muted/60 hover:bg-muted rounded-full transition-colors font-medium text-sm">
                <button onClick={() => toggleLike(video)} className={`flex items-center gap-2 px-5 py-2.5 border-r border-border/50 transition-colors ${likedVideos.some(v => v.id === video.id) ? 'text-blue-500' : ''}`}>
                  <ThumbsUp className="w-4 h-4" />
                  {formatNumber(statistics?.likeCount)}
                </button>
                <button className="px-5 py-2.5 transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 bg-muted/60 hover:bg-muted px-5 py-2.5 rounded-full transition-colors font-medium text-sm"
              >
                <Share className="w-4 h-4" />
                Share
              </button>
              <button onClick={() => toggleWatchLater(video)} className={`flex items-center gap-2 bg-muted/60 hover:bg-muted px-5 py-2.5 rounded-full transition-colors font-medium text-sm ${watchLater.some(v => v.id === video.id) ? 'text-primary' : ''}`}>
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
          
          {/* Description Box */}
          <div 
            onClick={() => setDescExpanded(!descExpanded)}
            className={`mt-6 bg-muted/30 p-5 rounded-[20px] transition-colors cursor-pointer hover:bg-muted/50 border border-transparent hover:border-border/50`}
          >
            <div className="flex gap-3 text-sm font-bold text-foreground mb-2">
              <span>{formatNumber(statistics?.viewCount)} views</span>
              <span>{timeAgo(snippet?.publishedAt)}</span>
            </div>
            <p className={`text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-3' : ''}`}>
              {snippet?.description}
            </p>
            {!descExpanded && <span className="text-sm font-bold text-primary mt-2 block">Show more</span>}
            {descExpanded && <span className="text-sm font-bold text-primary mt-4 block">Show less</span>}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h3 className="text-xl font-bold tracking-tight mb-6">
            {formatNumber(statistics?.commentCount)} Comments
          </h3>
          
          <div className="flex gap-4 mb-8">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">U</div>
             <div className="flex-1 border-b border-border/50 pb-2">
               <input 
                 type="text" 
                 placeholder="Add a comment..." 
                 className="w-full bg-transparent focus:outline-none py-1 text-sm transition-colors placeholder:text-muted-foreground font-medium" 
               />
             </div>
          </div>

          <div className="flex flex-col gap-8">
            {comments.slice(0, 20).map((comment, i) => {
              const cData = comment.snippet?.topLevelComment?.snippet;
              if (!cData) return null;
              return (
                <div key={i} className="flex gap-4 group">
                   <img 
                     src={cData.authorProfileImageUrl || `https://ui-avatars.com/api/?name=${cData.authorDisplayName || 'U'}`} 
                     alt="avatar" 
                     className="w-10 h-10 rounded-full flex-shrink-0" 
                   />
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm bg-foreground/5 px-2 py-0.5 rounded-md">{cData.authorDisplayName || "User"}</span>
                        <span className="text-xs text-muted-foreground font-medium">{timeAgo(cData.publishedAt || new Date())}</span>
                      </div>
                      <div className="text-sm text-foreground/90 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                         <ReactMarkdown>{cData.textOriginal || cData.textDisplay || ""}</ReactMarkdown>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                         <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                           <ThumbsUp className="w-4 h-4" />
                           <span className="text-xs font-semibold">{cData.likeCount > 0 ? formatNumber(cData.likeCount) : ''}</span>
                         </button>
                         <button className="text-muted-foreground hover:text-foreground transition-colors">
                           <ThumbsDown className="w-4 h-4" />
                         </button>
                         <button className="text-xs font-bold text-foreground ml-2 hover:bg-muted px-3 py-1.5 rounded-full transition-colors">
                           Reply
                         </button>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Related Videos Column */}
      <div className="w-full lg:w-[32%] flex flex-col gap-4">
        <h3 className="font-bold text-xl mb-2 tracking-tight">Related Videos</h3>
        {relatedVideos.map((relVideo, idx) => (
          <Link to={`/video/${relVideo.id}`} key={`${relVideo.id}-${idx}`} className="flex gap-3 group p-2 hover:bg-muted/30 rounded-[20px] transition-colors">
            <div className="relative w-[160px] aspect-[16/10] rounded-[16px] overflow-hidden flex-shrink-0 bg-muted">
              <img 
                src={relVideo.snippet?.thumbnails?.medium?.url || relVideo.snippet?.thumbnails?.default?.url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="thumbnail" 
              />
               <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {formatDuration(relVideo.contentDetails?.duration)}
              </div>
            </div>
            <div className="flex flex-col py-1">
              <h4 className="text-sm font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                {relVideo.snippet?.title}
              </h4>
              <span className="text-xs text-muted-foreground font-medium mb-0.5 hover:text-foreground transition-colors">
                {relVideo.snippet?.channelTitle}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                {formatNumber(relVideo.statistics?.viewCount)} views • {timeAgo(relVideo.snippet?.publishedAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* Share Modal */}
    {isShareModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsShareModalOpen(false)}
        ></div>
        
        {/* Modal Content */}
        <div className="relative bg-background border border-border/50 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-6 flex items-center justify-between border-b border-border/50">
            <h3 className="text-xl font-bold tracking-tight">Share</h3>
            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-sm text-muted-foreground mb-4 font-medium text-center">Copy this link to share the video</p>
            
            <div className="flex items-center gap-2 bg-muted/40 p-2 pl-4 rounded-2xl border border-border/30">
              <span className="flex-1 text-sm truncate text-foreground/80">{shareUrl}</span>
              <button 
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:scale-[1.02]'}`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          
          </div>
        </div>
      </div>
    )}
    </>
  );
}
