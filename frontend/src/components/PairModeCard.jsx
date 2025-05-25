import React, { useState } from 'react';
import PairModal from './PairModal/PairModal'; // Предполагаем, что у вас есть компонент PairModal

const PairModeCard = ({
  title = "Парный режим",
  description = "Парный режим помогает подобрать фильмы для совместного просмотра исходя из предпочтений в паре.",
  imageSrc = "src/assets/images/mode2.png",
  buttonText = "Парная сессия",
  inviteLink = "https://example.com/invite/partner",
  copyIconUrl = "src/assets/images/copy-icon.svg",
  onStartSession
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    console.log('Ссылка скопирована:', inviteLink);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (onStartSession) {
      onStartSession();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mode-card">
        <h3 className="mode-card__title">{title}</h3>
        <p className="mode-card__description">{description}</p>
        <div className="mode-card__image">
          <img src={imageSrc} alt="Парный режим" />
        </div>
        <button 
          onClick={handleButtonClick} 
          className="mode-card__button"
        >
          {buttonText}
        </button>
      </div>

      <PairModal
        isOpen={isModalOpen}
        inviteLink={inviteLink}
        onCopyLink={handleCopyLink}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        copyIconUrl={copyIconUrl}
      />
    </>
  );
};

export default PairModeCard;