// Clase base genérica para manejar estado asíncrono y el Patrón Observador
// @ts-check
/**
 * @typedef {Object} StoreState
 * @property {Array<any>} data
 * @property {boolean} isLoading
 * @property {boolean} isError
 * @property {string|null} error
 */
export class AsyncStore {
    // Set privado para guardar todas las funciones suscriptoras de la UI
    #listeners = new Set();


    /** El constructor recibe los datos iniciales con los que arrancará el estado (ej: [] o null)
     * @param {any} initialData 
     */
    constructor(initialData = null) {
        /**Estado reactivo centralizado
        @type {StoreState} */
        this.state = {
            isLoading: false, // Indica si hay una petición HTTP en progreso
            isError: false,   // Indica si la última petición falló
            error: null,      // Guarda el mensaje o detalle del error
            data: initialData // Guarda la información resultante
        };
    }

    /**
     * Registra una función de la UI para avisarle cuando el estado cambie
     * @param {function(StoreState): void} listener - Callback que recibe el estado actual
     * @returns {function(): void} Función para desuscribirse
     */
    subscribe(listener) {
        this.#listeners.add(listener);
        // Devuelve una función para cancelar la suscripción y evitar fugas de memoria
        return () => this.#listeners.delete(listener);
    }

    // Notifica a todas las funciones registradas enviándoles una copia del estado actual
    notify() {
        this.#listeners.forEach(listener => listener(this.state));
    }


    /**
     * Ejecuta cualquier función asíncrona gestionando el ciclo de vida de carga y error automáticamente
     * @param {function(): Promise<any>} asyncTask - Tarea asíncrona a ejecutar (ej: () => fetch(...))
     * @returns {Promise<any>} El resultado devuelto por asyncTask
     */
    async runAsync(asyncTask) {
        // 1. Marcamos el inicio del proceso asíncrono
        this.state.isLoading = true;
        this.state.isError = false;
        this.state.error = null;
        this.notify(); // Avisamos a la UI para que ponga el spinner

        try {
            // 2. Ejecutamos la tarea recibida (ej: llamada a la API)
            const result = await asyncTask();

            // 3. Si la tarea fue exitosa, guardamos la data y apagamos la carga
            this.state.data = result;
            this.state.isLoading = false;
            this.notify(); // Avisamos a la UI para que renderice los resultados
            return result;
        } catch (err) {
            // 4. Si ocurrió un fallo, guardamos el error
            const error = err instanceof Error ? err : new Error(String(err));
            this.state.isError = true;
            this.state.error = error.message || 'Error inesperado';
            this.state.isLoading = false;
            this.notify(); // Avisamos a la UI para que muestre la vista de error
            throw err;
        }
    }
}

//Aplicando estse store, el service debería qeudar así:
// export class UserSearchService extends AsyncStore {
//     async search(query) {
//         // Hereda toda la lógica de carga, error y race-conditions
//         this.execute(() => this.userRepo.search(query));
//     }
// }