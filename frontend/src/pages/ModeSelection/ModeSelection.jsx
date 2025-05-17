import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ModeSelection.scss';
import copyIconUrl from '../../../src/assets/images/copy.svg'

const ModeSelection = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);
  const [inviteLink] = useState('https://cinemood.app/invite/xyz123'); // Пример ссылки

  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleStartSingle = () => {
    setShowSingleModal(true);
  };

  const handleStartPair = () => {
    setShowPairModal(true);
  };

  const confirmSingle = () => {
    setShowSingleModal(false);
    navigate('/singleSession');
  };

  const confirmPair = () => {
    setShowPairModal(false);
    navigate('/pairSession');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="mode-selection-page">
      {/* Хэдер */}
      <header className="header">
        <img src="./src/assets/images/CIMO_logo.svg" className="logo" alt="" />
        <div className="header__profile">
          <div className="profile-menu-container">
            {isProfileMenuOpen && (
              <ul className="profile-menu__list">
                <li><Link to="/profile">Профиль</Link></li>
                <li><Link to="/myMovies">Мои фильмы</Link></li>
                <li><Link to="/">Выход</Link></li>
              </ul>
            )}
            <div className="profile-icon" onClick={toggleProfileMenu}>
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
            <button onClick={handleStartSingle} className="mode-card__button">
              Начать одиночную сессию
            </button>
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
            <button onClick={handleStartPair} className="mode-card__button">
              Начать парную сессию
            </button>
          </div>
        </div>
      </main>

      {/* Модалка: одиночная сессия */}
      {showSingleModal && (
        <div className="modal">
          <div className="modal__content">
            <h3>Начать подбор фильмов?</h3>
            <div className="modal__buttons">
              <button className="modal__buttons-cancel" onClick={() => setShowSingleModal(false)}>Отмена</button>
              <button className="modal__buttons-start" onClick={confirmSingle}>Начать</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка: парная сессия */}
      {showPairModal && (
        <div className="modal">
          <div className="modal__content">
            <h3>Пригласите партнёра</h3>
            <p>Отправьте ссылку для подключения:</p>
            <div className="invite-link-container">
              <input type="text" value={inviteLink} readOnly />
              <button className="copy" onClick={copyInviteLink}>
                <img src={copyIconUrl} alt="" />
              </button>
            </div>
            <div className="modal__buttons">
              <button className="modal__buttons-cancel" onClick={() => setShowPairModal(false)}>Отмена</button>
              <button className="modal__buttons-start" onClick={confirmPair}>Начать</button>
            </div>
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="footer">
        <h2 className="footer__title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer__email">cinemood.corp@gmail.com</a>
      </footer>
    </div>
  );
};

export default ModeSelection;
