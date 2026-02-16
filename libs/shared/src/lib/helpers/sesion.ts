import { isTokenExpired } from "./jwt";

export function saveToken(token: string) {
    sessionStorage.setItem("access_token", token);
}

export function getToken() {
    const token = sessionStorage.getItem("access_token");
    if (!token) return null;
    if (isTokenExpired(token)) {
        clearSession();
        return null;
    }

    return token;
}

export function clearSession() {
    sessionStorage.clear();
}