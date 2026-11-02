import express from "express";
import nunjucks from "nunjucks";

import { events } from "./data/events";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware to parse JSON request bodies
//app.use(express.json());

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  watch: true,
});

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.render("index.njk", { title: "Home" });
});

app.get("/events", (req, res) => {
  res.render("events.njk", { title: "Events", events });
});

app.listen(PORT, () => {
  console.log(`Event Hub running at http://localhost:${PORT}`);
});
