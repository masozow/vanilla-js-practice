/**
 * DUMB COMPONENT: Uses exclusively the provided CSS classes (.card, .fav).
 * The 'fav' class will trigger the gold border and background from styles.css.
 */
export const UserCard = (user) => `
    <article data-id="${user.id}" class="card ${user.isFavorite ? 'fav' : ''}">
        <h3>${user.name}</h3>
        <button data-action="toggle-fav">
            ${user.isFavorite ? '[*] Remove favorite' : '[ ] Mark as favorite'}
        </button>
    </article>
`;