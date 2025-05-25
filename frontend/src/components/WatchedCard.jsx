import React from 'react';
import UnwatchButton from './UnwatchButton';

const WatchedCard = ({ movie, onUnwatch, onClick }) => {
  return (
    <div
      className="movie-card"
      onClick={onClick}
    >
      <img src={movie.poster} alt={movie.title} className="movie-card__poster" />
      <h3 className="movie-card__title">{movie.title}</h3>
      <div className="movie-card__buttons">
        <UnwatchButton onClick={() => onUnwatch(movie.id)} />
      </div>
    </div>
  );
};

export default WatchedCard;