import { createServer } from "node:http";
import { join as joinPath, extname } from "node:path";
import { access as accessFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import MIME_TYPES from "./lib/contentType.js";

const hostname = "127.0.0.1";
const port = process.env.PORT ?? 3000;
const STATIC_PATH = joinPath(process.cwd(), './public');

const toBool = [() => true, () => false];

async function prepareFile(url) {
  const paths = [STATIC_PATH, url];
  const htmlPaths = [STATIC_PATH, 'pages', url + '.html'];
  if (url.endsWith("/")) {
    paths.push("index.html");
  }

  const filePath = (!url.endsWith("/") && extname(url) === '') ? joinPath(...htmlPaths) : joinPath(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);   // security check to prevet path traversal vulnerabilites
  const fileExists = await accessFile(filePath).then(...toBool);
  const fileFound = !pathTraversal && fileExists;

  const streamPath = fileFound ? filePath : joinPath(STATIC_PATH, './pages/404.html')
  const ext = extname(streamPath).substring(1).toLowerCase();
  const stream = createReadStream(streamPath);

  return { found: fileFound, ext, stream };
}

const server = createServer(async (req, res) => {
  // res.statuscode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World!\n');

  const file = await prepareFile(req.url);
  const statuscode = file.found ? 200 : 400;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;

  res.writeHead(statuscode, { "Content-Type": mimeType });
  file.stream.pipe(res);
  console.log(`${req.method} ${req.url} ${statuscode}`)
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});