import axios from 'axios';

const AuthAPI = {
    login: (username, password) => {
        return axios.post('http://localhost:8080/tokens', { username, password })
            .then(response => response.data)
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
    }
};

export default AuthAPI;
