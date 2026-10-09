import { debounce } from '../../../shared/utils/debounce.js';
import { UserCard } from './components/UserCard.js';

export const initUserUI = (userService, dom) => {
    //We destructure the two dom elements we have at index.html,
    //the input and the results div, where all the app will live
    const { input, results } = dom;

    //Fail fast
    if (!input || !results) {
        throw new Error("[UI Error] UserController. DOM Nodes not found.");
    }

    // We subsribe to service so all state updates will be
    // visible at UI.
    userService.subscribe((state) => {
        //First we check for any failed or loading state
        //keeping the fail fast philosophy
        if (state.isLoading) {
            results.classList.remove('grid');
            results.innerHTML = '<p>Loading...</p>';
            return;
        }
        if (state.isError) {
            results.classList.remove('grid');
            results.innerHTML = '<p>Error fetching users</p>';
            return;
        }
        if (
            state.users.length === 0 &&
            input.value.trim() !== ''
        ) {
            results.classList.remove('grid');
            results.innerHTML = '<p>No users found.</p>';
            return;
        }
        if (state.users.length === 0) {
            results.classList.remove('grid');
            results.innerHTML = '';
            return;
        }

        //Success: we finally add the grid class and inject the templates
        results.classList.add('grid');
        results.innerHTML = state.users.map(user => UserCard(user)).join('');
    });

    //Add the eventListener with debounce to the input
    input.addEventListener('input', debounce((e) => {
        userService.search(e.target.value)
    }, 500));

    //Then, we add the event listener to the button
    results.addEventListener('click', (e) => {
        //First look if there's any element with the corresponding data attribute
        const btn = e.target.closest('[data-action="toggle-fav"]');
        if (!btn) return;

        //After we found the btn, we look for the closest element
        //with the .card class applied
        const card = btn.closest('.card');
        if (card && card.dataset.id) {
            //Type assertion to convert the string returned by the data attribute
            const userId = Number(card.dataset.id);
            userService.toggleFav(userId);
        }
    });

}
