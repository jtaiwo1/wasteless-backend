const db = require("../db/connect")

class User {
    constructor({ user_id, username, password }) {
        this.user_id = user_id;
        this.username = username;
        this.password_has = password;
    }

    static async getAll() {
        const response = await db.query(
            "SELECT * FROM users;"
        );
        if (response.rows.length === 0) {
      throw new Error("No users available");
    }
    return response.rows.map((c) => new User(c));
    }

    static async getByUsername(username) {
        const response = await db.query(
            "SELECT * FROM users WHERE username = $1;",
            [username]
        );
        return response.rows[0] || null;
    }

    static async create()
}