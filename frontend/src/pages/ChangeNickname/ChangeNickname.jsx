import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChangeNickname.scss';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProfileAvatar from '../../components/ProfileAvatar';
import ChangeNicknameForm from '../../components/changeNicknameForm';

const ChangeNickname = () => {
  const user = {
    avatar: 'src/assets/images/person-square.svg',
    login: 'cinemood_user',
    email: 'cinemood.corp@gmail.com'
  };

  const [showNicknameForm, setShowNicknameForm] = useState(false);

  const handleNicknameSubmit = async (newNickname) => {
    // Здесь будет логика обновления никнейма
    console.log('Новый никнейм:', newNickname);
    setShowNicknameForm(false);
  };

  return (
    <div className="change-nickname-page">
      <Header />

      <main className="profile-main-nick container">
        <div className="navigation">
          <Link to='/modeSelection' className="navigation__link">Главная страница</Link>
          <span className="delimeter">-</span>
          <Link to='/Profile' className="navigation__link">Профиль</Link>
          <span className="delimeter">-</span>
          <Link to='/changeNickname' className="navigation__link">Изменить никнейм</Link>
        </div>
        
        <ProfileAvatar login={user.login} />

        <ChangeNicknameForm
          currentNickname={user.login}
          onSubmit={handleNicknameSubmit}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ChangeNickname;