import React, { useRef, useState } from 'react';
import WatchedCard from './WatchedCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WatchedScroll = ({ movies, onUnwatch, loadMore, hasMore, onCardClick, onRatingClick }) => {
  const scrollRef = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 300; // Можно настроить под ваши нужды
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Проверяем, нужно ли загрузить больше элементов при прокрутке вправо
    if (direction === 'right' && 
        newScrollLeft + container.clientWidth >= container.scrollWidth - 100 &&
        hasMore && 
        !isLoadingMore) {
      setIsLoadingMore(true);
      loadMore().finally(() => setIsLoadingMore(false));
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
        {movies.map((obj, index) => (
          <WatchedCard 
            review={obj.review}
            key={`watched-${obj.movie.id}-${index}`}
            movie={obj.movie} 
            onUnwatch={() => onUnwatch(obj.movie)}
            onClick={() => onRatingClick(obj)}
            onCardClick={() => onCardClick(obj.movie.id)}
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

export default WatchedScroll;