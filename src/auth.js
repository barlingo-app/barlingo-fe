import axios from 'axios';

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
    let username = JSON.parse(atob(token.split(".")[1])).sub;
    console.log("username " + username);
    axios.get(process.env.REACT_APP_BE_URL + '/users/username/' + username).then(function(response) {
      if (response.data === null) {
        localStorage.setItem(AUTHENTICATED_FLAG_KEY, "false");
      } else {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
        localStorage.setItem(AUTHENTICATED_FLAG_KEY, "true");
      }
    }).catch(function(error) {
      localStorage.setItem(AUTHENTICATED_FLAG_KEY, "false");
    });

    return this.isAuthenticated();
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
  },
  loadUserData() {
    axios.get(process.env.REACT_APP_BE_URL + '/users/' + this.getUserData().id).then(function(response) {
      if (response.data === null) {
        localStorage.setItem(AUTHENTICATED_FLAG_KEY, "false");
      } else {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data));
        localStorage.setItem(AUTHENTICATED_FLAG_KEY, "true");
      }
    }).catch(function(error) {
      localStorage.setItem(AUTHENTICATED_FLAG_KEY, "false");
    });
  }
};