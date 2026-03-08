// Essentialis Shell Server
// Serves the unified tab UI at localhost:8080
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const SHELL_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    let filePath = path.join(SHELL_DIR, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════════╗`);
    console.log(`  ║   ESSENTIALIS Development Platform       ║`);
    console.log(`  ╠══════════════════════════════════════════╣`);
    console.log(`  ║   Shell:     http://localhost:${PORT}        ║`);
    console.log(`  ║   Contracts: http://localhost:8081        ║`);
    console.log(`  ║   Frontend:  http://localhost:5174        ║`);
    console.log(`  ╚══════════════════════════════════════════╝\n`);
});
