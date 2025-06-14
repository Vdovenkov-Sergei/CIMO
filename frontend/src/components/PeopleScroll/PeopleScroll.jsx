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
      setShowLeftArrow(container.scrollLeft > 0);
      
      const isEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 50;
      setShowRightArrow(!isEnd);
      
      if (isEnd && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    handleScroll();
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore, people.length]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 150;
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