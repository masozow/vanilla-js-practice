export class LocalFavRepository {
    getFavs() {
        try {
            return JSON.parse(localStorage.getItem('favs')) || [];
        } catch (error) {
            console.error("LocalStorage is corrupted: ", error);
            return [];
        }
    }
    setFavs(favs) {
        try {
            localStorage.setItem('favs', JSON.stringify(favs));
        }
        catch (error) {
            console.error('Favs can\'t be serialized: ', error);
        }

    }
}