import axios from 'axios';
import { auth } from '../auth';

export const adminService = {

    async findById(id) {
        return auth.getToken()
        .then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/admins/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then((response) => { return response; })
            .catch((error) => { return error });
        });
    }

}