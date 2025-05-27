import React, { useState, useEffect } from 'react';
import './RateMovieModal.scss';

const RateMovieModal = ({ isOpen, onClose, onSubmit, movie, isLoading }) => {
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (movie?.review) {
      setRating(Number(movie.review));
    } else {
      setRating(5);
    }
  }, [movie]);

  if (!isOpen || !movie) return null;

  const handleSubmit = () => {
    onSubmit(rating);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Оцените фильм: {movie.name}</h2>
        <input
          type="range"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <div className="rating-display">Оценка: {rating}</div>
        <div className="modal-buttons">
          <button 
            onClick={onClose} 
            className="modal-buttons-cancel"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button 
            onClick={handleSubmit} 
            className="modal-buttons-save"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateMovieModal;