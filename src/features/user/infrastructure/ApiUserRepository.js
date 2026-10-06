import { BaseApiUrl } from "../../../shared/dictionaries/ApiURLs.js";
import { User } from "../domain/User.js";

export class ApiUserRepository {
    constructor(httpClient, favRepo) {
        if (typeof httpClient !== 'function') throw new Error("Infra error: HttpClient must be a function");
        if (!favRepo || typeof favRepo.getFavs != 'function') throw new Error("Infra error: Invalid instance of favRepo");

        this.httpClient = httpClient;
        this.favRepo = favRepo;
        this.endpoint = `${BaseApiUrl}/users`
    }

    async search(query) {
        if (typeof query !== 'string') throw new Error("Infra error: query must be a string");
        if (!query.trim()) return [];

        const rawData = this.httpClient(this.endpoint);
        const favs = this.favRepo.getFavs();

        return rawData.
            filter(user => user.name.toLowerCase().includes(query.toLowerCase())).
            map(user => new User(user.id, user.name, user.email, favs.includes(user.id)));
    }
}