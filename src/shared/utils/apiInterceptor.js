export const createDirtyFetch = (originalFetch) => {
    return async (url, options) => {
        // 1. Simulamos un retraso aleatorio (Race Conditions)
        const delay = Math.floor(Math.random() * 1900) + 100;
        await new Promise(resolve => setTimeout(resolve, delay));

        // 2. Simulamos una caída de red aleatoria (10% de las veces)
        if (Math.random() < 0.1) {
            throw new Error("Simulación: Fallo de conexión en la red.");
        }

        // Si sobrevive, ejecuta el fetch real
        return originalFetch(url, options);
    };
};