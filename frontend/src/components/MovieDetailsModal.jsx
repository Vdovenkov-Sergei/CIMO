import React from 'react';

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="detail-content">
          <div className="detail-info">
            <h2>{movie.title}</h2>
            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">КиноПоиск:</span>
                <span className="meta-value">{movie.kpRating}</span>
              </div>
              {/* Остальные мета-данные */}
            </div>
          </div>
          <div className="detail-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
        </div>
        <div className="detail-description">
          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;