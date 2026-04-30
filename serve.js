const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8000;

const redirectRoutes = {
  '/privacy.html': '/privacy-policy.html',
  '/terms.html': '/terms-of-service.html',
  '/refund.html': '/refund-policy.html',
  '/privacy-policy': '/privacy-policy.html',
  '/privacy-policy/': '/privacy-policy.html',
  '/terms-of-service': '/terms-of-service.html',
  '/terms-of-service/': '/terms-of-service.html',
  '/refund-policy': '/refund-policy.html',
  '/refund-policy/': '/refund-policy.html',
  '/index.php/privacy-policy/': '/privacy-policy.html',
  '/index.php/terms-conditions/': '/terms-of-service.html',
  '/index.php/refund_returns/': '/refund-policy.html'
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let requestPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (redirectRoutes[requestPath]) {
    res.writeHead(301, {
      Location: redirectRoutes[requestPath],
      'Cache-Control': 'no-store'
    });
    res.end();
    return;
  }

  if (requestPath === '/') {
    requestPath = '/index.html';
  }

  const safePath = requestPath.replace(/^\//, '');
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Cache-Control': 'no-store' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Cache-Control': 'no-store' });
      res.end(`Not found: ${safePath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const isStatic = ['.css','.js','.png','.jpg','.jpeg','.webp','.svg','.ico','.woff2'].includes(ext);
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': isStatic ? 'public, max-age=31536000, immutable' : 'no-cache'
    });
    res.end(data);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});