import { useState, useEffect } from 'react';
import { Loader2, Play, Users, Video as VideoIcon, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import VideoCard from '../components/VideoCard';

export default function Channel() {
  const [channelInfo, setChannelInfo] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [channelRes, playlistsRes] = await Promise.all([
          api.get('/channel'),
          api.get('/playlists?page=1&limit=8')
        ]);
        
        if (channelRes.data?.data?.info) {
          setChannelInfo(channelRes.data.data.info);
        }
        if (playlistsRes.data?.data?.data) {
          setPlaylists(playlistsRes.data.data.data);
        }
      } catch (err) {
        console.error("Error fetching channel:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!channelInfo) return <div className="p-8 text-center text-muted-foreground">Channel not found.</div>;

  const { title, description, subscriberCount, videoCount, viewCount, banner, avatar, isVerified } = channelInfo;

  return (
    <div className="flex flex-col max-w-[1400px] mx-auto pb-12">
      {/* Banner */}
      <div className="w-full h-48 md:h-72 rounded-[32px] overflow-hidden mb-8 relative bg-muted shadow-sm">
        <img 
          src={banner?.url || 'https://via.placeholder.com/1500x400?text=Banner'} 
          alt="Channel Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Channel Header Info */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start px-4 md:px-8 mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl -mt-20 md:-mt-24 relative z-10 bg-muted flex-shrink-0">
          <img src={avatar?.url} alt={title} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 flex flex-col items-start pt-2 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center gap-2 mb-2">
            {title}
            {isVerified && <CheckCircle2 className="w-6 h-6 text-blue-500 fill-current bg-white rounded-full" />}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium mb-4">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {subscriberCount} subscribers</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
            <span className="flex items-center gap-1.5"><VideoIcon className="w-4 h-4"/> {videoCount} videos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
            <span>{viewCount} views</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl line-clamp-2 hover:line-clamp-none transition-all">
            {description}
          </p>
        </div>

        <div className="flex-shrink-0 pt-2 w-full md:w-auto">
          <button className="w-full md:w-auto bg-foreground text-background font-semibold px-8 py-3 rounded-full hover:scale-105 transition-transform">
            Subscribe
          </button>
        </div>
      </div>

      {/* Playlists Section */}
      <div className="px-4 md:px-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {playlists.map((pl, idx) => (
            <Link to={`/playlist/${pl.id}`} key={idx} className="group flex flex-col gap-3 cursor-pointer">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-shadow">
                 <img 
                   src={pl.snippet?.thumbnails?.high?.url || pl.snippet?.thumbnails?.medium?.url} 
                   alt={pl.snippet?.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                 <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                   <Play className="w-3 h-3" /> Playlist
                 </div>
              </div>
              <div className="flex flex-col pr-4">
                 <h3 className="text-base font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                   {pl.snippet?.title}
                 </h3>
                 <div className="text-sm text-muted-foreground line-clamp-1">
                   {pl.snippet?.description || "Curated playlist"}
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
