export class User {
    constructor(id, name, username, email, isFavorite = false) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.isFavorite = isFavorite;
    }
}