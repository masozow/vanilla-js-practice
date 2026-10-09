export const HttpClient = async (URL, options = {}) => {
    try {
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        }

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        const response = await fetch(URL, config);

        if (!response.ok) throw new Error(`[HttpClient error] Status ${response.status} at ${URL}`);

        return response.json();
    } catch (error) {
        console.error('[HttpClient error]: ', error);
        throw error;
    }
}