import { jwtDecode } from "jwt-decode";


const TokenManager = {
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
    getAccessToken: () => localStorage.getItem("accessToken"),
    clear: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("claims");
    }
}

export default TokenManager;