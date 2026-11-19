const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const quoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    theme: { type: String, required: true },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
const Quote = mongoose.model("Quote", quoteSchema);

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/reading-memory");
  console.log("MongoDB connected");
}

module.exports = { connectDB, Book, Quote };
