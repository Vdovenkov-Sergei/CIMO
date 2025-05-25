import React from 'react';
import ToggleWatchLaterButton from './ToggleWatchLaterButton';
import WatchButton from './WatchButton';
import DeleteButton from './DeleteButton';

const WatchLaterCard = ({ movie, onToggleWatchLater, onWatch, onDelete, onClick }) => {
  return (
    <div
      className="movie-card"
      onClick={onClick}
    >
      <img src={movie.poster} alt={movie.title} className="movie-card__poster" />
      <h3 className="movie-card__title">{movie.title}</h3>
      <div className="movie-card__buttons">
        <ToggleWatchLaterButton 
          isWatchedLater={movie.watchedLater} 
          onClick={() => onToggleWatchLater(movie.id)}
        />
        <WatchButton onClick={() => onWatch(movie.id)} />
        <DeleteButton onClick={() => onDelete(movie.id)} />
      </div>
    </div>
  );
};

export default WatchLaterCard;