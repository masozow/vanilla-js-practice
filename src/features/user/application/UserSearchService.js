export class UserSearchService {
    constructor(userRepo, favRepo) {
        this.userRepo = userRepo;
        this.favRepo = favRepo;
        this.currentReqId = 0; //Control de Race Conditions
        this.listeners = new Set(); //Listado de suscriptores al Subject (mejor conocidos como "observadores")
        //Usamos set para no tener observers duplicados

        //Estado único de la Feature Usuarios
        this.state = {
            users: [],
            isLoading: false,
            isError: false,
            lastQuery: ''
        };
    }

    //Método Subscribe para el patrón Observer:
    //Permite a la UI suscribire a los cambios de estado
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state); //Emite el estado inicial
    }

    //Función privada donde se envía a cada listener u observer,
    //el estado actual de subject User
    #notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

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
            if (reqId !== this.currentReqId) return;

            this.state.isError = true;
            this.state.isLoading = false;
            this.#notify();
        }
    }

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