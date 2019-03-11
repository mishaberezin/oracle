const path = require("path");
const express = require("express");

const db = {};
const app = express();

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../www/index.html"));
});
app.get("/index.css", function(req, res) {
  res.sendFile(path.join(__dirname + "/../www/index.css"));
});
app.get("/index.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/../www/index.js"));
});

// отправляем ревизию
app.get("/state", function(req, res) {
  res.sendFile(path.join(__dirname + "/../www/index.css"));
});
app.post("/login", function(req, res) {
  res.sendFile(path.join(__dirname + "/../www/index.css"));
});

app.use((req, res, next) => {
  res.status(404).send("Fin!");
});

app.listen(4000);
console.log(`Go to http://localhost:4000`);
