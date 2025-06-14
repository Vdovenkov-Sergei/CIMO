import React from 'react';

const XControlButton = ({ onClick }) => {
  return (
    <button className="action-btn dislike" onClick={onClick}>
      <img src='/x-circle.svg' alt="Dislike" />
    </button>
  );
};

export default XControlButton;