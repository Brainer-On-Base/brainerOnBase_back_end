const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./variables.env" });
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DATABASE_PORT, DATABASE_URL } = require("./CONSTANTS.js");
const path = require("path");

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const corsOptions = {
  origin: ["https://www.braineronbase.com", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

// 👇👇 ESTO ES CLAVE
app.use("/api", routes());

app.get("/api", (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BRAINER ON BASE</title>
  </head>
  <body>
    BRAINER ON BASE
  </body>
  </html>`);
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = DATABASE_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
