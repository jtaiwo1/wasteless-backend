const PantryItem = require("../models/PantryItem");
const { getAnalytics } = require("../services/insightsClient");
async function index(req, res) {
  try {
    const items = await PantryItem.findAll();
    const summary = await getAnalytics(items);
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Dashboard unavailable" });
  }
}
module.exports = { index };
