import React, { useEffect, useRef, useState } from 'react';
import WatchedCard from './WatchedCard';

const WatchedScroll = ({ movies, onUnwatch, loadMore, hasMore, onCardClick, onRatingClick }) => {
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
        <WatchedCard 
          review={obj.review}
          key={`watched-${obj.movie.id}-${index}`}
          movie={obj.movie} 
          onUnwatch={() => onUnwatch(obj.movie)}
          onClick={() => onRatingClick(obj)}
          onCardClick={() => onCardClick(obj.movie.id)}
        />
      ))}
      {isLoadingMore && <div className="loading-more">Загрузка...</div>}
    </div>
  );
};

export default WatchedScroll;