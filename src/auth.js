const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";
const AUTHENTICATED_FLAG_KEY = "isAuthenticated";

export const auth = {
  isAuthenticated() {
    return localStorage.getItem(AUTHENTICATED_FLAG_KEY) === "true";
  },
  login(token) {
    console.log("doing login");
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    let userData = atob(token.split(".")[1]);
    localStorage.setItem(USER_DATA_KEY, userData);
    localStorage.setItem(AUTHENTICATED_FLAG_KEY, "true");
  },
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.setItem(AUTHENTICATED_FLAG_KEY, "false");
  },
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  getUserData() {
    let userData = localStorage.getItem(USER_DATA_KEY);

    if (userData === null) {
      return null;
    }

    return JSON.parse(localStorage.getItem(USER_DATA_KEY));
  }
};