import React from 'react';
import xIconUrl from '../assets/images/x-circle.svg';

const XControlButton = ({ onClick }) => {
  return (
    <button className="action-btn dislike" onClick={onClick}>
      <img src={xIconUrl} alt="Dislike" />
    </button>
  );
};

export default XControlButton;