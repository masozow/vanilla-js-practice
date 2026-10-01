export const httpClient = async ({ url, method = "GET", formatter = null, fetcher = window.fetch }) => {
    try {
        const response = await fetcher(url, { method });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const rawData = await response.json();
        return formatter ? formatter(rawData) : rawData;
    } catch (error) {
        console.error("Error in httpClient:", error);
        throw error;
    }
}