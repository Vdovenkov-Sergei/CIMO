import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ModeSelection.scss';
import copyIconUrl from '../../../src/assets/images/copy.svg';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SingleModeCard from '../../components/SingleModeCard';
import PairModeCard from '../../components/PairModeCard';

const ModeSelection = () => {
  const [inviteLink] = useState('https://cinemood.app/invite/xyz123'); // Пример ссылки

  const handleStartSingleSession = () => {
    console.log('Одиночная сессия начата');
    // Здесь будет логика начала сессии
  };

  const handleStartPairSession = () => {
    console.log('Парная сессия начата');
    // Здесь будет логика начала парной сессии
  };

  return (
    <div className="mode-selection-page">
      <Header />

      {/* Основная часть */}
      <main className="main-content-modes container">
        <h2 className="main-title">Хотите подобрать фильм?</h2>
        
        <div className="modes-container">
          <SingleModeCard 
            onStartSession={handleStartSingleSession}
          />

          <PairModeCard 
            onStartSession={handleStartPairSession}
            inviteLink={inviteLink}
            copyIconUrl={copyIconUrl}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ModeSelection;
