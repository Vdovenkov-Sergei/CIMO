import React from 'react';

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="detail-content">
          <div className="detail-info">
            <h2>{movie.name}</h2>
            <div className="detail-meta">
              <div className="meta-item">
                <div className="meta-label">КиноПоиск:</div>
                <div className="meta-value">{movie.rating_kp}</div>
                <div className="meta-label">IMDB:</div>
                <div className="meta-value">{movie.rating_imdb}</div>
                <div className="meta-label">Страны:</div>
                <div className="meta-value">{movie.countries}</div>
                <div className="meta-label">Год выпуска:</div>
                <div className="meta-value">{movie.release_year}</div>
                <div className="meta-label">Продолжительность:</div>
                <div className="meta-value">{movie.runtime} минут</div>
                <div className="meta-label">Возрастные ограничения:</div>
                <div className="meta-value">{movie.age_rating}</div>
              </div>
              {/* Остальные мета-данные */}
            </div>
          </div>
          <div className="detail-poster">
            <img src={movie.poster_url} alt={movie.title} />
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