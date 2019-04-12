import axios from 'axios';
import { auth } from '../auth';

export const discountCodeService = {
    async getDiscountCode(exchangeId) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/userDiscount/user/show/' + exchangeId + "?userId=" + auth.getUserData().id, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },
    async validateCode(code) {
        return auth.getToken().then((token) => {
            return axios.get(process.env.REACT_APP_BE_URL + '/discounts?code=' + code, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },
    async redeem(code) {
        return auth.getToken().then((token) => {
            return axios.put(process.env.REACT_APP_BE_URL + '/discounts/' + code + '/redeem', {}, {
                headers: {
                    'Authorization': "Bearer " + token
                }
            })
                .then((response) => { return response; })
                .catch((error) => { return error });
        })
    },

}