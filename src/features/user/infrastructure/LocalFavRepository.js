export class LocalFavRepository {
    getFavs() { return JSON.parse(localStorage.getItem('favs') || '[]'); }
    saveFavs(favs) { localStorage.setItem('favs', JSON.stringify(ravs)); }
}