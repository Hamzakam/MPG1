import React, { useState } from "react";
import "./Modal.css";
import Login from "../Login";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Home from "../../../Pages";


export default function Modal() {
  const [modal, setModal] = useState(true);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
  
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
          <IconButton size="big" className="close-modal" onClick={toggleModal}>
            <CloseIcon/>
          </IconButton>
          <Login/>
          </div>
        </div>
      )}
    </>
  );
}