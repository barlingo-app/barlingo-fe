import axios from 'axios';
import { auth } from '../auth';

export const userService = {
    async getUserByUsername(username) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/users/username/' + username, {
                headers : {
                    'Authorization': "Bearer " + token
                }
            })
            .then((response) => {return response;})
            .catch((error) => {return error});
        })
    },

    async checkUsername(username) {
        return axios.get(process.env.REACT_APP_BE_URL + '/users/checkUsername?username=' + username)
        .then((response) => {return response;})
        .catch((error) => {return error});
    },

    async registerUser(data) {
        return axios.post(process.env.REACT_APP_BE_URL + '/users/register', data)
        .then((response) => {return response;})
        .catch((error) => {return error});
    },

    async editUserData(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/users/edit', data, {
                headers : {
                    'Authorization': "Bearer " + token
                }
            })
            .then((response) => {return response;})
            .catch((error) => {return error});
        })
    }
}