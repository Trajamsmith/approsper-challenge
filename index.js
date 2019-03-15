require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const cache = require("./cache/index");
const testDB = require("./db/testDB");
const {
  initDB,
  insertAdvert,
  pickRandom,
  pickRandomFromCat,
  genRevReport
} = require("./db/advertisement");

const app = express();
const port = 3000;
testDB();
initDB();

app.use(morgan("combined"));
app.use(bodyParser());

app.post("/advertisement", async (req, res) => {
  const { url, category, cpi } = req.body;
  await insertAdvert(url, category, cpi);
  res.send(`${url}, ${category}, ${cpi}`);
});

app.put("/advertisement", async (req, res) => {
  const { categories } = req.body;

  if (categories) {
    const ad = await pickRandomFromCat(categories);
    res.send(ad);
    return;
  }

  const ad = await pickRandom();
  res.send(ad);
});

app.get("/revenue-report", async (req, res) => {
  const revs = await genRevReport();
  res.send(revs);
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
