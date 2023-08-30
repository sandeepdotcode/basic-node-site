import express from "express";
const app = express();
import { join as joinPath } from "node:path";
import prepareFile from "./lib/prepareFile.js";
import MIME_TYPES from "./lib/contentType.js";

const port = process.env.PORT ?? 3000;
const STATIC_PATH = joinPath(process.cwd(), './public');

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": 'text/html' });
  res.sendFile(joinPath(STATIC_PATH, 'index.html'), function(err) {
    if (err) {
      // next(err);
    } else {
      console.log("Sent: /public/index.html");
    }
  })
});

app.get("/[a-z]+(\-{0,1}[a-z]+)*/", async (req, res) => {
  const file = await prepareFile(req.url);
  const statuscode = file.found ? 200 : 400;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;

  res.writeHead(statuscode, { "Content-Type": mimeType });
  file.stream.pipe(res);
  console.log(`${req.method} ${req.url} ${statuscode}`)
});

app.listen(port, function() {
  console.log(`Server running at port ${port}`);
});