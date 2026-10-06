import { ApiUserRepository } from './infrastructure/ApiUserRepository.js';
import { UserSearchService } from './application/UserSearchService.js';
import { initUserUI } from './ui/userController.js';

// Exportamos una función que encapsula la construcción de ESTA feature
export const buildUserFeature = (httpClient, domContainer) => {
    const repo = new ApiUserRepository(httpClient);
    const service = new UserSearchService(repo);
    initUserUI(service, domContainer);
};