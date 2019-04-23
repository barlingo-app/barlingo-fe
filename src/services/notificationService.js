import axios from 'axios';
import { auth } from '../auth';

export const notificationService = {
    async findByUser() {
        return axios.get(process.env.REACT_APP_BE_URL + '/exchanges?userId=' + auth.getUserData().id)
            .then(
                (response) => {
                    return {
                        "title": "A hacker has broken our system",
                        "message": "Your data could have been in danger, but we killed the hacker.",
                        "priority": "HIGH"
                    }
                })
            .catch((error) => { return error; });

    },
}