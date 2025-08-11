import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  NetflixHeader,
  HeroBanner,
  ContentRow,
  VideoModal,
  NetflixFooter,
  LoadingSpinner
} from "./components";

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];

let currentKeyIndex = 0;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to get API key and rotate on rate limits
const getTMDBApiKey = () => {
  return TMDB_API_KEYS[currentKeyIndex];
};

const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
};

// TMDB API Functions
const fetchFromTMDB = async (endpoint, retries = 1) => {
  const apiKey = getTMDBApiKey();
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${apiKey}&language=en-US`;
  
  try {
    const response = await fetch(url);
    
    if (response.status === 429 && retries > 0) {
      rotateApiKey();
      return fetchFromTMDB(endpoint, retries - 1);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('TMDB API error, using fallback data:', error);
    return getFallbackData(endpoint);
  }
};

const fetchMovieVideos = async (movieId, isTV = false) => {
  const type = isTV ? 'tv' : 'movie';
  try {
    const data = await fetchFromTMDB(`/${type}/${movieId}/videos`);
    const trailer = data.results?.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer?.key || null;
  } catch (error) {
    console.warn('Error fetching video:', error);
    return null;
  }
};

// Fallback mock data
const getFallbackData = (endpoint) => {
  const mockMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      name: "The Dark Knight",
      overview: "When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
      vote_average: 9.0,
      release_date: "2008-07-18"
    },
    {
      id: 2,
      title: "Inception",
      name: "Inception", 
      overview: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg",
      vote_average: 8.8,
      release_date: "2010-07-16"
    },
    {
      id: 3,
      title: "Interstellar",
      name: "Interstellar",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      vote_average: 8.6,
      release_date: "2014-11-05"
    },
    {
      id: 4,
      title: "The Matrix",
      name: "The Matrix",
      overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      vote_average: 8.7,
      release_date: "1999-03-30"
    },
    {
      id: 5,
      title: "Pulp Fiction",
      name: "Pulp Fiction",
      overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      vote_average: 8.9,
      release_date: "1994-09-10"
    }
  ];

  return { results: mockMovies };
};

const Home = () => {
  const [featuredContent, setFeaturedContent] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoKey: null, title: '' });
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    
    try {
      // Load trending for hero banner
      const trending = await fetchFromTMDB('/trending/all/day');
      if (trending.results && trending.results.length > 0) {
        setFeaturedContent(trending.results[0]);
        setTrendingMovies(trending.results.slice(1, 11));
      }

      // Load popular movies
      const popular = await fetchFromTMDB('/movie/popular');
      setPopularMovies(popular.results?.slice(0, 10) || []);

      // Load top rated movies
      const topRated = await fetchFromTMDB('/movie/top_rated');
      setTopRatedMovies(topRated.results?.slice(0, 10) || []);

      // Load popular TV shows
      const tvShows = await fetchFromTMDB('/tv/popular');
      setPopularTVShows(tvShows.results?.slice(0, 10) || []);

      // Load genre-specific content
      const action = await fetchFromTMDB('/discover/movie?with_genres=28');
      setActionMovies(action.results?.slice(0, 10) || []);

      const comedy = await fetchFromTMDB('/discover/movie?with_genres=35');
      setComedyMovies(comedy.results?.slice(0, 10) || []);

    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async (content) => {
    const isTV = content.first_air_date ? true : false;
    const videoKey = await fetchMovieVideos(content.id, isTV);
    
    setVideoModal({
      isOpen: true,
      videoKey,
      title: content.title || content.name
    });
  };

  const handleAddToList = (content) => {
    setMyList(prev => {
      const exists = prev.find(item => item.id === content.id);
      if (exists) {
        return prev.filter(item => item.id !== content.id);
      }
      return [...prev, content];
    });
  };

  const handleSearch = (query) => {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoKey: null, title: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader onSearch={handleSearch} />
      
      <HeroBanner 
        featuredContent={featuredContent}
        onPlay={handlePlay}
        onAddToList={handleAddToList}
      />

      <div className="relative -mt-32 z-10">
        <ContentRow
          title="Trending Now"
          movies={trendingMovies}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
          isLarge={true}
        />

        <ContentRow
          title="Popular Movies"
          movies={popularMovies}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
        />

        <ContentRow
          title="Top Rated Movies"
          movies={topRatedMovies}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
        />

        <ContentRow
          title="Popular TV Shows"
          movies={popularTVShows}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
        />

        <ContentRow
          title="Action Movies"
          movies={actionMovies}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
        />

        <ContentRow
          title="Comedy Movies"
          movies={comedyMovies}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
        />

        {myList.length > 0 && (
          <ContentRow
            title="My List"
            movies={myList}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
          />
        )}
      </div>

      <NetflixFooter />

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoKey={videoModal.videoKey}
        title={videoModal.title}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;