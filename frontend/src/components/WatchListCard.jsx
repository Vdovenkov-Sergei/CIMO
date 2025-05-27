import React from 'react';
import WatchButton from './WatchButton';
import DeleteButton from './DeleteButton';

const WatchlistCard = ({ movie, onWatch, onDelete, onCardClick }) => {
  return (
    <div className="movie-card">
      <img
        src={movie.poster_url}
        alt={movie.name}
        className="movie-card__poster"
        onClick={() => onCardClick(movie.id)}
        style={{ cursor: 'pointer' }}
        onError={(e) => {
          e.target.src = '/path-to-default-poster.jpg';
          e.target.onerror = null;
        }}
      />
      <h3 className="movie-card__title">{movie.name}</h3>
      <div className="movie-card__buttons">
        <WatchButton onClick={() => onWatch(movie)} />
        <DeleteButton onClick={() => onDelete(movie.id)} />
      </div>
    </div>
  );
};

export default WatchlistCard;