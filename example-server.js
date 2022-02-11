const express = require("express");
const cors = require("cors");
const { isNamedExportBindings } = require("typescript");

const app = express();
app.use(cors());
app.use(
  express.static("./", {
    setHeaders: (res) => {
      res.set("Cross-Origin-Opener-Policy", "same-origin");
      res.set("Cross-Origin-Embedder-Policy", "require-corp");
    },
  })
);
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
