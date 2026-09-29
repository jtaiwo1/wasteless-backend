const { Router } = require("express");
const dashboardController = require("../controllers/dashboard");
const authenticator = require("../middleware/authenticate");

const dashboardRouter = Router();

dashboardRouter.get("/", authenticator,dashboardController.index)

module.exports = dashboardRouter 