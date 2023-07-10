const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;
const privateRouter = require("./src/routes/privateRoutes");
const authRouter = require("./src/routes/authRoutes");

app.use(express.json());
app.use("/private", privateRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
