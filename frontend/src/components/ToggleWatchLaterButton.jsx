import React from 'react';
import clockIconUrl from '../assets/images/clock.svg';

const ToggleWatchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="movie-button movie-button--primary"
      aria-label="Добавить в 'Посмотреть позже'"
    >
      <img src={clockIconUrl} alt="" />
    </button>
  );
};

export default ToggleWatchButton;