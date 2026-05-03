import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Play, Shuffle, Share, MoreHorizontal } from 'lucide-react';
import api from '../api';

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

export default function Playlist() {
  const { id } = useParams();
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/playlists/${id}`);
        if (res.data?.data) {
          const { playlist, playlistItems } = res.data.data;
          setPlaylistInfo(playlist);
          
          let items = [];
          if (Array.isArray(playlistItems)) items = playlistItems;
          else if (playlistItems?.items) items = playlistItems.items;
          
          setVideos(items);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!playlistInfo) return <div className="p-8 text-center text-muted-foreground">Playlist not found.</div>;

  const { snippet } = playlistInfo;
  
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto min-h-[80vh]">
      
      {/* Left Sidebar: Playlist Info */}
      <div className="w-full lg:w-[360px] flex-shrink-0">
        <div className="lg:sticky lg:top-24 bg-muted/30 p-6 md:p-8 rounded-[32px] flex flex-col items-center lg:items-start shadow-sm border border-border/50">
           <div className="w-full aspect-[16/10] rounded-[24px] overflow-hidden bg-muted shadow-lg mb-6 relative">
              <img 
                src={snippet?.thumbnails?.maxres?.url || snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url} 
                alt={snippet?.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
           </div>
           
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2 text-center lg:text-left leading-tight">
             {snippet?.title}
           </h1>
           <div className="flex items-center gap-2 text-muted-foreground font-medium mb-4 justify-center lg:justify-start w-full">
             <span>{snippet?.channelTitle}</span>
             <span className="w-1 h-1 bg-border rounded-full"></span>
             <span>{videos.length} videos</span>
           </div>
           
           <div className="flex gap-3 w-full mb-6">
             <button className="flex-1 bg-foreground text-background flex items-center justify-center gap-2 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current" /> Play all
             </button>
             <button className="flex-1 bg-muted/60 text-foreground flex items-center justify-center gap-2 py-3 rounded-full font-bold hover:bg-muted transition-colors">
                <Shuffle className="w-5 h-5" /> Shuffle
             </button>
           </div>
           
           <div className="flex gap-2 w-full mb-6 justify-center lg:justify-start">
             <button className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><Share className="w-5 h-5" /></button>
             <button className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
           </div>
           
           {snippet?.description && (
             <div className="w-full">
               <p className="text-sm text-foreground/80 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer leading-relaxed">
                 {snippet.description}
               </p>
             </div>
           )}
        </div>
      </div>
      
      {/* Right Column: Video List */}
      <div className="flex-1 flex flex-col gap-3 py-4 lg:py-0">
        {videos.map((item, index) => {
          // Depending on API, item might be wrapped in .items or just be the video
          const video = item.snippet ? item : item.items;
          if (!video) return null;
          
          return (
            <Link 
              to={`/video/${video.snippet?.resourceId?.videoId || video.id}`} 
              key={index}
              className="flex items-center gap-4 p-3 hover:bg-muted/40 rounded-[20px] transition-colors group"
            >
               <span className="text-sm font-medium text-muted-foreground w-6 text-center group-hover:text-primary transition-colors">
                 {index + 1}
               </span>
               <div className="relative w-36 md:w-48 aspect-[16/10] rounded-[14px] overflow-hidden bg-muted flex-shrink-0">
                 <img 
                   src={video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url} 
                   alt={video.snippet?.title} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                   {formatDuration(video.contentDetails?.duration)}
                 </div>
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8 text-white fill-current" />
                 </div>
               </div>
               <div className="flex flex-col py-1">
                 <h3 className="text-base font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                   {video.snippet?.title}
                 </h3>
                 <p className="text-sm text-muted-foreground font-medium">
                   {video.snippet?.channelTitle || snippet?.channelTitle}
                 </p>
               </div>
            </Link>
          )
        })}
      </div>
      
    </div>
  );
}
