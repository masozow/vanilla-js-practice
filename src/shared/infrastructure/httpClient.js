export const HttpClient = async ({ url, method = "GET", body = null, headers = {} }) => {
    try {
        const config = { method, headers: { ...headers } };

        if (body) {
            config.body = JSON.stringify(body);
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await window.fetch(url, config);

        if (!response.ok) {
            throw new Error(`Http Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("[HttpClient Error]:", error);
        throw error;
    }
}