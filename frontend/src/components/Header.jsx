import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CimoLogo from '../assets/images/CIMO_logo.svg'; // Импорт логотипа
import ProfileIcon from '../assets/images/person-square.svg'; // Импорт иконки профиля

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="header">
      <img src={CimoLogo} className="logo" alt="CIMO Logo" />
      
      <div className="header__profile">
        <div className="profile-menu-container">
          {isProfileMenuOpen && (
            <ul className="profile-menu__list">
              <li>
                <Link to="/profile" onClick={closeProfileMenu}>Профиль</Link>
              </li>
              <li>
                <Link to="/myMovies" onClick={closeProfileMenu}>Мои фильмы</Link>
              </li>
              <li>
                <Link to="/" onClick={closeProfileMenu}>Выход</Link>
              </li>
            </ul>
          )}
          
          <div 
            className="profile-icon" 
            onClick={toggleProfileMenu}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
          >
            <img 
              src={ProfileIcon} 
              alt="Профиль" 
              className="profile-icon__image"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;