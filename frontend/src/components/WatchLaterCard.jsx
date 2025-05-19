import React from 'react';
import ToggleWatchLaterButton from './ToggleWatchLaterButton';

const WatchLaterCard = ({ movie, onToggleWatchLater }) => {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} className="movie-card__poster" />
      <h3 className="movie-card__title">{movie.title}</h3>
      <div className="movie-card__buttons">
        <ToggleWatchLaterButton 
          isWatchedLater={movie.watchedLater} 
          onClick={() => onToggleWatchLater(movie.id)}
        />
      </div>
    </div>
  );
};

export default WatchLaterCard;