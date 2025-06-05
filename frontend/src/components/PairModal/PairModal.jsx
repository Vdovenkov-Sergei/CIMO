import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PairModal.scss';
import checkIconUrl from '../../../src/assets/images/check.svg';
import CancelButton from '../CancelButton';
import StartButton from '../StartButton';
import CopyButton from '../CopyButton';
import Input from '../Input';

const PairModal = ({
  isOpen = false,
  inviteLink = '',
  onCopyLink,
  onCancel,
  onConfirm,
  copyIconUrl,
  title = 'Пригласите партнёра',
  description = 'Отправьте ссылку для подключения:',
  cancelText = 'Отмена',
  confirmText = 'Начать'
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopyLink();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="pair-modal">
      <div className="modal__content">
        <h3 className="modal__title">{title}</h3>
        <p className="modal__description">{description}</p>
        
        <div className="invite-link-container">
          <Input
            type="text"
            value={inviteLink}
            className="invite-link-input"
            readOnly
            onClick={(e) => e.target.select()}
          />
          <CopyButton
            onClick={handleCopy}
            copyIconUrl={copyIconUrl}
            checkIconUrl={checkIconUrl}
            isCopied={isCopied}
          />
        </div>

        <div className="modal__buttons">
          <CancelButton onClick={onCancel}>
            {cancelText}
          </CancelButton>

          <StartButton onClick={onConfirm}>
            {confirmText}
          </StartButton>
        </div>
      </div>
    </div>
  );
};

PairModal.propTypes = {
  isOpen: PropTypes.bool,
  inviteLink: PropTypes.string.isRequired,
  onCopyLink: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  copyIconUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string
};

export default PairModal;