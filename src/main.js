// Captura errores sincrónicos no atrapados
window.addEventListener('error', (event) => {
    showDevErrorOverlay(`[Runtime Error]: ${event.message} (${event.filename}:${event.lineno})`);
});

// Captura Promesas rechazadas no atrapadas (ej. HttpClient o AsyncStore)
window.addEventListener('unhandledrejection', (event) => {
    showDevErrorOverlay(`[Unhandled Promise Rejection]: ${event.reason}`);
});

// Función de utilidad para renderizar una alerta en pantalla si algo explota
function showDevErrorOverlay(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; padding: 16px;
        background: #ff0055; color: white; font-family: monospace;
        font-weight: bold; z-index: 99999; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;
    overlay.innerHTML = `⚠️️ APP CRASHED: ${message}`;
    document.body.prepend(overlay);
}

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
// 1. Shared Infrastructure layer test
const result = await HttpClient(
    { url: "https://jsonplaceholder.typicode.com/users" }
);
console.log('1. Result from shared infra: ', result);
//2. Domain infrastructure test
const usersFromRepo = await userRepo.search("Leanne");
console.log('2. Result from domain infra: ', usersFromRepo)


//Main usando el module en lugar de inicalizar todo por acá:
// import { httpClient } from './shared/infrastructure/httpClient.js';
// import { buildUserFeature } from './features/users/userModule.js';
// import { buildCartFeature } from './features/cart/cartModule.js';

// // Inicializamos solo lo que necesitamos según la página
// if (document.getElementById('users-page')) {
//     buildUserFeature(httpClient, document.getElementById('users-page'));
// }

// if (document.getElementById('cart-page')) {
//     buildCartFeature(httpClient, document.getElementById('cart-page'));
// }