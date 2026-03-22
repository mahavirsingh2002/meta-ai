const express = require("express");
const app = express();

const VERIFY_TOKEN = "veer123";

app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Message received:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running"));
