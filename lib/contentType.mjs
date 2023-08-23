function getContentType(extName) {
  let contentType = ''; 
  switch(extName) {
    case '':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.png':
      contentType = 'image/png';
    default:
  }

  return contentType;
}

export default getContentType;