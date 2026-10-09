import { HttpClient } from "./shared/infrastructure/HttpClient.js";
import { LocalFavRepository } from './features/user/infrastructure/LocalFavRepository.js';
import { ApiUserRepository } from './features/user/infrastructure/ApiUserRepository.js';
import { UserSearchService } from './features/user/application/UserSearchService.js';
import { initUserUI } from './features/user/ui/UserController.js';


document.addEventListener('DOMContentLoaded', () => {
    try {
        //Get the real DOM nodes
        const dom = {
            input: document.getElementById('search'),
            results: document.getElementById('results')
        }

        //Creating infrastructure instances
        const favRepo = new LocalFavRepository();
        const userRepo = new ApiUserRepository(HttpClient, favRepo);

        //Instantiating the app layer
        const userService = new UserSearchService(favRepo, userRepo,)

        //Initialazing the UI with its service and dom;
        initUserUI(userService, dom);
    } catch (error) {
        console.error("[Main Error]: ", error);
        document.body.innerHTML = '<h2>Application failed to Load.</h2>'

    }
});


// const users = await HttpClient('https://jsonplaceholder.typicode.com/users');
// console.log(users);