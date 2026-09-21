const PantryItem = require("../models/PantryItem");
async function index(req, res) {
  try {
    const rows = await PantryItem.findAll();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database request failed" });
  }
}
module.exports = { index };
