const PantryItem = require("../models/PantryItem");
async function index(req, res) {
  try {
    const user_id = req.user.user_id;
    const rows = await PantryItem.findByUserId(user_id);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database request failed" });
  }
}

// async function findByUserId(req, res) {
//   try {
//     const user_id = req.params.id;
//     const response = await PantryItem.findByUserId(user_id);
//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

async function addItem(req, res) {
  try {
    const data = {
      ...req.body,
      user_id: req.user.user_id,
    };
    const response = await PantryItem.create(data);
    res.status(201).json(response);
  } catch (err) {
    res.status(409).send({ error: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const id = req.params.id;
    const user_id = req.user.user_id
    const { status } = req.body;

    const validStatuses = [
      "available",
      "donated",
      "used",
      "wasted"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({error:"Invalid pantry status"})
    }

    const item = await PantryItem.findById(id, user_id)

    if (!item) {
      return res.status(404).json({
        error: "Pantry item not found",
      });
    }


    const updatedItem = await item.updateStatus(status);

    
    return res.status(200).json({
      success: true,
      pantryItem: updatedItem,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Couldn't update pantry item status",
    });
  }
}

async function deleteItem(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user_id = req.user.user_id

    const item = await PantryItem.findById(id, user_id);

    const result = await item.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
module.exports = { index, addItem, updateStatus, deleteItem };
