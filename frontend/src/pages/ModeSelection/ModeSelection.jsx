import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ModeSelection.scss';

const ModeSelection = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="mode-selection-page">
      {/* Хэдер */}
      <header className="header">
        <img src="./src/assets/images/CIMO_logo.svg" class="logo" alt="" />
        <div className="header__profile">
          <div className="profile-menu-container">
            {isProfileMenuOpen && (
              <ul className="profile-menu__list">
                <li><Link to="/profile">Профиль</Link></li>
                <li><Link to="/my-movies">Мои фильмы</Link></li>
                <li><Link to="/settings">Настройки</Link></li>
                <li><Link to="/">Выход</Link></li>
              </ul>
            )}
            <div 
              className="profile-icon"
              onClick={toggleProfileMenu}
            >
              <img 
                src="src/assets/images/person-square.svg" 
                alt="Профиль" 
                className="profile-icon__image"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Основная часть */}
      <main className="main-content-modes container">
        <h2 className="main-title">Хотите подобрать фильм?</h2>
        
        <div className="modes-container">
          {/* Одиночный режим */}
          <div className="mode-card">
            <h3 className="mode-card__title">Одиночный режим</h3>
            <p className="mode-card__description">
              Данный режим позволяет осуществлять подбор фильмов под Ваше настроение и предпочтения.
            </p>
            <div className="mode-card__image">
              <img src="src/assets/images/mode1.png" alt="" />
            </div>
            <a href="" className="mode-card__button">Начать одиночную сессию</a>
          </div>

          {/* Парный режим */}
          <div className="mode-card">
            <h3 className="mode-card__title">Парный режим</h3>
            <p className="mode-card__description">
              Парный режим помогает подобрать фильмы для совместного просмотра исходя из предпочтений в паре.
            </p>
            <div className="mode-card__image">
              <img src="src/assets/images/mode2.png" alt="" />
            </div>
            <a href="" className="mode-card__button">Начать парную сессию</a>
          </div>
        </div>
      </main>

      {/* Футер */}
      <footer className="footer">
        <h2 className="footer__title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer__email">cinemood.corp@gmail.com</a>
      </footer>
    </div>
  );
};

export default ModeSelection;