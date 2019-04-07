import axios from 'axios';
import { auth } from '../auth';

export const exchangesService = {

    // List of languages exchanges
    list(estId) {
        let param = estId ? "?estId=" + estId : "";
        let data;
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges/' + param)
            .then(
                (response) => {
                    return response.data;
                })
            .catch((error) => { return error; });
    },
    findByUser() {
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges?userId=' + auth.getUserData().id)
            .then(
                (response) => {
                    return response.data;
                })
            .catch((error) => { return error; });
    },
    findOne(id) {
        id = id ? id : 0;
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges/' + id)
            .then(
                (response) => {
                    return response.data;
                })
            .catch((error) => { return error; });
    },
    create(data) {
        return axios.post(process.env.REACT_APP_BE_URL + '/exchanges', data, {
            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
                'Content-Type': 'application/json'
            }
        }).then(response => { return response; }).catch((error) => { return error; });
    },
    join(id) {
        return axios.post(process.env.REACT_APP_BE_URL + '/exchanges/' + id + '/join', { 'userId': auth.getUserData().id }, {
            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
                'Content-Type': 'application/json'
            }
        }).then(response => { return response; }).catch((error) => { return error; });
    },
    leave(id) {
        return axios.post(process.env.REACT_APP_BE_URL + '/exchanges/' + id + '/leave', { 'userId': auth.getUserData().id }, {
            headers: {
                'Authorization': 'Bearer ' + auth.getToken(),
                'Content-Type': 'application/json'
            }
        }).then(response => { return response; }).catch((error) => { return error; });
    }
}