import axios from 'axios';
import { auth } from '../auth';

export const establishmentService = {
    // List of languages exchanges
    async list() {
        return axios.get(process.env.REACT_APP_BE_URL + '/establishments')
            .then(
                (response) => {
                    return response;
                })
            .catch((error) => { return error; });
    },

    async findOne(id) {
        id = id ? id : 0;
        return axios.get(process.env.REACT_APP_BE_URL + '/establishments/' + id)
            .then((response) => { return response; })
            .catch((error) => { return error; });
    },

    async create(data) {
        return axios.post(process.env.REACT_APP_BE_URL + '/establishments', data)
            .then(response => { return response; })
            .catch((error) => { return error; });
    },
    async anonymize() {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/establishments/' + auth.getUserData().id + '/anonymize', {}, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },
    async edit(data) {
        return auth.getToken().then((token) => {
            return axios.put(process.env.REACT_APP_BE_URL + '/establishments/' + auth.getUserData().id, data, {
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
            return axios.get(process.env.REACT_APP_BE_URL + '/establishments/' + auth.getUserData().id + '/download', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },

    async savePay(establishmentId, orderId) {
        return axios.post(process.env.REACT_APP_BE_URL + '/payments?estId=' + establishmentId + "&orderId=" + orderId, {})
            .then(response => { return response; })
            .catch((error) => { return error; });
    }

}