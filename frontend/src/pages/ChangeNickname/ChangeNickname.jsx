import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChangeNickname.scss';

const ChangeNickname = () => {
  const user = {
    avatar: 'src/assets/images/person-square.svg',
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  };

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="profile-page">
      {/* Хэдер (оставляем как было) */}
      <header className="header">
        <img src="./src/assets/images/CIMO_logo.svg" class="logo" alt="" />
        <div className="header__profile">
          <div className="profile-menu-container">
            {isProfileMenuOpen && (
              <ul className="profile-menu__list">
                <li><Link to="/profile">Профиль</Link></li>
                <li><Link to="/my-movies">Мои фильмы</Link></li>
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

      {/* Основная часть - полностью переписываем */}
      <main className="profile-main-nick container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={user.avatar} 
              alt="Аватар пользователя" 
              className="profile-avatar__image"
            />
          </div>
          <h2 className="profile-login">@{user.login}</h2>
        </div>

        <div className="change-nickname">
          <h2 className="change-nickname__title">Придумайте никнейм</h2>
          <p className="change-nickname__subtitle">Никнейм должен быть уникальным</p>

          <form className="form">
            <div className="form__group">
              <input 
                type="text" 
                placeholder="Никнейм" 
                className="form__input"
              />
            </div>

            <button type="submit" className="form__button">Сохранить</button>
          </form>
        </div>
      </main>

      {/* Футер (оставляем как было) */}
      <footer className="footer">
        <h2 className="footer__title">Наши контакты</h2>
        <a href="mailto:cinemood.corp@gmail.com" className="footer__email">cinemood.corp@gmail.com</a>
      </footer>
    </div>
  );
};

export default ChangeNickname;