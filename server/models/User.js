const db = require("../db/connect")

class User {
    constructor({ user_id, username, password }) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
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

    static async create(data) {
        try {  
            if(!data.username){ throw new Error("username is missing") };
            if(!data.password){ throw new Error("password is missing") };

            const response = await db.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING user_id, username;", [data.username.toLowerCase(), data.password])
            return new User(response.rows[0]);

        } catch(err) {
            throw new Error("Couldn't create user")
        }
    }
}

module.exports = User;