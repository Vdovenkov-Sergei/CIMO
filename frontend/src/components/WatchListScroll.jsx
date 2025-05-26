import React from 'react';
import WatchlistCard from './WatchListCard';

const WatchListScroll = ({ movies, onWatch, onDelete }) => {
  return (
    <div className="movies-scroll">
      {movies.map(movie => (
        <WatchlistCard
          key={movie.id}
          movie={movie}
          onWatch={onWatch}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WatchListScroll;
