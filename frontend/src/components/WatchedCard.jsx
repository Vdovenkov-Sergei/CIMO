import React from 'react';
import UnwatchButton from './UnwatchButton';

const WatchedCard = ({ review, movie, onUnwatch, onClick, onCardClick }) => {
  return (
    <div className="movie-card">
      <img
        src={movie.poster_url}
        alt={movie.name}
        className="movie-card__poster"
        onClick={() => onCardClick(movie.id)}
        onError={(e) => {
          e.target.src = '/path-to-default-poster.jpg';
          e.target.onerror = null;
        }}
      />
      <h3 className="movie-card__title">{movie.name}</h3>
      {review && (
        <div className="movie-rating">
          <div className="rating-value" onClick={onClick}>{review}/10</div>
        </div>
      )}
      <div className="movie-card__buttons">
        <UnwatchButton onClick={() => onUnwatch(movie)} />
      </div>
    </div>
  );
};

export default WatchedCard;