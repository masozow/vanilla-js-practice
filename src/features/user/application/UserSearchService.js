// export class UserSearchService {
//     static #error_prefix = '[Application Error]: UserSearchService. ';
//     #throw_error(message) {
//         throw new Error(`${UserSearchService.#error_prefix}${message}`);
//     }
//     #log_error(message) {
//         console.error(UserSearchService.#error_prefix, message);
//     }
//     constructor(userRepo, favRepo) {
//         // 1. FAIL FAST: Prevents the app from running if key dependencies are missing.
//         if (!userRepo || !favRepo) throw new Error("Service error: Repos required");

//         this.userRepo = userRepo;
//         this.favRepo = favRepo;

//         // 2. RACE CONDITIONS: Counter to generate unique tickets per request.
//         this.currentReqId = 0;

//         // 3. EARLY RETURN / BASIC CACHE: Stores the last searched term.
//         this.lastQuery = '';

//         // 4. OBSERVER PATTERN: Uses a Set to avoid duplicate subscriptions.
//         this.listeners = new Set();

//         // 5. CENTRALIZED STATE: Single source of truth for the UI.
//         this.state = {
//             users: [],
//             isLoading: false,
//             isError: false
//         };
//     }

//     subscribe(listener) {
//         // FAIL FAST: Protects the observer contract.
//         if (typeof listener !== 'function') throw new Error("Service Error: Listener must be a function");

//         this.listeners.add(listener); //Adds the listener to our registry
//         listener(this.state); // Emits the initial state upon subscription
//         return () => this.listeners.delete(listener); // Returns clean-up function
//     }

//     #notify() {
//         this.listeners.forEach(listener => listener(this.state));
//     }

//     async search(query) {
//         const normalizedQuery = query.trim();

//         // EARLY RETURN: If it's the exact same search, abort to save network and render cycles.
//         if (this.lastQuery === normalizedQuery) return;

//         this.lastQuery = normalizedQuery;

//         // Generate a unique ticket for this specific request
//         const reqId = ++this.currentReqId;

//         this.state.isLoading = true;
//         this.state.isError = false;
//         this.#notify();

//         try {
//             // AWAIT: Execution pauses here. The user might type something new while we wait.
//             const users = await this.userRepo.search(normalizedQuery);

//             // RACE CONDITION CHECK: After awaiting, check if this ticket is still the latest one.
//             if (reqId !== this.currentReqId) return;

//             this.state.users = users;
//             this.state.isLoading = false;
//             this.#notify();
//         } catch (error) {
//             console.error('[Application error]: UserSearchService. ', error);

//             // RACE CONDITION CHECK (Errors): Discard errors from outdated requests too.
//             if (reqId !== this.currentReqId) return;

//             this.state.isError = true;
//             this.state.isLoading = false;
//             this.#notify();
//         }
//     }

//     toggleFav(userId) {
//         // 1. Persistence logic
//         let favs = this.favRepo.getFavs(); //First we get the persisted favs
//         if (favs.includes(userId)) { //Then we look if the current userId is already Persisted
//             favs = favs.filter(id => id !== userId); //As we are toggling, we get the persisted favs without the current userId
//                                                      //So, we "toggle" the persisted state
//         } else {
//             favs.push(userId); //If the current userId isn't persisted, we add it to the temporal favs list
//         }
//         this.favRepo.setFavs(favs); // Actually saving favs into localStorage for persistency, with or without the current userId, according to it's toggle state
//                                     // We replace the whole favs array into localStorage, for immutability
//         // 2. In-memory state update
//         const user = this.state.users.find(user => user.id === userId); //We look into the in-memory state for the current user
//         if (user) user.toggleFavorite(); //If the user it's in local memory, we change it's individual fav state

//         // 3. UI Notification
//         this.#notify(); //Here we push any change into the listeners
//     }
// }

export class UserSearchService {
    static #error_prefix = '[Application error]: UserSearchService. ';
    #throw_error(message) {
        throw new Error(`${UserSearchService.#error_prefix}${message}`);
    }
    #log_error(message) {
        console.error(UserSearchService.#error_prefix, message);
    }
    constructor(favRepo, userRepo) {
        if (!favRepo || !userRepo) this.#throw_error("Repos are required.");
        this.favRepo = favRepo;
        this.userRepo = userRepo;

        this.currentReqId = 0;
        this.lastQuery = '';
        this.listeners = new Set();

        this.state = {
            isLoading: false,
            isError: false,
            users: []
        }
    }

    subscribe(listener) {
        if (typeof listener !== 'function') this.#throw_error("Listener must be a function.");

        this.listeners.add(listener);
        listener(this.state);
        return () => this.listeners.delete(listener);
    }

    #notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    async search(query) {
        if (typeof query !== 'string') this.#throw_error("Query must be a string.");

        const normalizedQuery = query.trim();

        if (this.lastQuery === normalizedQuery) return;
        this.lastQuery = normalizedQuery;

        const reqId = ++this.currentReqId;

        this.isLoading = true;
        this.isError = false;
        this.#notify();
        try {
            const users = await this.userRepo.search(normalizedQuery);
            if (this.currentReqId !== reqId) return;

            this.state.users = users;
            this.isLoading = false;
            this.isError = false;
            this.#notify();
        } catch (error) {
            this.#log_error(error);
            if (this.currentReqId !== reqId) return;
            this.isError = true;
            this.isLoading = false;
            this.#notify();
        }
    }

    toggleFav(userId) {
        if (!userId) this.#throw_error("UserId is required");
        let favs = this.favRepo.getFavs();
        if (favs.includes(userId)) {
            favs = favs.filter(id => id !== userId);
        } else {
            favs.push(userId);
        }
        this.favRepo.setFavs(favs);

        const user = this.state.users.find(user => user.id === userId);
        if (user) user.toggleFav();

        this.#notify();
    }
}