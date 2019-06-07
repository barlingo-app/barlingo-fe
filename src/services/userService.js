import axios from 'axios';
import { auth } from '../auth';

export const userService = {
    async findAll() {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/users/', {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },

    async findById(id) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/users/' + id, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },

    async getUserByUsername(username) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/users/username/' + username, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },

    async checkUsername(username) {
        return axios.get(process.env.REACT_APP_BE_URL + '/users/checkUsername?username=' + username)
            .then((response) => { return response; })
            .catch((error) => { return error });
    },

    async registerUser(data) {
        return axios.post(process.env.REACT_APP_BE_URL + '/users/register', data)
            .then((response) => { return response; })
            .catch((error) => { return error });
    },

    async anonymize() {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/users/' + auth.getUserData().id + '/anonymize', {}, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },

    async getPersonalData() {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/users/' + auth.getUserData().id + '/download', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },
    async editUserData(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/users/edit', data, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },
    async banUser(id) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/users/' + id + '/ban', {}, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },
    async assess(exchangedId, data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/assessments/' + exchangedId, data, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },

    async getAssessments(userId) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/assessments/' + userId, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },
}