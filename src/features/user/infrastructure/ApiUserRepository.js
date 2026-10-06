// import { baseApiUrl } from '../../../shared/dictionaries/ApiURLs.js';
// import { User } from '../domain/User.js';

// export class ApiUserRepository {
//     constructor(httpClient, favRepo) {
//         this.httpClient = httpClient;
//         this.favRepo = favRepo;
//         this.endpoint = `${baseApiUrl}/users`;
//     }

//     async search(query) {
//         if (!query.trim()) return [];

//         // 1. El httpClient hace su trabajo: traer la data en crudo usando el endpoint
//         const rawData = await this.httpClient({
//             url: this.endpoint,
//             method: 'GET'
//         });

//         // 2. Traemos los favoritos de la otra fuente de datos
//         const favs = this.favRepo.getFavs();

//         // 3. El Repositorio hace SU trabajo: transformar JSON a Entidades de Dominio
//         return rawData
//             .filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
//             .map(u => new User(u.id, u.name, favs.includes(u.id)));
//     }
// }
import { baseApiUrl } from '../../../shared/dictionaries/ApiURLs.js';
import { User } from '../domain/User.js';

export class ApiUserRepository {
    constructor(httpClient, favRepo) {
        this.httpClient = httpClient;
        this.favRepo = favRepo;
        this.endPoint = `${baseApiUrl}/users`
    }
    async search(query) {
        if (!query.trim()) return [];

        const rawData = await this.httpClient({
            url: this.endPoint,
            method: 'GET'
        })

        const favs = this.favRepo.getFavs();

        return rawData.
            filter(user => user.name.toLowerCase().includes(query.toLowerCase())).
            map(user => new User(user.id, user.name, user.email, favs.includes(user.id)));
    }
}