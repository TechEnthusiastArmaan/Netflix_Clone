import React, { useState, useEffect, useRef } from 'react';

// Netflix Header Component
export const NetflixHeader = ({ onSearch, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
            alt="Netflix" 
            className="h-8 md:h-10"
          />
          
          {/* Navigation Links */}
          <ul className="hidden md:flex space-x-8 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">New & Popular</a></li>
            <li><a href="#" className="hover:text-white transition-colors">My List</a></li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles..."
              className="bg-black/50 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all w-64"
            />
          </form>

          {/* Profile */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1661747675288-814df576be9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwYXZhdGFyfGVufDB8fHxibGFja3wxNzU0OTEwMjYwfDA&ixlib=rb-4.1.0&q=85"
              alt="Profile"
              className="w-8 h-8 rounded cursor-pointer hover:ring-2 ring-white transition-all"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            />
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 rounded shadow-lg border border-gray-800">
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-800">Account</a>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-800">Help Center</a>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-800">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

// Hero Banner Component
export const HeroBanner = ({ featuredContent, onPlay, onAddToList }) => {
  if (!featuredContent) return null;

  return (
    <div className="relative h-screen bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${featuredContent.backdrop_path || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fGJsYWNrfDE3NTQ5MDY3NDB8MA&ixlib=rb-4.1.0&q=85'})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-48 left-12 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          {featuredContent.title || featuredContent.name}
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 line-clamp-3">
          {featuredContent.overview}
        </p>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => onPlay && onPlay(featuredContent)}
            className="flex items-center bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition-colors font-semibold"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z"/>
            </svg>
            Play
          </button>
          
          <button 
            onClick={() => onAddToList && onAddToList(featuredContent)}
            className="flex items-center bg-gray-600/70 text-white px-8 py-3 rounded hover:bg-gray-600/90 transition-colors font-semibold"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            My List
          </button>
        </div>
      </div>
    </div>
  );
};

// Movie Card Component
export const MovieCard = ({ movie, onPlay, onAddToList, isLarge = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!movie) return null;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MHx8fGJsYWNrfDE3NTQ5MDY3NDB8MA&ixlib=rb-4.1.0&q=85';

  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 ${isLarge ? 'w-80' : 'w-60'} ${isHovered ? 'scale-110 z-20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={posterUrl}
        alt={movie.title || movie.name}
        className={`w-full rounded-lg ${isLarge ? 'h-96' : 'h-80'} object-cover`}
        loading="lazy"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black/80 rounded-lg flex flex-col justify-end p-4 transition-opacity duration-300">
          <h3 className="text-white font-bold text-lg mb-2">{movie.title || movie.name}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{movie.overview}</p>
          
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlay && onPlay(movie);
              }}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 5v10l8-5-8-5z"/>
              </svg>
              Play
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToList && onAddToList(movie);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              + My List
            </button>
          </div>
          
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-green-400 font-semibold">{Math.round(movie.vote_average * 10)}% Match</span>
            <span className="text-gray-400 text-sm">{new Date(movie.release_date || movie.first_air_date).getFullYear()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, movies = [], onPlay, onAddToList, isLarge = false }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative mb-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-12">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Movies Container */}
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-hidden scroll-smooth px-12"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard 
                movie={movie} 
                onPlay={onPlay}
                onAddToList={onAddToList}
                isLarge={isLarge}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Video Modal Component
export const VideoModal = ({ isOpen, onClose, videoKey, title }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10"
        >
          ×
        </button>
        
        <div className="bg-black rounded-lg overflow-hidden">
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={title}
              className="w-full h-96 md:h-[600px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-96 md:h-[600px] flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-white text-2xl mb-4">Trailer Not Available</h3>
                <p className="text-gray-400">Sorry, no trailer is available for "{title}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const NetflixFooter = () => {
  return (
    <footer className="bg-black text-gray-400 py-16 px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-lg mb-4">Questions? Contact us.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Account</a></li>
              <li><a href="#" className="hover:underline">Media Center</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Investor Relations</a></li>
              <li><a href="#" className="hover:underline">Jobs</a></li>
              <li><a href="#" className="hover:underline">Ways to Watch</a></li>
              <li><a href="#" className="hover:underline">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Cookie Preferences</a></li>
              <li><a href="#" className="hover:underline">Corporate Information</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="hover:underline">Speed Test</a></li>
              <li><a href="#" className="hover:underline">Legal Notices</a></li>
              <li><a href="#" className="hover:underline">Only on Netflix</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>© 2025 Netflix Clone. This is a demo application.</p>
        </div>
      </div>
    </footer>
  );
};

// Loading Spinner Component
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );
};