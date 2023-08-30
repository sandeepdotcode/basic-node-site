import { join as joinPath, extname } from "node:path";
import { access as accessFile } from "node:fs/promises";
import { createReadStream } from "node:fs";

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

export default prepareFile;