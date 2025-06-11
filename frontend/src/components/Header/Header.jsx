import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CimoLogo from '/CIMO_logo.svg';
import ProfileIcon from '../../assets/images/person-square.svg';
import './Header.scss';
import { useAuthFetch } from '../../utils/useAuthFetch';

const Header = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const authFetch = useAuthFetch();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      navigate('/');
    } catch (err) {
      console.error('Ошибка выхода:', err);
    } finally {
      closeProfileMenu();
    }
  };

  return (
    <header className="header">
      <Link to="/modeSelection"><img src={CimoLogo} className="logo" alt="CIMO Logo" /></Link>
      
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
