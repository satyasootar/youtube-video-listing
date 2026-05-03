import { useAppContext } from '../context/AppContext';
import VideoCard from '../components/VideoCard';
import { Heart } from 'lucide-react';

export default function LikedVideos() {
  const { likedVideos } = useAppContext();

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Liked Videos</h1>
      </div>
      
      {likedVideos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          You haven't liked any videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {likedVideos.map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
