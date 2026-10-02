import { baseApiUrl } from '../../../shared/dictionaries/ApiURLs';
import { User } from '../domain/User'
export class ApiUserRepository {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.endpoint = baseApiUrl + 'users';
    }

    async search(query) {
        if (!query.trim()) return [];

        return this.httpClient({
            url: 'https://jsonplaceholder.typicode.com/users',
            formatter: (data) => data
                .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
                .map(u => new User(u.id, u.name))
        });
    }
}