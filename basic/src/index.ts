import express from "express";

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

interface Bookmark {
  id: number;
  url: string;
  title: string;
  tag?: string;
}
function isBookmark(value: unknown): value is Bookmark {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof value.url === "string" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

let bookmarks: Bookmark[] = [
  { id: 1, url: "https://expressjs.com", title: "Express.js", tag: "node" },
  {
    id: 2,
    url: "https://typescriptlang.org",
    title: "TypeScript",
    tag: "typescript",
  },
  { id: 3, url: "https://developer.mozilla.org", title: "MDN Web Docs" },
];
let id = 0;

app.get("/bookmarks", (req, res) => {
  if (req.query.tag) {
    res.json(bookmarks.filter((bookmark) => bookmark.tag === req.query.tag));
    return;
  }
  res.json(bookmarks);
});

app.get("/bookmarks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Wrong bookmark Id" });
    return;
  }
  const bookmark = bookmarks.find((bookmark) => bookmark.id === id);

  if (bookmark) {
    res.json(bookmark);
    return;
  } else {
    res.status(404).json({ error: "Bookmark not found" });
  }
});

app.post("/bookmarks", (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Request body is missing" });
    return;
  }

  if (isBookmark(req.body)) {
    const bookmark = {
      ...req.body,
      id: id++,
    };
    bookmarks.push(bookmark);
    res.status(201).json(bookmark);
  } else {
    if (!("title" in req.body)) {
      res.status(400).json({ error: "Missing required field: title" });
      return;
    }
    if (!("url" in req.body)) {
      res.status(400).json({ error: "Missing required field: url" });
      return;
    }
  }
});

app.patch("/bookmarks/:id", (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Request body is missing" });
    return;
  }
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Wrong bookmark Id" });
    return;
  }
  const bookmark = bookmarks.find((bookmark) => bookmark.id === id);
  if (bookmark) {
    if (req.body.title !== undefined && typeof req.body.title !== "string")
      bookmark.title = req.body.title;
    if (req.body.url !== undefined && typeof req.body.title !== "string")
      bookmark.url = req.body.url;
    if (req.body.tag !== undefined && typeof req.body.title !== "string")
      bookmark.tag = req.body.tag;

    res.json(bookmark);
    return;
  } else {
    res.status(404).json({ error: "Bookmark not found" });
  }
});

app.delete("/bookmarks/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Wrong bookmark Id" });
    return;
  }
  const index = bookmarks.findIndex((bookmark) => bookmark.id === id);
  console.log(index);
  if (index !== -1) {
    bookmarks.splice(index, 1);
    res.status(204).json({});
    return;
  } else {
    res.status(404).json({ error: "Bookmark not found" });
  }
});
