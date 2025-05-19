import React from 'react';

const LikedMovieCard = ({ movie }) => {
  return (
    <div className="liked-movie">
      <img src={movie.poster} alt={movie.title} />
    </div>
  );
};

export default LikedMovieCard;