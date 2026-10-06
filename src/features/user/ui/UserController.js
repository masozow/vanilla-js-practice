import { debounce } from '../../../shared/utils/debounce.js';
import { UserCard } from './components/UserCard.js';

export const initUserUI = (userService, dom) => {
    const { input, results, loading, error } = dom;

    userService.subscribe((state) => {
        loading.classList.toggle('hidden', !state.isLoading);
        error.classList.toggle('hidden', !state.isError);
        results.innerHTML = '';
        const users = Array.isArray(state.data) ? state.data : [];
        console.log("Users: ", users);
        users.forEach(user => {
            const cardNode = UserCard(user, (id) => userService.toggleFav(id));
            results.appendChild(cardNode);
        })
    })

    input.addEventListener('input', debounce((e) => {
        userService.search(e.target.value);
    }, 500));
}