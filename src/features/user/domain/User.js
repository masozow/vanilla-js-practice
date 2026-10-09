export class User {
    constructor(id, name, email, isFavorite = false) {
        if (!id) throw new Error("Domain error: User must have an Id");
        if (!name) throw new Error("Domain error: User must have a name")

        this.id = id;
        this.name = name;
        this.email = email;
        this.isFavorite = isFavorite;
    }

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }
}