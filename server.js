require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Static file serving
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/", routes());

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
