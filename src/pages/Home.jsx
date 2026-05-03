import { useState, useEffect } from 'react';
import api from '../api';
import VideoCard from '../components/VideoCard';
import { Loader2, Play, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const url = query 
          ? `/videos?page=1&limit=20&query=${encodeURIComponent(query)}`
          : '/videos?page=1&limit=20';
        const res = await api.get(url);
        if (res.data && res.data.data && res.data.data.data) {
          const vids = res.data.data.data.map(item => item.items);
          setVideos(vids);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [query]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (query) {
    return (
      <div className="flex flex-col gap-10 max-w-[1400px]">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-6 tracking-tight">
            Search results for "{query}"
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featuredVideo = videos[0];
  const compactListVideos = videos.slice(1, 5);
  const forYouVideos = videos.slice(5, 9);
  const trendingVideos = videos.slice(9, 13);

  return (
    <div className="flex flex-col gap-10 max-w-[1400px]">
      
      {/* Home Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-6 tracking-tight">Home</h1>
        
        {/* Featured Section */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Featured Large Banner */}
          {featuredVideo && (
            <div className="flex-1 bg-muted/30 rounded-[32px] overflow-hidden flex flex-col md:flex-row p-6 md:p-8 relative min-h-[360px]">
               {/* Content */}
               <div className="flex-1 flex flex-col justify-center z-10 pr-6 relative mb-8 md:mb-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                     Featured
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-4 text-foreground line-clamp-3">
                    {featuredVideo.snippet?.title}
                  </h2>
                  <Link to={`/video/${featuredVideo.id}`} className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3.5 rounded-full hover:scale-105 transition-transform w-max">
                     <Play className="w-5 h-5 fill-current" />
                     Play Video
                  </Link>
               </div>
               
               {/* Image Background for the featured card */}
               <div className="w-full md:w-[55%] relative rounded-[24px] overflow-hidden shadow-2xl h-52 md:h-auto">
                 <img 
                    src={featuredVideo.snippet?.thumbnails?.maxres?.url || featuredVideo.snippet?.thumbnails?.high?.url} 
                    alt="Featured" 
                    className="absolute inset-0 w-full h-full object-cover"
                 />
                 {/* Page indicator simulation */}
                 <div className="absolute bottom-4 left-6 flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                   <div className="w-2 h-2 rounded-full bg-white/40"></div>
                   <div className="w-2 h-2 rounded-full bg-white/40"></div>
                   <div className="w-2 h-2 rounded-full bg-white/40"></div>
                 </div>
               </div>
            </div>
          )}

          {/* Compact List Side */}
          <div className="w-full xl:w-[320px] flex flex-col gap-2">
             {compactListVideos.map(video => (
               <VideoCard key={video.id} video={video} variant="compact" />
             ))}
          </div>
        </div>
      </div>

      {/* For You Section */}
      <div>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">For You</h2>
            <button className="flex items-center gap-1 text-sm font-semibold bg-muted/50 hover:bg-muted px-4 py-1.5 rounded-full transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative">
            {forYouVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
            {/* Scroll Right Button Simulation */}
            <button className="absolute -right-5 top-1/3 bg-background border border-border shadow-lg p-2.5 rounded-full hidden lg:block hover:bg-muted transition-colors">
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Trending Section */}
      <div>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Trending</h2>
            <button className="flex items-center gap-1 text-sm font-semibold bg-muted/50 hover:bg-muted px-4 py-1.5 rounded-full transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {trendingVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
         </div>
      </div>
    </div>
  );
}
