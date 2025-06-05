import React from 'react';
import ToggleWatchButton from '../ToggleWatchLaterButton';
import DeleteButton from '../DeleteButton';
import './WatchLaterCard.scss'

const WatchLaterCard = ({ movie, onToggleWatchLater, onDelete, onClick, is_matched }) => {
  return (
    <div className="watch-later-movie-card" onClick={onClick}>
      <img src={movie.poster_url || '/no-poster.png'} alt={movie.name} className={`watch-later-movie-card__poster ${is_matched ? 'matched' : ''}`} />
      <h3 className="watch-later-movie-card__title">{movie.name}</h3>
      <div className="watch-later-movie-card__buttons">
        <ToggleWatchButton 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchLater(movie.id);
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