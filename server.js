import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const MIME_TYPES = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
};

const createPreCompressedMiddleware = (isAssets) => (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    const acceptEncoding = req.headers['accept-encoding'] || '';
    const basePath = isAssets
        ? path.join(__dirname, 'dist', 'assets', req.path)
        : path.join(__dirname, 'dist', req.path);
    const ext = path.extname(req.path);

    if (ext === '.html') return next();

    const encodings = [];
    if (acceptEncoding.includes('br')) encodings.push({ encoding: 'br', suffix: '.br' });
    if (acceptEncoding.includes('gzip')) encodings.push({ encoding: 'gzip', suffix: '.gz' });

    for (const { encoding, suffix } of encodings) {
        const compressedPath = basePath + suffix;
        if (fs.existsSync(compressedPath)) {
            res.setHeader('Content-Encoding', encoding);
            res.setHeader('Vary', 'Accept-Encoding');
            if (MIME_TYPES[ext]) res.setHeader('Content-Type', MIME_TYPES[ext] + '; charset=utf-8');
            if (isAssets) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            }
            return res.sendFile(compressedPath);
        }
    }

    next();
};

app.use(compression());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: blob: https:",
            "media-src 'self' https://res.cloudinary.com",
            "connect-src 'self' https://cdn.jsdelivr.net",
            "frame-src 'self' blob:",
            "worker-src 'self' blob:",
            "object-src 'none'",
            "base-uri 'self'",
        ].join('; ')
    );
    next();
});

app.use(
    '/assets',
    createPreCompressedMiddleware(true),
    express.static(path.join(__dirname, 'dist', 'assets'), {
        maxAge: '1y',
        immutable: true,
    })
);

app.use(
    createPreCompressedMiddleware(false),
    express.static(path.join(__dirname, 'dist'), {
        maxAge: '1h',
        setHeaders(res, filePath) {
            if (filePath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache');
            }
        },
    })
);

app.get('/{*path}', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
