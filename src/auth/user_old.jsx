export function getAccessToken() {
  return sessionStorage.getItem("access_token");
}

export function getRefreshToken() {
  return sessionStorage.getItem("refresh_token");
}

export function removeUserToken() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
}

export function setUserToken(refresh, access) {
  sessionStorage.setItem('refresh_token', refresh);
  sessionStorage.setItem('access_token', access);
}

export function isAuthenticated() {
  if (sessionStorage.getItem("access_token") && sessionStorage.getItem("refresh_token")) {
    return true;
  } else {
    return false;
  }
}
