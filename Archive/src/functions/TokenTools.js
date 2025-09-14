
export function isLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }
    return true;
}

export function getToken() {
    return localStorage.getItem("token");
}

export function saveToken(tokenBody, email) {
    const currentTime = Date.now();
    localStorage.setItem("email", email);
    localStorage.setItem("token", tokenBody.token);
    localStorage.setItem("token_type", tokenBody.token_type);
    localStorage.setItem("expires_in", tokenBody.expires_in * 1000 + currentTime);
}

export function clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
}

export function tokenExpires() {
    const bearerToken = localStorage.getItem("token");
    if (!bearerToken) {
        return false;
    }
    const expires_in = localStorage.getItem("expires_in");
    return Date.now() >= expires_in;
}

