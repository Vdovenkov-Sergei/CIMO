import React from 'react';

const ToggleWatchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="movie-button movie-button--primary"
      aria-label="Добавить в 'Посмотреть позже'"
    >
      <img src='/clock.svg' alt="" />
    </button>
  );
};

export default ToggleWatchButton;