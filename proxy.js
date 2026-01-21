/**
 * Reverse Proxy for Azure App Service
 * Routes requests to appropriate internal services:
 * - /api/* -> NestJS API (port 3001)
 * - /* -> Next.js Web (port 3000)
 */

const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const PORT = process.env.PORT || 8080;

const WEB_TARGET = 'http://127.0.0.1:3000';
const API_TARGET = 'http://127.0.0.1:3001';

const server = http.createServer((req, res) => {
    const target = req.url.startsWith('/api/') ? API_TARGET : WEB_TARGET;

    proxy.web(req, res, { target }, (err) => {
        console.error(`Proxy error for ${req.url}:`, err.message);
        if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Bad Gateway - Service temporarily unavailable');
        }
    });
});

// Handle WebSocket upgrades (for Next.js HMR in dev, Socket.io, etc.)
server.on('upgrade', (req, socket, head) => {
    const target = req.url.startsWith('/api/') ? API_TARGET : WEB_TARGET;
    proxy.ws(req, socket, head, { target });
});

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err.message);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`Reverse Proxy started on port ${PORT}`);
    console.log(`Web -> ${WEB_TARGET}`);
    console.log(`API -> ${API_TARGET}`);
    console.log(`=================================`);
});
