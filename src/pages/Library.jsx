import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Clock, Heart, Bookmark, ChevronRight, Video } from 'lucide-react';
import VideoCard from '../components/VideoCard';

function LibrarySection({ title, icon, link, items }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        <Link to={link} className="flex items-center gap-1 text-sm font-semibold text-primary hover:bg-primary/10 px-4 py-1.5 rounded-full transition-colors">
          See All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      {items.length === 0 ? (
        <div className="text-muted-foreground text-sm py-4">Nothing here yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.slice(0, 4).map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Library() {
  const { history, likedVideos, watchLater } = useAppContext();

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-muted rounded-full">
          <Video className="w-6 h-6 text-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Library</h1>
      </div>

      <LibrarySection 
        title="History" 
        icon={<Clock className="w-6 h-6 text-foreground" />} 
        link="/history" 
        items={history} 
      />

      <LibrarySection 
        title="Watch Later" 
        icon={<Bookmark className="w-6 h-6 text-primary" />} 
        link="/watch-later" 
        items={watchLater} 
      />

      <LibrarySection 
        title="Liked Videos" 
        icon={<Heart className="w-6 h-6 text-blue-500" />} 
        link="/liked-videos" 
        items={likedVideos} 
      />
    </div>
  );
}
