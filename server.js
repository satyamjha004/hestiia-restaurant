require("dotenv").config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "SET" : "NOT SET");
console.log("DB_NAME:", process.env.DB_NAME);

const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const app = express();

require("./config/db");

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("HESTIIA Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
