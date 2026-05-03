import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Menu, Search, Video, Moon, Sun, Home, Compass, PlaySquare, Clock, User, Bell, Bookmark, Heart, ChevronDown } from 'lucide-react';
import api from '../api';

export default function Layout() {
  const { theme, toggleTheme, channelInfo } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await api.get(`/videos?page=1&limit=8&query=${encodeURIComponent(searchQuery)}`);
          if (res.data?.data?.data) {
            // Get unique titles for suggestions
            const titles = [...new Set(res.data.data.data.map(item => item.items.snippet.title))];
            setSuggestions(titles);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4 w-64">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <span>YouTube</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 justify-center relative" ref={suggestionsRef}>
            <form onSubmit={handleSearch} className="relative w-full max-w-[600px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                placeholder="Search videos, channels, topics..."
                className="w-full bg-muted/40 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
              />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden z-50 py-2 max-w-[600px] mx-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-muted/50 transition-colors text-left text-sm font-medium"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-64 justify-end">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-muted-foreground hover:text-foreground rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {channelInfo ? (
              <Link to="/channel">
                <img src={channelInfo?.avatar?.url} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer" />
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-[240px] hidden lg:flex flex-col overflow-y-auto bg-background px-4 py-6">
          <nav className="space-y-1">
            <Link to="/" className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Home className="w-5 h-5" />
              Home
            </Link>
            <Link to="/explore" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Compass className="w-5 h-5" />
              Explore
            </Link>
            <Link to="/subscriptions" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <PlaySquare className="w-5 h-5" />
              Subscriptions
            </Link>
            
            <div className="h-px bg-border my-4 mx-4"></div>
            
            <Link to="/library" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Video className="w-5 h-5" />
              Library
            </Link>
            <Link to="/history" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Clock className="w-5 h-5" />
              History
            </Link>
            <Link to="/watch-later" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Bookmark className="w-5 h-5" />
              Watch Later
            </Link>
            <Link to="/liked-videos" className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:bg-muted/30 hover:text-foreground rounded-2xl transition-colors font-medium">
              <Heart className="w-5 h-5" />
              Liked Videos
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
