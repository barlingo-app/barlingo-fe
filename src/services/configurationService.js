import axios from 'axios';

export const configurationService = {
    
    async getConfiguration() {
        return axios.get(process.env.REACT_APP_BE_URL + '/configuration')
        .then((response) => { return response; })
        .catch((error) => { return error });
    }
    

}