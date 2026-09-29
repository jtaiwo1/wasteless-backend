const db = require("../db/connect");

class PantryItem {
  constructor({
    id,
    user_id,
    name,
    quantity,
    expiry_date,
    status,
    status_update_at,
  }) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.quantity = quantity;
    this.expiry_date = expiry_date;
    this.status = status;
    this.status_update_at = status_update_at;
  }

  static async findAll() {
    const result = await db.query("SELECT * FROM pantry ORDER BY id");

    return result.rows.map((row) => new PantryItem(row));
  }

  static async findByUserId(user_id) {
    const result = await db.query(
      "SELECT * FROM pantry WHERE user_id = $1 ORDER BY id",
      [user_id],
    );

    return result.rows.map((row) => new PantryItem(row));
  }

  static async findById(id, user_id) {
    const result = await db.query("SELECT * FROM pantry WHERE id = $1 AND user_id = $2",
      [id, user_id]
    )

    if (!result.rows[0]){
      return null
    }

    return new PantryItem(result.rows[0])
  }

  static async create(item) {
    if (!item.name) {
      throw new Error("Item name is required");
    }

    const result = await db.query(
      "INSERT INTO pantry(user_id, name, quantity, expiry_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        item.user_id,
        item.name,
        item.quantity ?? 1,
        item.expiry_date ?? null,
        item.status ?? "available",
      ],
    );

    return new PantryItem(result.rows[0]);
  }

  async updateStatus(status) {
    const result = await db.query("UPDATE pantry SET status = $1, status__at = CURRENT_DATE WHERE id = $2 AND user_id = $3 RETURNING *", 
    [
      status,
      this.id,
      this.user_id
    ])

    if (!result.rows[0]) {
      return null;
    }

    return new PantryItem(result.rows[0]);
  }

  async destroy() {
    const result = await db.query(
      `DELETE FROM pantry
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [
        this.id,
        this.user_id
      ]
    );

    if (!result.rows[0]) {
      return null;
    }

    return new PantryItem(result.rows[0]);
  }
}

module.exports = PantryItem;
