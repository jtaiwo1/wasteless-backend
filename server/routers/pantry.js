const { Router } = require("express");
const pantryController = require("../controllers/pantry");

const pantryRouter = Router();

pantryRouter.get("/", pantryController.index);
pantryRouter.get("/user/:user_id", pantryController.findByUserId);
pantryRouter.post("/", pantryController.addItem);
pantryRouter.patch("/:id/status", pantryController.updateStatus)
pantryRouter.delete("/:id", pantryController.deleteItem)



module.exports = pantryRouter;