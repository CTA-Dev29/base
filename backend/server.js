
const cors = require('cors');
require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true,
}));
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profiles", profileRoutes);
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log("Server running on http://localhost:3000"));
});
