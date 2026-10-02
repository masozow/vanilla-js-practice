// src/shared/infrastructure/httpClient.js (Versión Base Limpia)

export const httpClient = async ({ url, method = "GET", body = null, headers = {} }) => {
    try {
        const config = { method, headers };

        // Si hay un body, lo preparamos automáticamente
        if (body) {
            config.body = JSON.stringify(body);
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await window.fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[HttpClient error]:", error);
        throw error;
    }
};