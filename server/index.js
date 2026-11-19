const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

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
