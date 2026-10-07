export const UserCard = (user, onToggleFav) => {
    const error_prefix = "[UI Error]: UserCard. "
    if (!user) throw new Error(`${error_prefix} User is required.`)
    if (typeof onToggleFav !== 'function') throw new Error(`${error_prefix} OnToggleFav must be a function.`)

    const card = document.createElement('div');
    card.className = `card ${user.isFavorite ? 'fav' : ''}`;

    const title = document.createElement('h3');
    title.textContent = user.name;

    const btn = document.createElement('button');
    btn.onclick = () => onToggleFav();

    card.append(title, btn);

    return card;
}