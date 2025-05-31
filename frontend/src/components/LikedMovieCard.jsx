import React from 'react';

const LikedMovieCard = ({ movie, onClick }) => {
  return (
    <div className="liked-movie" onClick={onClick}>
      <img 
        src={movie.poster_url} 
        alt={movie.name} 
        className="liked-movie__poster"
        onError={(e) => {
          e.target.src = 'path-to-default-poster.jpg';
        }}
      />
    </div>
  );
};

export default LikedMovieCard;