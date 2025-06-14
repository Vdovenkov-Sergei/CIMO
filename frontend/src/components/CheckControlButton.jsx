import React from 'react';

const CheckControlButton = ({ onClick }) => {
  return (
    <button className="action-btn like" onClick={onClick}>
      <img src='/check-circle.svg' alt="Like" />
    </button>
  );
};

export default CheckControlButton;