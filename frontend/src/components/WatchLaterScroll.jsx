import React from 'react';
import WatchLaterCard from './WatchLaterCard';

const WatchLaterScroll = ({ movies, onToggleWatchLater }) => {
  return (
    <div className="movies-scroll">
      {movies.map(movie => (
        <WatchLaterCard 
          key={movie.id} 
          movie={movie} 
          onToggleWatchLater={onToggleWatchLater}
        />
      ))}
    </div>
  );
};

export default WatchLaterScroll;