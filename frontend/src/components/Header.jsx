import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CimoLogo from '../assets/images/CIMO_logo.svg';
import ProfileIcon from '../assets/images/person-square.svg';

const Header = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка выхода');
      }

      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
    } finally {
      closeProfileMenu();
    }
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
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Выход
                </a>
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