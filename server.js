import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const rateLimitMap = new Map();

function cleanupRateLimit() {
    const now = Date.now();
    for (const [ip, entries] of rateLimitMap) {
        const valid = entries.filter(t => now - t < 60000);
        if (valid.length === 0) rateLimitMap.delete(ip);
        else rateLimitMap.set(ip, valid);
    }
}
setInterval(cleanupRateLimit, 60000);

function checkRateLimit(ip) {
    const now = Date.now();
    const entries = (rateLimitMap.get(ip) || []).filter(t => now - t < 60000);
    if (entries.length >= 5) return false;
    entries.push(now);
    rateLimitMap.set(ip, entries);
    return true;
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .slice(0, 2000);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://mc.yandex.ru",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: blob: https:",
            "media-src 'self' https://res.cloudinary.com",
            "connect-src 'self' https://cdn.jsdelivr.net https://api.telegram.org https://mc.yandex.ru",
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

app.use(express.json({ limit: '10kb' }));

app.post('/api/contact', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: 'Слишком много запросов. Попробуйте через минуту.' });
    }

    const { name, email, phone, description, type } = req.body || {};

    let safe;
    let tgText;

    if (type === 'email_capture') {
        if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
            return res.status(400).json({ error: 'Укажите корректный email' });
        }
        safe = { type: 'email_capture', email: sanitize(email.trim()) };
        tgText = `📧 Email-подписка\n\n📧 Email: ${safe.email}`;
        console.log('[Email Capture]', JSON.stringify(safe));
    } else if (type === 'callback_request') {
        if (!phone || typeof phone !== 'string' || !phone.trim()) {
            return res.status(400).json({ error: 'Укажите телефон' });
        }
        safe = { type: 'callback_request', phone: sanitize(phone.trim()) };
        tgText = `📞 Запрос обратного звонка\n\n📱 Телефон: ${safe.phone}`;
        console.log('[Callback Request]', JSON.stringify(safe));
    } else {
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Укажите ваше имя' });
        }
        if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
            return res.status(400).json({ error: 'Укажите корректный email' });
        }
        if (!phone || typeof phone !== 'string' || !phone.trim()) {
            return res.status(400).json({ error: 'Укажите телефон или Telegram' });
        }
        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({ error: 'Опишите ваш проект' });
        }
        safe = {
            type: 'contact',
            name: sanitize(name.trim()),
            email: sanitize(email.trim()),
            phone: sanitize(phone.trim()),
            description: sanitize(description.trim()),
        };
        tgText = `📩 Новая заявка с сайта\n\n👤 Имя: ${safe.name}\n📧 Email: ${safe.email}\n📱 Телефон: ${safe.phone}\n📝 Проект: ${safe.description}`;
        console.log('[Contact Form]', JSON.stringify(safe));
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: tgText, parse_mode: 'HTML' }),
            });
            if (!tgRes.ok) {
                console.error('[Telegram] Failed to send:', await tgRes.text());
            }
        } catch (err) {
            console.error('[Telegram] Error:', err.message);
        }
    }

    return res.json({ success: true });
});

app.get('/{*path}', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
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
