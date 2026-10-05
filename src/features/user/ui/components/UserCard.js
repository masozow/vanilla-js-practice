export const UserCard = (user, onToggleFav) => {
    const card = document.createElement('div');
    card.className = `card ${user.isFavorite ? 'fav' : ''}`;

    const title = document.createElement('h3');
    title.textContent = user.name;

    const btn = document.createElement('button');
    btn.textContent = user.isFavorite ? ' [*] Quitar fav' : '[ ] Marcar Fav';
    btn.onclick = () => onToggleFav(user.id);

    card.append(title.btn);
    return card;
}