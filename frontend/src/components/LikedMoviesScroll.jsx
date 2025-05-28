import React, { useState, useEffect, useCallback } from 'react';
import LikedMovieCard from './LikedMovieCard';

const LikedMoviesScroll = ({ movies, hasMore, onMovieClick, onLoadMore }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setIsLoading(true);
      onLoadMore();
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="liked-movies-scroll">
      {movies.map((obj) => (
        <LikedMovieCard 
          key={obj.movie.id} 
          movie={obj.movie} 
          onClick={() => onMovieClick(obj.movie)}
        />
      ))}
      {isLoading && <div className="loading-more">Загрузка...</div>}
    </div>
  );
};

export default LikedMoviesScroll;