const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hola desde mi primer servidor Express.js");
});

app.listen(port, () => {
  console.log(`el agus es bien gei  http://localhost:${port}`);
});