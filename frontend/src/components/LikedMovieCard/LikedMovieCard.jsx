import React from 'react';
import './LikedMovieCard.scss';

const LikedMovieCard = ({ movie, onClick, is_matched }) => {
  return (
    <div className={`liked-movie ${is_matched ? 'matched' : ''}`} onClick={onClick}>
      <img 
        src={movie.poster_url || '/no-poster.png'} 
        alt={movie.name} 
        className="liked-movie__poster"
        onError={(e) => e.target.src = '/no-poster.png'}
      />
    </div>
  );
};

export default LikedMovieCard;