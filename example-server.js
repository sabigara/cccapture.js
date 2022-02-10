const express = require("express");
const { isNamedExportBindings } = require("typescript");

const app = express();
app.use(
  express.static("./", {
    setHeaders: (res) => {
      res.set("Cross-Origin-Opener-Policy", "same-origin");
      res.set("Cross-Origin-Embedder-Policy", "require-corp");
    },
  })
);
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
