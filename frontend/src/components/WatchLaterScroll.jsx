import React, { useRef, useState } from 'react';
import WatchLaterCard from './WatchLaterCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WatchLaterScroll = ({ movies, onToggleWatchLater, onWatch, onDelete, onCardClick }) => {
  const scrollRef = useRef();
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
        {movies.map(obj => (
          <WatchLaterCard 
            key={obj.movie.id} 
            movie={obj.movie} 
            onToggleWatchLater={onToggleWatchLater}
            onWatch={onWatch}
            onDelete={onDelete}
            onClick={() => onCardClick(obj.movie.id)}
          />
        ))}
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

export default WatchLaterScroll;