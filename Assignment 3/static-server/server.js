const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const BASE_DIR = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // 👉 Homepage → show file list
  if (pathname === '/') {
    fs.readdir(BASE_DIR, (err, files) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading files');
      }

      let html = '<h1>Files List</h1><ul>';

      files.forEach(file => {
        html += `<li><a href="/${file}">${file}</a></li>`;
      });

      html += '</ul>';

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
    return;
  }

  // 👉 Prevent hacking (../)
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  // 👉 Serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('File not found');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});