const express = require("express");
const cors = require("cors");
const { connectDB, Book, Quote, Story } = require("./db");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/quotes", async (req, res) => {
  try {
    const { text, title, author, theme } = req.body;
    if (!text || !title || !author || !theme) {
      return res.status(400).json({
        message: "text, title, author and theme are required",
      });
    }
    let book = await Book.findOne({ title, author });
    if (!book) {
      book = await Book.create({
        title,
        author,
      });
    }
    await Quote.create({
      text,
      theme,
      book: book._id,
    });
    res.status(201).json({
      message: "Quote created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/quotes", async (req, res) => {
  try {
    const { q, theme } = req.query;
    const filters = {};
    if (q) {
      filters.text = { $regex: q, $options: "i" };
    }

    if (theme) {
      filters.theme = theme;
    }

    const quotes = await Quote.find(filters).populate("book");
    res.status(200).json({ quotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Book not found" });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const quotes = await Quote.find({ book: id });
    const stories = await Story.find({ book: id });
    res.status(200).json({ book, quotes, stories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/stories", async (req, res) => {
  try {
    const { text, title, author } = req.body;
    if (!text || !title || !author) {
      return res.status(400).json({
        message: "text, title, author are required",
      });
    }
    let book = await Book.findOne({ title, author });
    if (!book) {
      book = await Book.create({
        title,
        author,
      });
    }
    await Story.create({
      text,
      book: book._id,
    });
    res.status(201).json({
      message: "Story created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function start() {
  await connectDB();

  app.listen(3001, () => {
    console.log("server is run on 3001 port");
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
