import axios from 'axios';
import { auth } from '../auth';

export const exchangesService = {

    // List of languages exchanges
    async list(estId) {
        let param = estId ? "?estId=" + estId : "";
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges/' + param)
            .then(
                (response) => {
                    return response.data;
                })
            .catch((error) => { return error; });
    },
    async findByUser() {
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges?userId=' + auth.getUserData().id)
            .then(
                (response) => {
                    return response.data;
                })
            .catch((error) => { return error; });
    },
    async findOne(id) {
        id = id ? id : 0;
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges/' + id)
        .then((response) => {return response.data;})
        .catch((error) => { return error; });
    },
    async create(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/exchanges', data, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
            .catch((error) => { return error; });
        });
    },
    async join(id) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/exchanges/' + id + '/join', { 'userId': auth.getUserData().id }, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => { return response; })
            .catch((error) => { return error; });
        });
    },
    async leave(id) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/exchanges/' + id + '/leave', { 'userId': auth.getUserData().id }, 
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => { return response; })
            .catch((error) => { return error; });
        });
    }
}