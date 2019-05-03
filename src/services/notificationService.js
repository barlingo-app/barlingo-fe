import axios from 'axios';
import { auth } from '../auth';

export const notificationService = {
    async findByUser() {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/notifications', {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },
    async create(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/notifications', data, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },
    async markAsRead(id) {
        return auth.getToken().then((token) => {
            return axios.put(process.env.REACT_APP_BE_URL + '/notifications/' + id, {}, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    },
}