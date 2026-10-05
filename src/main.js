import { HttpClient } from "./shared/infrastructure/httpClient.js";
import { LocalFavRespository } from "./features/user/infrastructure/LocalFavRepository.js";
import { ApiUserRepository } from "./features/user/infrastructure/ApiUserRepository.js";
import { UserSearchService } from "./features/user/application/UserSearchService.js";
import { initUserUI } from "./features/user/ui/UserController.js";

const favRepo = new LocalFavRespository();
const userRepo = new ApiUserRepository(HttpClient, favRepo);

const searchService = new UserSearchService(userRepo, favRepo);

initUserUI(searchService, {
    input: document.getElementById('search'),
    results: document.getElementById('results'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error')
})
const result = await HttpClient(
    { url: "https://jsonplaceholder.typicode.com/users" }
);
console.log(result);