import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CimoLogo from '../assets/images/CIMO_logo.svg';
import ProfileIcon from '../assets/images/person-square.svg';

const Header = () => {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/');
        throw new Error('Token refresh failed');
      }
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      navigate('/');
      throw error;
    }
  };

  const fetchWithTokenRefresh = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail === "Token expired") {
          await refreshToken();
          const retryResponse = await fetch(url, {
            ...options,
            credentials: 'include',
          });
          if (!retryResponse.ok) {
            navigate('/');
            throw new Error('Request failed after token refresh');
          }
          return retryResponse;
        }
        throw new Error(errorData.detail || 'Request failed');
      }
      return response;
    } catch (error) {
      if (error.message === 'Token refresh failed') {
        navigate('/');
      }
      throw error;
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetchWithTokenRefresh('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

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