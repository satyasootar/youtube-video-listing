import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VideoDetails from './pages/VideoDetails';
import Channel from './pages/Channel';
import Playlist from './pages/Playlist';
import Explore from './pages/Explore';
import Subscriptions from './pages/Subscriptions';
import Library from './pages/Library';
import History from './pages/History';
import WatchLater from './pages/WatchLater';
import LikedVideos from './pages/LikedVideos';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="video/:id" element={<VideoDetails />} />
        <Route path="channel" element={<Channel />} />
        <Route path="playlist/:id" element={<Playlist />} />
        <Route path="explore" element={<Explore />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="library" element={<Library />} />
        <Route path="history" element={<History />} />
        <Route path="watch-later" element={<WatchLater />} />
        <Route path="liked-videos" element={<LikedVideos />} />
      </Route>
    </Routes>
  );
}

export default App;
