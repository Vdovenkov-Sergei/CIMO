import React, { useRef, useEffect, useState } from 'react';
import PersonCard from '../PersonCard/PersonCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './PeopleScroll.scss';

const PeopleScroll = ({ people, hasMore, isLoading, onLoadMore }) => {
  const scrollRef = useRef();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Показываем левую стрелку если прокрутка не в начале
      setShowLeftArrow(container.scrollLeft > 0);
      
      // Показываем правую стрелку если не достигли конца
      const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 50;
      setShowRightArrow(!isEnd);
      
      // Загружаем больше если достигли конца и есть что загружать
      if (isEnd && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    // Инициализация состояния стрелок
    handleScroll();
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore, people.length]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 400; // Увеличим количество прокрутки
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="people-scroll-wrapper">
      {showLeftArrow && (
        <button 
          className="scroll-button left" 
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}
      
      <div className="people-scroll-container" ref={scrollRef}>
        <div className="people-scroll-content">
            {people.map((obj) => (
            <PersonCard 
                key={`${obj.person.id}-${obj.role}`} 
                personObj={obj} 
            />
            ))}
            {isLoading && (
            <div className="people-scroll-loading">
                <div className="loading-spinner"></div>
            </div>
            )}
        </div>
      </div>


      {showRightArrow && (
        <button 
          className="scroll-button right" 
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={isLoading}
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default PeopleScroll;