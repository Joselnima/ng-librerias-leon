export function decodeJWT(token: string) {
    try {
        const base = token.split(".")[1];
        const json = atob(base);

        return JSON.parse(json)

    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {

    const data = decodeJWT(token);
    if (!data || !data.exp) return true;

    const ahora = Math.floor(Date.now() / 1000);
    return data.exp < ahora;
}