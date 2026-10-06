export class LocalFavRepository {
    getFavs() {
        try {
            return JSON.parse(localStorage.getItem('favs')) || [];
        } catch (error) {
            console.error("Data corrompida  en localStorage");
            return [];
        }

    }
    setFavs(favs) {
        localStorage.setItem('favs', JSON.stringify(favs));
    }
}