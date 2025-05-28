import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

const SwipeableMovieCard = ({ movie, onClick, onSwipe, className }) => {
  const constraintsRef = useRef(null);
  const [dragDirection, setDragDirection] = useState(null);
  
  if (!movie) return null;

  return (
    <motion.div 
      className="movie-card-container"
      ref={constraintsRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        className={`movie-card ${className}`}
        
        initial={{ opacity: 0, x: 1000 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          backgroundColor: dragDirection === 'right' ? 'rgba(0, 255, 0, 0.2)' : 
                          dragDirection === 'left' ? 'rgba(255, 0, 0, 0.2)' : 'transparent'
        }}
        exit={{ opacity: 0, x: -1000 }}
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={1.5}
        onDrag={(e, info) => {
          // Определяем направление движения
          if (info.offset.x > 50) {
            setDragDirection('right');
          } else if (info.offset.x < -50) {
            setDragDirection('left');
          } else {
            setDragDirection(null);
          }
        }}
        onDragEnd={(e, info) => {
          setDragDirection(null); // Сбрасываем подсветку после отпускания
          if (info.offset.x > 200) {
            onSwipe("right");
          } else if (info.offset.x < -200) {
            onSwipe("left");
          }
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 5000, damping: 100 }}
        style={{
          backgroundColor: 'transparent', // Начальный цвет
        }}
      >
        <img 
          onClick={onClick}
          src={movie.poster_url} 
          alt={movie.name} 
          className="movie-card__poster"
          onError={(e) => {
            e.target.src = '/path-to-default-poster.jpg';
            e.target.onerror = null;
          }}
        />
        <div className="movie-info">
          <h3 className="movie-card__title">{movie.name}</h3>
          <div className="movie-meta">
            <span>{movie.release_year}</span>
          </div>
        </div>
        
        {/* Индикаторы свайпа */}
        <motion.div 
          className="swipe-indicator right"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: dragDirection === 'right' ? 0.8 : 0,
            scale: dragDirection === 'right' ? 1.2 : 1
          }}
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '3rem',
            color: 'green',
            zIndex: 10,
          }}
        >
          👍
        </motion.div>
        
        <motion.div 
          className="swipe-indicator left"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: dragDirection === 'left' ? 0.8 : 0,
            scale: dragDirection === 'left' ? 1.2 : 1
          }}
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '3rem',
            color: 'red',
            zIndex: 10,
          }}
        >
          👎
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeableMovieCard;