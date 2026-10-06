export class LocalFavRepository {
    getFavs() {
        return JSON.parse(localStorage.getItem('favs')) || [];
    }
    setFavs(favs) {
        localStorage.setItem('favs', JSON.stringify(favs));
    }
}