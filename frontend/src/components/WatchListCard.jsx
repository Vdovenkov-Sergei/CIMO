import React from 'react';
import WatchButton from './WatchButton';
import DeleteButton from './DeleteButton';

const WatchlistCard = ({ movie, onWatch, onDelete }) => {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} className="movie-card__poster" />
      <h3 className="movie-card__title">{movie.title}</h3>
      <div className="movie-card__buttons">
        <WatchButton onClick={() => onWatch(movie.id)} />
        <DeleteButton onClick={() => onDelete(movie.id)} />
      </div>
    </div>
  );
};

export default WatchlistCard;