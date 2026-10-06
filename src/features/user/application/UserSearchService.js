// @ts-check

/**
 * @typedef {Object} IFavRepository
 * @property {function(): number[]} getFavs
 * @property {function(number[]): void} saveFavs
 */

/**
 * @typedef {Object} IUserRepository
 * @property {function(string): Promise<Array<any>>} search
 */


/**
 * Tipo específico para el estado actual de este servicio
 * @typedef {Object} UserSearchState
 * @property {Array<any>} users
 * @property {boolean} isLoading
 * @property {boolean} isError
 * @property {string} lastQuery
 */
export class UserSearchService {
    /**
     * @param {IUserRepository} userRepo
     * @param {IFavRepository} favRepo
     */
    constructor(userRepo, favRepo) {
        this.userRepo = userRepo;
        this.favRepo = favRepo;
        this.currentReqId = 0; //Control de Race Conditions
        this.listeners = new Set(); //Listado de suscriptores al Subject (mejor conocidos como "observadores")
        //Usamos set para no tener observers duplicados

        //Estado único de la Feature Usuarios
        /** @type {UserSearchState} */
        this.state = {
            users: [],
            isLoading: false,
            isError: false,
            lastQuery: ''
        };
    }

    //Método Subscribe para el patrón Observer:
    //Permite a la UI suscribire a los cambios de estado

    /**
       * Registra una función de la UI para avisarle cuando el estado cambie
       * @param {function(UserSearchState): void} listener - Callback que recibe el estado actual
       * @returns {function(): void} Función para desuscribirse
       */
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state); //Emite el estado inicial

        return () => this.listeners.delete(listener);
    }

    //Función privada donde se envía a cada listener u observer,
    //el estado actual de subject User
    #notify() {
        console.log("[State Transition]:", { ...this.state });
        this.listeners.forEach(listener => listener(this.state));
    }

    /**
     * Realiza la búsqueda de usuarios gestionando race conditions
     * @param {string} query
     * @returns {Promise<void>}
     */
    async search(query) {
        this.state.lastQuery = query;
        const reqId = ++this.currentReqId;

        //Reseteando estados y notificando
        //Dejamos en estado de carga porque vamos empezar una búsqueda,
        //luego limpiamos los errores porque es una nueva consulta
        this.state.isLoading = true;
        this.state.isError = false;
        this.#notify();

        try {
            //Realizamos la búsqueda
            const users = await this.userRepo.search(query);
            //Revisamos que el Id de nuestra petición sea el mismo,
            //para evitar pisar peticiones entre sí
            if (reqId !== this.currentReqId) return;
            this.state.users = users;
            this.state.isLoading = false;
            this.#notify();
        } catch (error) {
            console.error("Error at userSearchService: ", error);
            if (reqId !== this.currentReqId) return;

            this.state.isError = true;
            this.state.isLoading = false;
            this.#notify();
        }
    }

    /**
         * Alterna el estado de favorito de un usuario por su ID
         * @param {number} userId
         */
    toggleFav(userId) {
        let favs = this.favRepo.getFavs();
        if (favs.includes(userId)) favs = favs.filter(id => id !== userId);
        else favs.push(userId);
        this.favRepo.saveFavs(favs);

        const user = this.state.users.find(user => user.id === userId);
        if (user) user.toggleFavorite();

        this.#notify();
    }
}