const { Router } = require("express");
const pantryController = require("../controllers/pantry");

const pantryRouter = Router();

pantryRouter.get("/", pantryController.index);
pantryRouter.get("/:id", pantryController.findById);
pantryRouter.post("/", pantryController.addItem);
pantryRouter.patch("/", pantryController.updateStatus)



module.exports = pantryRouter;