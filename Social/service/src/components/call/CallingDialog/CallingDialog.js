import React from 'react';
import './CallingDialog.css';
import { hangUp } from '../../../utils/webRTC/webRTCHandler';
import { MdCallEnd } from 'react-icons/md';
import { useState } from 'react';


const styles = {
  buttonContainer: {
    marginTop: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '40px',
    border: '2px solid #282C34',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  }
};

const CallingDialog = () => {
  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  return (
    <div className='direct_calling_dialog background_secondary_color'>

      <span>Calling</span>
      <div style={styles.buttonContainer} onClick={handleHangUpButtonPressed}>
        <MdCallEnd style={{ width: '50px', height: '50px', fill: '#282C34'  }} />
      </div>
    </div>
  );
};

export default CallingDialog;
