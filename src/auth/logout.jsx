import React from 'react';

// this function maps an element to logout on click
// use in a element <element style="" {...Logout()}>dsmlkhfd</element>
function Logout(props) {

  const handleLogout = () => {
    sessionStorage.clear();
    // redirect to login
    window.location.replace("/login");
  }

  return {onClick: handleLogout }
}

export default Logout
