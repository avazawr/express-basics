import express from "express";
import nunjucks from "nunjucks";

import posts from "./posts.json" with { type: "json" };

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const env = nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  watch: true,
});

app.use("/static", express.static("public"));

env.addFilter("date", (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("de-DE");
});

app.get("/", (req, res) => {
  res.render("index.njk", { posts });
});

app.get("/post/:id", (req, res) => {
  let id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 0 || id >= posts.length) {
    res.status(404).send("Post not found");
    return;
  }

  let currentPost = posts[id];

  res.render("post-page.njk", { currentPost });
});

app.get("/contact", (req, res) => {
  res.render("contact.njk", {});
});

app.listen(PORT, () => {
  console.log(`Event Hub running at http://localhost:${PORT}`);
});
