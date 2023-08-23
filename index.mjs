import { createServer } from "node:http";
import { join as joinPath, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import getContentType from "./lib/contentType.mjs";

const hostname = "127.0.0.1";
const port = process.env.PORT ?? 3000;

const server = createServer((req, res) => {
  // res.statuscode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World!\n');

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fileExt = extname(req.url);


  if (fileExt === '') {
    const filePath = joinPath(
      __dirname, 'public'
      , req.url === '/' ? 'index.html' : joinPath('pages', req.url + '.html')
    );

    readFile(filePath)
    .then(function(content) {
      res.writeHead(200, { 'Content-Types': 'text/html' });
      res.end(content, 'utf-8');
    })
    .catch(function(error) {
      if (error.code === 'ENOENT') {
        readFile(joinPath(__dirname, 'public', 'pages', '404.html'))
        .then(function(content) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        })
        .catch(function(error) {
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`);
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    });
  } else {
    let contentType = getContentType(fileExt);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});