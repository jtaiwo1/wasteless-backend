const { Router } = require("express");
const pantryController = require("../controllers/pantry");
const authenticator = require("../middleware/authenticate")

const pantryRouter = Router();

pantryRouter.get("/", authenticator, pantryController.index);
pantryRouter.post("/", authenticator, pantryController.addItem);
pantryRouter.patch("/:id/status", authenticator, pantryController.updateStatus)
pantryRouter.delete("/:id", authenticator, pantryController.deleteItem)



module.exports = pantryRouter;