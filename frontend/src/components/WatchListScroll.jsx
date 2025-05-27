import React, { useEffect, useRef, useState } from 'react';
import WatchlistCard from './WatchListCard';

const WatchListScroll = ({ movies, onWatch, onDelete, loadMore, hasMore, onCardClick }) => {
  const scrollRef = useRef();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = async () => {
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >= 
        scrollContainer.scrollWidth - 100 &&
        hasMore &&
        !isLoadingMore
      ) {
        setIsLoadingMore(true);
        await loadMore();
        setIsLoadingMore(false);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore, isLoadingMore]);

  return (
    <div className="movies-scroll" ref={scrollRef}>
      {movies.map((obj, index) => (
        <WatchlistCard
          key={`watchlist-${obj.movie.id}-${index}`}
          movie={obj.movie}
          onWatch={() => onWatch(obj.movie)}
          onDelete={onDelete}
          onCardClick={() => onCardClick(obj.movie.id)}
        />
      ))}
      {isLoadingMore && <div className="loading-more">Загрузка...</div>}
    </div>
  );
};

export default WatchListScroll;