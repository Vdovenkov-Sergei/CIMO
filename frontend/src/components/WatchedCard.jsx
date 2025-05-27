import React from 'react';
import UnwatchButton from './UnwatchButton';

const WatchedCard = ({ review, movie, onUnwatch, onClick }) => {
  return (
    <div className="movie-card">
      {/* Клик теперь только на изображении */}
      <img
        src={movie.poster_url}
        alt={movie.name}
        className="movie-card__poster"
        onClick={onClick}
      />
      <h3 className="movie-card__title">{movie.name}</h3>
      {review && (
        <div className="movie-rating">
          <div className="rating-stars">{"★".repeat(review)}</div>
          <div className="rating-value">{review}/10</div>
        </div>
      )}
      <div className="movie-card__buttons">
        <UnwatchButton onClick={() => onUnwatch(movie)} />
      </div>
    </div>
  );
};

export default WatchedCard;
