// src/components/AccessibleButton.js
import React from 'react';
import PropTypes from 'prop-types';

const AccessibleButton = ({ 
  onClick, 
  children, 
  ariaLabel, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`accessible-btn ${className}`}
      role="button"
    >
      {children}
    </button>
  );
};

AccessibleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default AccessibleButton;