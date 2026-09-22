const express = require("express");
const cors = require("cors");
// const pantryRouter = require("./routers/pantry");
// const charitiesRouter = require("./routers/charities");
// const dashboardRouter = require("./routers/dashboard");
const userRouter = require("./routers/users")

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter)
app.get("/health", (req, res) => res.json({ status: "ok" }));
// app.use("/pantry", pantryRouter);
// app.use("/charities", charitiesRouter);
// app.use("/dashboard", dashboardRouter);
module.exports = app;
