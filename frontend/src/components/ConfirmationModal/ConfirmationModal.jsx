import React from 'react';
import PropTypes from 'prop-types';
import './ConfirmationModal.scss';

const ConfirmationModal = ({
  isOpen = false,
  title = 'Вы уверены, что хотите закончить сессию?',
  cancelText = 'Отмена',
  confirmText = 'Закончить',
  children,
  onCancel,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal__content">
        <h3 className="confirmation-modal__title">{title}</h3>
        
        {children && <div className="confirmation-modal__body">{children}</div>}
        
        <div className="confirmation-modal__buttons">
          <button
            className='cancel'
            onClick={onCancel}
          >
            {cancelText}
          </button>
          
          <button
            className='confirm'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ConfirmationModal;