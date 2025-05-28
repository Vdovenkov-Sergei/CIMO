import React, { useState } from 'react';
import PairModal from './PairModal/PairModal';

const PairModeCard = ({
  title = "Парный режим",
  description = "Парный режим помогает подобрать фильмы для совместного просмотра исходя из предпочтений в паре.",
  imageSrc = "src/assets/images/mode2.png",
  buttonText = "Парная сессия",
  inviteLink,
  copyIconUrl = "src/assets/images/copy-icon.svg",
  onStartSession,
  onCancelSession,
  onConfirmSession
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    if (onStartSession) {
      onStartSession(() => setIsModalOpen(true));
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (onConfirmSession) {
      onConfirmSession();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onCancelSession) {
      onCancelSession();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    console.log('Ссылка скопирована:', inviteLink);
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