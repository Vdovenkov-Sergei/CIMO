// WatchLaterCard.jsx
import React from 'react';
import ToggleWatchButton from './ToggleWatchLaterButton';
import WatchButton from './WatchButton';
import DeleteButton from './DeleteButton';

const WatchLaterCard = ({ movie, onToggleWatchLater, onWatch, onDelete, onClick }) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img src={movie.poster_url} alt={movie.name} className="movie-card__poster" />
      <h3 className="movie-card__title">{movie.name}</h3>
      <div className="movie-card__buttons">
        <ToggleWatchButton 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchLater(movie.id);
          }}
        />
        <WatchButton 
          onClick={(e) => {
            e.stopPropagation();
            onWatch(movie.id);
          }}
        />
        <DeleteButton 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(movie.id);
          }}
        />
      </div>
    </div>
  );
};

export default WatchLaterCard;