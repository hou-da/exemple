import React, {useContext, useState, useEffect } from 'react';
import * as webRTCHandler from '../../utils/webRTC/webRTCHandler';
import DirectCall from '../../components/call/DirectCall/DirectCall';
import ActiveUsersList from '../../components/call/ActiveUsersList/ActiveUsersList';
import { connect } from 'react-redux';
import { callStates } from '../../store/actions/callActions';
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

import './Dashboard.css';

const Dashboard = ({callState }) => {

  useEffect(() => {
    webRTCHandler.getLocalStream();
    //webRTCGroupHandler.connectWithMyPeer();
  }, []);

  return (
    <div className='dashboard_container background_main_color'>
      <div className='dashboard_left_section'>
        <div className='dashboard_content_container'>
          <DirectCall />
          {/* <GroupCall />
          {callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation username={username} />} */}
        </div>
        {/* <div className='dashboard_rooms_container background_secondary_color'>
          <GroupCallRoomsList />
        </div> */}
      </div>
       <div className='dashboard_right_section background_secondary_color'>
        <div className='dashboard_active_users_list'>
        
        </div>
         {/* <div className='dashboard_logo_container'>
          <img className='dashboard_logo_image' src={logo} alt='logo' />
        </div>  */}
      </div> 
      <footer> <small>&#9400; Copyright 2021, shubham khatal</small> </footer>
    </div>
  );
};

const mapStateToProps = ({ call, dashboard }) => ({
  ...call,
  ...dashboard
});

export default connect(mapStateToProps)(Dashboard);