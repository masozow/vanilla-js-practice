export class UserSearchService {
    constructor(userRepo, favRepo) {
        // 1. FAIL FAST: Prevents the app from running if key dependencies are missing.
        if (!userRepo || !favRepo) throw new Error("Service error: Repos required");

        this.userRepo = userRepo;
        this.favRepo = favRepo;

        // 2. RACE CONDITIONS: Counter to generate unique tickets per request.
        this.currentReqId = 0;

        // 3. EARLY RETURN / BASIC CACHE: Stores the last searched term.
        this.lastQuery = '';

        // 4. OBSERVER PATTERN: Uses a Set to avoid duplicate subscriptions.
        this.listeners = new Set();

        // 5. CENTRALIZED STATE: Single source of truth for the UI.
        this.state = {
            users: [],
            isLoading: false,
            isError: false
        };
    }

    subscribe(listener) {
        // FAIL FAST: Protects the observer contract.
        if (typeof listener !== 'function') throw new Error("Service Error: Listener must be a function");

        this.listeners.add(listener);
        listener(this.state); // Emits the initial state upon subscription
        return () => this.listeners.delete(listener); // Returns clean-up function
    }

    #notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    async search(query) {
        const normalizedQuery = query.trim();

        // 🔥 EARLY RETURN: If it's the exact same search, abort to save network and render cycles.
        if (this.lastQuery === normalizedQuery) return;

        this.lastQuery = normalizedQuery;

        // Generate a unique ticket for this specific request
        const reqId = ++this.currentReqId;

        this.state.isLoading = true;
        this.state.isError = false;
        this.#notify();

        try {
            // AWAIT: Execution pauses here. The user might type something new while we wait.
            const users = await this.userRepo.search(normalizedQuery);

            // 🔥 RACE CONDITION CHECK: After awaiting, check if this ticket is still the latest one.
            if (reqId !== this.currentReqId) return;

            this.state.users = users;
            this.state.isLoading = false;
            this.#notify();
        } catch (error) {
            console.error('Application error: search error at Service ->', error);

            // 🔥 RACE CONDITION CHECK (Errors): Discard errors from outdated requests too.
            if (reqId !== this.currentReqId) return;

            this.state.isError = true;
            this.state.isLoading = false;
            this.#notify();
        }
    }

    toggleFav(userId) {
        // 1. Persistence logic
        let favs = this.favRepo.getFavs();
        if (favs.includes(userId)) {
            favs = favs.filter(id => id !== userId);
        } else {
            favs.push(userId);
        }
        this.favRepo.saveFavs(favs); // Notando el uso de saveFavs en lugar de setFavs

        // 2. In-memory state update
        const user = this.state.users.find(user => user.id === userId);
        if (user) user.toggleFavorite();

        // 3. UI Notification
        this.#notify();
    }
}