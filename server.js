const http = require('http');
const fs = require('fs');
const path = require('path');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8081',
  changeOrigin: true,
});

const distPath = path.join(__dirname, 'dist');

const contentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

function isStaticFile(url) {
  const staticExtensions = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.map'];
  const ext = path.extname(url).toLowerCase();
  return staticExtensions.includes(ext);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  
  if (url.startsWith('/api')) {
    proxy.web(req, res, { target: 'http://localhost:8081' }, (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      }
    });
    return;
  }

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(distPath, 'index.html')).pipe(res);
    return;
  }

  let filePath = path.join(distPath, url);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  if (isStaticFile(url)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream(path.join(distPath, 'index.html')).pipe(res);
});

server.listen(8003, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:8003');
});
