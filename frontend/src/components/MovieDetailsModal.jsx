import React, { useEffect } from 'react';

const MovieDetailsModal = ({ movie, onClose, onSwipeLeft, onSwipeRight }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        onSwipeLeft?.();
        onClose();
      } else if (e.key === 'ArrowRight') {
        onSwipeRight?.();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSwipeLeft, onSwipeRight]);

  if (!movie) return null;

  const formatList = (items) => {
    if (!Array.isArray(items) || items.length === 0) return '–';
    return items.map((item, index) => (
      <span key={index}>
        {item.name || item}
        {index < items.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  const formatValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return '–';
    }
    return value;
  };

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-scroll">
        <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
          <div className="detail-content">
            <div className="detail-info">
              <h2>{formatValue(movie.name)}</h2>
              <div className="detail-meta">
                <div className="meta-item">
                  <div className="meta-label">КиноПоиск:</div>
                  <div className="meta-value">{formatValue(movie.rating_kp)}</div>

                  <div className="meta-label">IMDB:</div>
                  <div className="meta-value">{formatValue(movie.rating_imdb)}</div>

                  <div className="meta-label">Жанр:</div>
                  <div className="meta-value wrap-text">{formatList(movie.genres)}</div>

                  <div className="meta-label">Страны:</div>
                  <div className="meta-value wrap-text">{formatList(movie.countries)}</div>

                  <div className="meta-label">Год выпуска:</div>
                  <div className="meta-value">{formatValue(movie.release_year)}</div>

                  <div className="meta-label">Продолжительность:</div>
                  <div className="meta-value">{formatValue(movie.runtime)} мин</div>

                  <div className="meta-label">Возрастные ограничения:</div>
                  <div className="meta-value">{formatValue(movie.age_rating)}</div>
                </div>
              </div>
            </div>
            <div className="detail-poster">
              <img src={movie.poster_url || ''} alt={movie.name || 'poster'} />
            </div>
          </div>
          <div className="detail-description">
            <p>{formatValue(movie.description)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;