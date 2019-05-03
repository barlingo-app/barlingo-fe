import axios from 'axios';
import { auth } from '../auth';
export const securityService = {
    async changePassword(data) {
        return auth.getToken().then((token) => {
            return axios.post(process.env.REACT_APP_BE_URL + '/security/secret', data, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(response => { return response; })
                .catch((error) => { return error; });
        });
    }
}