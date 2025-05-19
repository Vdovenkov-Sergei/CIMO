import React from 'react';
import clockIconUrl from '../assets/images/clock.svg';

const ToggleWatchLaterButton = ({ isWatchedLater, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`movie-button ${isWatchedLater ? 'movie-button--secondary' : 'movie-button--primary'}`}
      aria-label={isWatchedLater ? 'Убрать из "Посмотреть позже"' : 'Добавить в "Посмотреть позже"'}
    >
      <img src={clockIconUrl} alt="" />
      {isWatchedLater ? 'Убрать' : 'Отложить'}
    </button>
  );
};

export default ToggleWatchLaterButton;