import React, { useRef, useState, useCallback } from 'react';
import LikedMovieCard from './LikedMovieCard/LikedMovieCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LikedMoviesScroll = ({ movies, hasMore, onMovieClick, onLoadMore }) => {
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    if (direction === 'right' && 
        newScrollLeft + container.clientWidth >= container.scrollWidth - 100 &&
        hasMore && 
        !isLoading) {
      setIsLoading(true);
      onLoadMore().finally(() => setIsLoading(false));
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft + container.clientWidth < container.scrollWidth);
  };

  return (
    <div className="movies-scroll-container">
      {showLeftArrow && (
        <button 
          className="scroll-button left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}
      
      <div 
        className="movies-scroll" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {movies.map((obj) => (
          <LikedMovieCard 
            key={obj.movie.id} 
            movie={obj.movie} 
            onClick={() => onMovieClick(obj.movie)}
            is_matched={obj.is_matched}
          />
        ))}
        {isLoading && <div className="loading-more">Загрузка...</div>}
      </div>

      {showRightArrow && (
        <button 
          className="scroll-button right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default LikedMoviesScroll;