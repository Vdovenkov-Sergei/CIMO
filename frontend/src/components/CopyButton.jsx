import React from 'react';
import PropTypes from 'prop-types';

const CopyButton = ({
  onClick,
  copyIconUrl,
  checkIconUrl,
  isCopied = false,
  ariaLabel = "Копировать ссылку",
  tooltipText = "Скопировано!",
  className = "copy",
  ...props
}) => {
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      <img 
        src={isCopied ? checkIconUrl : copyIconUrl} 
        alt="" 
        className="copy-button__icon" 
      />
      {isCopied && (
        <span className="copy-button__tooltip">{tooltipText}</span>
      )}
    </button>
  );
};

CopyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  copyIconUrl: PropTypes.string.isRequired,
  checkIconUrl: PropTypes.string.isRequired,
  isCopied: PropTypes.bool,
  ariaLabel: PropTypes.string,
  tooltipText: PropTypes.string,
  className: PropTypes.string,
};

export default CopyButton;