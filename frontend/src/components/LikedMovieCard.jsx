import React from 'react';

const LikedMovieCard = ({ movie, onClick }) => {
  return (
    <div
      className="liked-movie"
      onClick={onClick}
    >
      <img src={movie.poster} alt={movie.title} />
    </div>
  );
};

export default LikedMovieCard;