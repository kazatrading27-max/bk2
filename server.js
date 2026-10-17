const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything in this folder (index.html, assets/, etc.)
app.use(express.static(path.join(__dirname), { extensions: ["html"] }));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Mebek website running at http://localhost:${PORT}`);
});
