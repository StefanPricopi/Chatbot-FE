import { jwtDecode } from "jwt-decode";

const userData = {
    accessToken: undefined,
    claims: undefined
}

const TokenManager = {
    getClaims: () => {
        if (!userData.claims) {
            return undefined;
        }
        return userData.claims;
    },
    setAccessToken: (token) => {

        userData.accessToken = token;
        const claims = jwtDecode(token);
        userData.claims = claims;
        return claims;
    },
    getAccessToken: () => userData.accessToken,
    clear: () => {
        userData.accessToken = undefined;
        userData.claims = undefined;
    }
}

export default TokenManager;