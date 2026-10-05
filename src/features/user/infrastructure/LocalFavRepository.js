// export class LocalFavRepository {
//     getFavs() { return JSON.parse(localStorage.getItem('favs') || '[]'); }
//     saveFavs(favs) { localStorage.setItem('favs', JSON.stringify(favs)); }
// }

export class LocalFavRespository {
    getFavs() { return JSON.parse(localStorage.getItem('favs') || []) }
    setFavs(favs) { localStorage.setItem('favs', JSON.stringify(favs)) }
}