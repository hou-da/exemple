import React from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';
import { connect } from 'react-redux';

import './ActiveUsersList.css';

const ActiveUsersList = ({ activeUsers, callState }) => {
  return (
    <div className='active_user_list_container'>
      {activeUsers.map((userId) =>
        <ActiveUsersListItem
          key={userId.socketId}
          userId={userId}
          callState={callState}
        />)}
    </div>
  );
};

const mapStateToProps = ({ dashboard, call }) => ({
  ...dashboard,
  ...call
});

export default connect(mapStateToProps)(ActiveUsersList);
