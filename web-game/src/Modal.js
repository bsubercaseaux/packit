import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{display: "flex", justifyContent: "right", width: "100%"}}> 
        <button className="modal-close" onClick={closeModal}>
         X 
        </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;