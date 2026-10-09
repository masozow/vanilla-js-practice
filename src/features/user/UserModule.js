import { HttpClient } from "../../shared/infrastructure/HttpClient.js";
import { LocalFavRepository } from "./infrastructure/LocalFavRepository.js";
import { ApiUserRepository } from "./infrastructure/ApiUserRepository.js";
import { UserSearchService } from "./application/UserSearchService.js";
import { initUserUI } from "./ui/UserController.js";

export const UserModule = () => {
    //Get dom dependencies
    const dom = {
        input: document.getElementById('search'),
        results: document.getElementById('results')
    }

    //Instantiating infra
    const favRepo = new LocalFavRepository();
    const userRepo = new ApiUserRepository(HttpClient, favRepo);

    //Instantiating application layer
    const userService = new UserSearchService(favRepo, userRepo);

    //Return the module public API
    return {
        init: () => {
            initUserUI(userService, dom)
        }
    }
}

