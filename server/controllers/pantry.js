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

async function findById(req,res) {
  try {
    const id = req.params.id
    const response = await PantryItem.findById(id)
    if (!response) {
      res.status(404).json({ error: err.message });
    }
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


async function addItem(req,res) {
  try{
    const data = req.body
    const response = await PantryItem.create(data)
    res.status(201).json(response)
  } catch (err){
    res.status(409).send({ error: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const updatedItem = await PantryItem.updateStatus(id, status);

    if (!updatedItem) {
      return res.status(404).json({
        error: "Pantry item not found"
      });
    }

    return res.status(200).json({
      success: true,
      pantryItem: updatedItem
    });

  } catch (err) {
    return res.status(500).json({
      error: "Couldn't update pantry item status"
    });
  }
}

async function deleteItem(req,res) {
  try{
    const id = parseInt(req.params.id);
    const item = await PantryItem.findById(id);
    const result = await item.destroy();
    res.status(204).json(result);
  } catch(err) {
    res.status(404).json({error: err.message })
  }
}
module.exports = { index, findById, addItem, updateStatus, deleteItem};
