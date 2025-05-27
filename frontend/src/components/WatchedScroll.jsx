import React, { useEffect, useRef } from 'react';
import WatchedCard from './WatchedCard';

const WatchedScroll = ({ movies, onUnwatch, loadMore, hasMore, onCardClick, onRatingClick }) => {
  const scrollRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (
        scrollRef.current &&
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= 
        scrollRef.current.scrollWidth - 100 &&
        hasMore
      ) {
        loadMore();
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [loadMore, hasMore]);

  return (
    <div className="movies-scroll" ref={scrollRef}>
      {movies.map(obj => (
        <WatchedCard 
          review={obj.review}
          key={`watched-${obj.movie.id}`}
          movie={obj.movie} 
          onUnwatch={() => onUnwatch(obj.movie)}
          onClick={() => onRatingClick(obj)}
          onCardClick={() => onCardClick(obj.movie.id)}
        />
      ))}
    </div>
  );
};

export default WatchedScroll;
