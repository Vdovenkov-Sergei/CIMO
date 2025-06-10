import React, { useEffect, useState, useCallback, useRef } from 'react';
import PeopleScroll from '../PeopleScroll/PeopleScroll';
import './MovieDetailsModal.scss'

const MovieDetailsModal = ({ movie, onClose, onSwipeLeft, onSwipeRight }) => {
  const [people, setPeople] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  const controllerRef = useRef(null);

  const loadMorePeople = useCallback(async () => {
    if (!movie?.id || isLoading || !hasMore) return;

    setIsLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(`/api/movie/roles/${movie.id}?limit=${limit}&offset=${offset}`, {
        credentials: 'include',
        signal: controller.signal
      });
      if (!res.ok) throw new Error('Failed to fetch roles');
      const data = await res.json();

      setPeople((prev) => [...prev, ...data]);
      setOffset((prev) => prev + data.length);
      if (data.length < limit) setHasMore(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [movie?.id, offset, isLoading, hasMore]);

  useEffect(() => {
    if (!movie?.id) return;
  
    setPeople([]);
    setOffset(0);
    setHasMore(true);
  }, [movie?.id]);
  
  useEffect(() => {
    if (!movie?.id || offset !== 0 || people.length > 0) return;
  
    loadMorePeople();
  }, [movie?.id, offset, people.length, loadMorePeople]);
  

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
    if (!value || (Array.isArray(value) && value.length === 0)) return '–';
    return value;
  };

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-scroll">
        <div className="movie-detail" onClick={(e) => e.stopPropagation()}>
          <h2>{formatValue(movie.name)}</h2>
          <div className="detail-content">
            <div className="detail-poster">
              <img src={movie.poster_url || '/no-poster.png'} alt={movie.name || 'poster'} />
            </div>
            <div className="detail-info">
              
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
                  <div className="meta-value">{formatValue(movie.runtime) === "–" ? "–" : `${movie.runtime} мин`}</div>

                  <div className="meta-label">Возрастные ограничения:</div>
                  <div className="meta-value">{formatValue(movie.age_rating) === "–" ? "–" : `${movie.age_rating}+`}</div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="detail-description">
            <p>{formatValue(movie.description)}</p>
          </div>

          {people.length > 0 && (
            <div className="detail-people-block">
              <PeopleScroll
                people={people}
                hasMore={hasMore}
                isLoading={isLoading}
                onLoadMore={loadMorePeople}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
