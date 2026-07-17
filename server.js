const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = __dirname;
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const resolvedPath = path.resolve(root, relativePath);

    if (!resolvedPath.startsWith(root + path.sep)) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    fs.stat(resolvedPath, (statError, stats) => {
        let filePath = resolvedPath;
        if (!statError && stats.isDirectory()) filePath = path.join(resolvedPath, 'index.html');

        fs.readFile(filePath, (error, content) => {
            if (error) {
                fs.readFile(path.join(root, '404.html'), (notFoundError, notFoundContent) => {
                    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    response.end(notFoundError ? 'Not found' : notFoundContent);
                });
                return;
            }

            response.writeHead(200, {
                'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
                'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff'
            });
            response.end(content);
        });
    });
}).listen(port, host, () => {
    const interfaces = os.networkInterfaces();
    const addresses = Object.values(interfaces).flat().filter((item) => item && item.family === 'IPv4' && !item.internal).map((item) => item.address);
    console.log(`CoSAFE local server: http://127.0.0.1:${port}`);
    addresses.forEach((address) => console.log(`CoSAFE LAN bridge: http://${address}:${port}`));
});
