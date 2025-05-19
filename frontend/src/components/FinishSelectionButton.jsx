import React from 'react';

const FinishSelectionButton = ({ onClick }) => {
  return (
    <button className="secondary-btn" onClick={onClick}>
      Завершить подбор
    </button>
  );
};

export default FinishSelectionButton;