const path = require("path");
const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");

const db = {
  docs: [],
  token2doc: {},
  login2doc: {},

  add(doc) {
    this.docs.push(doc);
    this.token2doc[doc.token] = doc;
    this.login2doc[doc.login] = doc;
  },

  getByToken(token) {
    return this.token2doc[token];
  },

  getByLogin(login) {
    return this.login2doc[login];
  }
};

const app = express();
const srcPath = path.resolve(__dirname, "app");
const vuePath = path.resolve(__dirname, "node_modules/vue/dist/vue.min.js");
const idbPath = path.resolve(__dirname, "node_modules/idb/build/idb.js");

app.use(bodyParser.json({ limit: "50mb", extended: true }));

app.use(express.static(srcPath));
app.get("/vue.min.js", function(req, res) {
  res.sendFile(vuePath);
});
app.get("/idb.js", function(req, res) {
  res.sendFile(idbPath);
});

app.get("/user/:token", function(req, res) {
  const token = req.params.token;
  const userData = db.getByToken(token);

  if (userData) {
    res.status(200).send(userData);
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});

app.post("/auth", function(req, res) {
  const { newcomer, login, password, name, photo } = req.body;
  const userData = db.getByLogin(login);
  const token = crypto
    .createHash("md5")
    .update(login + password)
    .digest("hex");

  if (newcomer) {
    if (userData) {
      res.status(401).send({ error: "Try another login" });
    } else {
      db.add({
        token,
        login,
        name,
        photo,
        hist: {},
        timestamp: Date.now()
      });
      res.status(200).send({ token });
    }
  } else if (!userData) {
    res.status(401).send({ error: "Incorrect login" });
  } else if (userData.token !== token) {
    res.status(401).send({ error: "Incorrect password" });
  } else {
    res.status(200).send({ token });
  }
});

app.post("/prophecy", function(req, res) {
  const { token, prophecy } = req.body;
  const userData = db.getByToken(token);

  if (userData) {
    userData.hist[prophecy.index] = prophecy;
    userData.timestamp = Date.now();
    res.status(200).send({ status: "OK" });
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});

app.use((req, res, next) => {
  res.status(404).send("Fin!");
});

app.listen(4000);
console.log(`http://localhost:4000`);
