class User {
    constructor(id, name, email, isFavorite = false) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isFavorite = isFavorite;
    }
    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
}