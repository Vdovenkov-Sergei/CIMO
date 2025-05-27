// WatchLaterScroll.jsx
import React from 'react';
import WatchLaterCard from './WatchLaterCard';

const WatchLaterScroll = ({ movies, onToggleWatchLater, onWatch, onDelete, onCardClick }) => {
  return (
    <div className="movies-scroll">
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
  );
};

export default WatchLaterScroll;