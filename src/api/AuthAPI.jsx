import axios from 'axios';
import TokenManager from './TokenManager';

const AuthAPI = {
    login: (username, password) => {
        return axios.post('http://localhost:8080/tokens', { username, password })
            .then(response => response.data.accessToken)
            .catch(error => {
                throw error;
            });
    },
    verify2FA: (username, twoFactorCode) => {
        return axios.post('http://localhost:8080/mail', { username, twoFactorCode })
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    dashLogin:(username, password) => {
        return axios.post('http://localhost:8080/dashlogin', {username, password})
            .then(response => response.data.accessToken)
            .then(accessToken => TokenManager.setAccessToken(accessToken))
            .catch(error =>{
                throw error;
            })
    }
};

export default AuthAPI;
