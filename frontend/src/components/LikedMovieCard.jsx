import React from 'react';

const LikedMovieCard = ({ movie, onClick }) => {
  return (
    <div
      className="liked-movie"
      onClick={onClick}
    >
      <img src={movie.poster} alt={movie.title} />
      <h3 className="liked-movie__title">{movie.title}</h3>
    </div>
  );
};

export default LikedMovieCard;