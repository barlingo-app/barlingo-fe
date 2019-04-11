import axios from 'axios';
import { userService } from './services/userService';

const AUTH_TOKEN_KEY = "authToken";
const USER_ID_KEY = "userId";
const USER_DATA_KEY = "userData";
const AUTHENTICATED_FLAG_KEY = "isAuthenticated";
const EXPIRATION_MOMENT_KEY = "expirationMoment";
const CREDENTIALS_KEY = "credentials";
const ROLE_KEY = "role";

const USER_ROLE = "ROLE_USER";
const ESTABLISMENT_ROLE = "ROLE_ESTABLISHMENT";
const ADMIN_ROLE = "ROLE_ADMIN";

export const auth = {

  _USER_ROLE: USER_ROLE,
  _ESTABLISMENT_ROLE: ESTABLISMENT_ROLE,
  _ADMIN_ROLE: ADMIN_ROLE,

  async login(username, password) {
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);

    return await axios.post(process.env.REACT_APP_BE_URL + '/users/signin', data,
      { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => { return { result: response.status === 200, data: response.data } })
      .catch(() => { return { result: false } });
  },

  isAuthenticated() {
    let authenticated = (localStorage.getItem(AUTHENTICATED_FLAG_KEY) === "true" || sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) === "true") && (this.getUserData() !== "" && this.getUserData() !== null);

    return authenticated;
  },

  isTokenExpired() {
    let currentMoment = Math.round(Date.now() / 1000);
    return (currentMoment >= this.getExpirationMoment());
  },

  isUser() {
    return this.getRole() === USER_ROLE;
  },

  isEstablishment() {
    return this.getRole() === ESTABLISMENT_ROLE;
  },

  isAdmin() {
    return this.getRole() === ADMIN_ROLE;
  },

  async authenticate(username, password, token, remember = false) {
    (remember ? localStorage : sessionStorage).setItem(AUTHENTICATED_FLAG_KEY, "true");
    let tokenData = JSON.parse(atob(token.split(".")[1]));

    this.setToken(token);
    this.setUserId(tokenData.sub);
    this.setCredentials(username, password);
    this.setExpirationMoment(tokenData.exp);
    this.setRole(tokenData.auth[0].authority);

    return this.isAuthenticated();
  },

  logout() {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(USER_DATA_KEY);
    sessionStorage.removeItem(AUTHENTICATED_FLAG_KEY);
    sessionStorage.removeItem(EXPIRATION_MOMENT_KEY);
    sessionStorage.removeItem(CREDENTIALS_KEY);
    sessionStorage.removeItem(ROLE_KEY);

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTHENTICATED_FLAG_KEY);
    localStorage.removeItem(EXPIRATION_MOMENT_KEY);
    localStorage.removeItem(CREDENTIALS_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  setAuthenticationFlag(flag) {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(AUTHENTICATED_FLAG_KEY, flag);
    } else {
      localStorage.setItem(AUTHENTICATED_FLAG_KEY, flag);
    }
  },

  setExpirationMoment(expirationMoment) {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(EXPIRATION_MOMENT_KEY, expirationMoment);
    } else {
      localStorage.setItem(EXPIRATION_MOMENT_KEY, expirationMoment);
    }
  },

  getExpirationMoment() {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      return sessionStorage.getItem(EXPIRATION_MOMENT_KEY);
    } else {
      return localStorage.getItem(EXPIRATION_MOMENT_KEY);
    }
  },

  setRole(role) {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.setItem(ROLE_KEY, role);
    }
  },

  getRole() {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      return sessionStorage.getItem(ROLE_KEY);
    } else {
      return localStorage.getItem(ROLE_KEY);
    }
  },

  setCredentials(username, password) {
    let credentials = { username: username, password: password };
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(CREDENTIALS_KEY, btoa(JSON.stringify(credentials)));
    } else {
      localStorage.setItem(CREDENTIALS_KEY, btoa(JSON.stringify(credentials)));
    }
  },

  getCredentials() {
    let credentials = { username: null, password: null };
    let crendentialsToken = null;

    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      crendentialsToken = sessionStorage.getItem(CREDENTIALS_KEY);
    } else {
      crendentialsToken = localStorage.getItem(CREDENTIALS_KEY);
    }

    if (crendentialsToken !== null) {
      credentials = JSON.parse(atob(crendentialsToken));
    }

    return credentials;
  },

  setToken(token) {
    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  },

  async getToken() {
    if (this.isTokenExpired()) {
      return this.refreshToken().then(() => {
        if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
          return sessionStorage.getItem(AUTH_TOKEN_KEY);
        } else {
          return localStorage.getItem(AUTH_TOKEN_KEY);
        }
      });
    } else {
      if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
        return sessionStorage.getItem(AUTH_TOKEN_KEY);
      } else {
        return localStorage.getItem(AUTH_TOKEN_KEY);
      }
    }
  },

  setUserData(userData) {

    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  },

  getUserData() {
    let userData = null;

    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      userData = sessionStorage.getItem(USER_DATA_KEY);
    } else {
      userData = localStorage.getItem(USER_DATA_KEY);
    }

    if (userData === null) {
      return null;
    }

    return JSON.parse(userData);
  },

  setUserId(userId) {

    if (sessionStorage.getItem(AUTHENTICATED_FLAG_KEY) !== null) {
      sessionStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.setItem(USER_ID_KEY, userId);
    }
  },

  getUserId() {

    if (sessionStorage.getItem(USER_ID_KEY) !== null) {
      return sessionStorage.getItem(USER_ID_KEY);
    } else {
      return localStorage.getItem(USER_ID_KEY);
    }
  },

  async refreshToken() {
    return await this.login(this.getCredentials().username, this.getCredentials().password).then((loginResult) => {
      if (loginResult.result) {
        let tokenData = JSON.parse(atob(loginResult.data.split(".")[1]));
        this.setToken(loginResult.data);
        this.setExpirationMoment(tokenData.exp);
      } else {
        this.logout();
      }
    }).catch(() => this.logout());
  },

  async loadUserData() {
    return await userService.getUserByUsername(this.getUserId()).then((response) => {
      if (response.data === null || response.data === "") {
        this.logout();
        return false;
      } else {
        this.setUserData(response.data);
        this.setAuthenticationFlag("true");
        return true;
      }
    }).catch((error) => { this.logout(); return false; });
  }
};