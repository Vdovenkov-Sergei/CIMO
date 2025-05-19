import React from 'react';
import WatchedCard from './WatchedCard';

const WatchedScroll = ({ movies, onUnwatch }) => {
  return (
    <div className="movies-scroll">
      {movies.map(movie => (
        <WatchedCard 
          key={movie.id} 
          movie={movie} 
          onUnwatch={onUnwatch}
        />
      ))}
    </div>
  );
};

export default WatchedScroll;