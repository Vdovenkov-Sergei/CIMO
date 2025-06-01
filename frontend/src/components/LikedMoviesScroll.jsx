import React from 'react';
import LikedMovieCard from './LikedMovieCard';

const LikedMoviesScroll = ({ movies }) => {
  return (
    <div className="liked-movies-scroll">
      {movies.map((movie) => (
        <LikedMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default LikedMoviesScroll;