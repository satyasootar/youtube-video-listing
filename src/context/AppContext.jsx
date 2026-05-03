import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [channelInfo, setChannelInfo] = useState(null);
  
  // Local state for library features
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [likedVideos, setLikedVideos] = useState(() => JSON.parse(localStorage.getItem('likedVideos')) || []);
  const [watchLater, setWatchLater] = useState(() => JSON.parse(localStorage.getItem('watchLater')) || []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync to local storage
  useEffect(() => { localStorage.setItem('history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('likedVideos', JSON.stringify(likedVideos)); }, [likedVideos]);
  useEffect(() => { localStorage.setItem('watchLater', JSON.stringify(watchLater)); }, [watchLater]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addToHistory = (video) => {
    setHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      return [video, ...filtered].slice(0, 100); // keep last 100
    });
  };

  const toggleLike = (video) => {
    setLikedVideos(prev => {
      const exists = prev.find(v => v.id === video.id);
      if (exists) return prev.filter(v => v.id !== video.id);
      return [video, ...prev];
    });
  };

  const toggleWatchLater = (video) => {
    setWatchLater(prev => {
      const exists = prev.find(v => v.id === video.id);
      if (exists) return prev.filter(v => v.id !== video.id);
      return [video, ...prev];
    });
  };

  const fetchChannel = async () => {
    try {
      const res = await api.get('/channel');
      if (res.data && res.data.data) {
        setChannelInfo(res.data.data.info);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  return (
    <AppContext.Provider value={{ 
      theme, toggleTheme, channelInfo,
      history, addToHistory,
      likedVideos, toggleLike,
      watchLater, toggleWatchLater
    }}>
      {children}
    </AppContext.Provider>
  );
};
