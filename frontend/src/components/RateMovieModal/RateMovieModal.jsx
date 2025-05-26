import React, { useState } from 'react';
import './RateMovieModal.scss';

const RateMovieModal = ({ isOpen, onClose, onSubmit, movie }) => {
  const [rating, setRating] = useState(5);

  if (!isOpen || !movie) return null;

  const handleSubmit = () => {
    onSubmit(movie.id, rating);
    setRating(5);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Оцените фильм: {movie.title}</h2>
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <div className="rating-display">Оценка: {rating}</div>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-buttons-cancel">Отмена</button>
          <button onClick={handleSubmit} className="modal-buttons-save">Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default RateMovieModal;
