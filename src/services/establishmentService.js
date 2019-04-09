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
        .then((response) => {return response;})
        .catch((error) => { return error; });
    },
    async create(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/establishments', data, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
            .catch((error) => { return error; });
        });
    }

}