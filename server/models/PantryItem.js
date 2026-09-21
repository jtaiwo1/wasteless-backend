const db = require("../db/connect");
class PantryItem {
  static async findAll() {
    const result = await db.query("SELECT * FROM pantry ORDER BY id");
    return result.rows;
  }
}
module.exports = PantryItem;
