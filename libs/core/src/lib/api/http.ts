export async function http(url: string, options: RequestInit = {}) {

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        throw json || { message: "Error en la solicitud" };
    }

    return json;
}