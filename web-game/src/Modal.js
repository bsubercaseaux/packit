import React from 'react';
import './App.css';
import closingButton from "./closebutton.png";



// const Modal = ({ isOpen, closeModal, children }) => {
  // if (!isOpen) {
    // return null;
  // }

const Modal = ({ isOpen, closeModal, children, size }) => {

  if (!isOpen) {
    return null;
  }

  // Define styles based on the size prop
  const modalStyles = {
    width: size === 'small' ? '30%' : '60%',
    height: size === 'small' ? '35%' : '70%',
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={modalStyles}>
        <div style={{display: "flex", justifyContent: "right", width: "100%"}}> 
        <button className="modal-close" onClick={closeModal}>
        <img src={closingButton} style={{width: 35, height: 35}}/>
        </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};


export default Modal;


