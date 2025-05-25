import React from 'react';
import checkIconUrl from '../assets/images/check-circle.svg';

const CheckControlButton = ({ onClick }) => {
  return (
    <button className="action-btn like" onClick={onClick}>
      <img src={checkIconUrl} alt="Like" />
    </button>
  );
};

export default CheckControlButton;