import React, { useEffect, useRef } from 'react';
import WatchlistCard from './WatchListCard';

const WatchListScroll = ({ movies, onWatch, onDelete, loadMore, hasMore, onCardClick }) => {
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
        <WatchlistCard
          key={`watchlist-${obj.movie.id}`}
          movie={obj.movie}
          onWatch={() => onWatch(obj.movie)}
          onDelete={onDelete}
          onCardClick={() => onCardClick(obj.movie.id)}
        />
      ))}
    </div>
  );
};

export default WatchListScroll;