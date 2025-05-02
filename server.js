const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { DATABASE_PORT, DATABASE_URL } = require("./CONSTANTS.js");
const path = require("path");

const app = express();

console.log(process.env.DATABASE_URL);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

const corsOptions = {
  origin: [
    "http://192.168.100.27:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

// Define la ruta para la página principal que servirá la etiqueta de verificación
app.get("/", (req, res) => {
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

app.use("/", routes());

const PORT = DATABASE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
