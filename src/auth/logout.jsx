
// this function maps an element to logout on click
// use in a element <element style="" {...Logout()}>dsmlkhfd</element>

export function handleLogout(){
  sessionStorage.clear();
  // redirect to login
  window.location.replace("/login");
}

function Logout() {

  return {onClick: handleLogout }
}

export default Logout
