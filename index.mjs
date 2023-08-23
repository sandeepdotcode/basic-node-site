import { createServer } from "node:http";

const hostname = "127.0.0.1";
const port = process.env.PORT ?? 3000;

const server = createServer((req, res) => {
  res.statuscode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});