import { jwtDecode } from "jwt-decode";

const userData = {
    accessToken: undefined,
    claims: undefined
}

const TokenManager = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    getClaims: () => {
        if (!localStorage.getItem("claims")) {
            return undefined;
        }
        return JSON.parse(localStorage.getItem("claims"));
    },
    setAccessToken: (token) => {
        localStorage.setItem("accessToken", token);
        const claims = jwtDecode(token);
        localStorage.setItem("claims", JSON.stringify(claims));
        return claims;
    },
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("claims");
    }
}

export default TokenManager;