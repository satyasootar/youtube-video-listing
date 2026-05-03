import { useAppContext } from '../context/AppContext';
import VideoCard from '../components/VideoCard';
import { Bookmark } from 'lucide-react';

export default function WatchLater() {
  const { watchLater } = useAppContext();

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-full">
          <Bookmark className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Watch Later</h1>
      </div>
      
      {watchLater.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          You haven't added any videos to Watch Later.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {watchLater.map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
