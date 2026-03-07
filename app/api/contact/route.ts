import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || GMAIL_USER;

const rateLimitMap = new Map<string, number[]>();

function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entries] of rateLimitMap) {
    const valid = entries.filter((t) => now - t < 60000);
    if (valid.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, valid);
  }
}

setInterval(cleanupRateLimit, 60000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entries = (rateLimitMap.get(ip) || []).filter((t) => now - t < 60000);
  if (entries.length >= 5) return false;
  entries.push(now);
  rateLimitMap.set(ip, entries);
  return true;
}

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 2000);
}

function sanitizePlain(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.slice(0, 2000);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendEmailNotification(subject: string, htmlBody: string) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"WEB4TG Studio" <${GMAIL_USER}>`,
      to: NOTIFICATION_EMAIL,
      subject,
      html: htmlBody,
    });
    console.log('[Email] Notification sent successfully');
  } catch (err) {
    console.error('[Email] Error:', (err as Error).message);
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Слишком много запросов. Попробуйте через минуту.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, phone, description, type } = body;

  let safe: Record<string, string>;
  let tgText: string;
  let emailSubject: string;
  let emailHtml: string;

  if (type === 'email_capture') {
    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { error: 'Укажите корректный email' },
        { status: 400 }
      );
    }
    safe = { type: 'email_capture', email: sanitize(email.trim()) };
    tgText = `📧 Email-подписка\n\n📧 Email: ${safe.email}`;
    emailSubject = 'WEB4TG: Новая email-подписка';
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #8B5CF6;">Email-подписка</h2>
        <p><strong>Email:</strong> ${sanitizePlain(email.trim())}</p>
      </div>
    `;
    console.log('[Email Capture]', JSON.stringify(safe));
  } else if (type === 'callback_request') {
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json(
        { error: 'Укажите телефон' },
        { status: 400 }
      );
    }
    safe = { type: 'callback_request', phone: sanitize(phone.trim()) };
    tgText = `📞 Запрос обратного звонка\n\n📱 Телефон: ${safe.phone}`;
    emailSubject = 'WEB4TG: Запрос обратного звонка';
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #8B5CF6;">Запрос обратного звонка</h2>
        <p><strong>Телефон:</strong> ${sanitizePlain(phone.trim())}</p>
      </div>
    `;
    console.log('[Callback Request]', JSON.stringify(safe));
  } else {
    if (!name || typeof name !== 'string' || !(name as string).trim()) {
      return NextResponse.json(
        { error: 'Укажите ваше имя' },
        { status: 400 }
      );
    }
    if (!email || typeof email !== 'string' || !EMAIL_RE.test((email as string).trim())) {
      return NextResponse.json(
        { error: 'Укажите корректный email' },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== 'string' || !(phone as string).trim()) {
      return NextResponse.json(
        { error: 'Укажите телефон или Telegram' },
        { status: 400 }
      );
    }
    if (
      !description ||
      typeof description !== 'string' ||
      !(description as string).trim()
    ) {
      return NextResponse.json(
        { error: 'Опишите ваш проект' },
        { status: 400 }
      );
    }
    safe = {
      type: 'contact',
      name: sanitize((name as string).trim()),
      email: sanitize((email as string).trim()),
      phone: sanitize((phone as string).trim()),
      description: sanitize((description as string).trim()),
    };
    tgText = `📩 Новая заявка с сайта\n\n👤 Имя: ${safe.name}\n📧 Email: ${safe.email}\n📱 Телефон: ${safe.phone}\n📝 Проект: ${safe.description}`;
    emailSubject = `WEB4TG: Новая заявка от ${sanitizePlain((name as string).trim())}`;
    emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #8B5CF6;">Новая заявка с сайта</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Имя</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${sanitizePlain((name as string).trim())}</td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${sanitizePlain((email as string).trim())}">${sanitizePlain((email as string).trim())}</a></td></tr>
          <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Телефон</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${sanitizePlain((phone as string).trim())}</td></tr>
          <tr><td style="padding: 8px 12px; color: #666; vertical-align: top;">Проект</td><td style="padding: 8px 12px;">${sanitizePlain((description as string).trim())}</td></tr>
        </table>
      </div>
    `;
    console.log('[Contact Form]', JSON.stringify(safe));
  }

  const notifications: Promise<void>[] = [];

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    notifications.push(
      (async () => {
        try {
          const tgRes = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: tgText,
                parse_mode: 'HTML',
              }),
            }
          );
          if (!tgRes.ok) {
            console.error('[Telegram] Failed to send:', await tgRes.text());
          }
        } catch (err) {
          console.error('[Telegram] Error:', (err as Error).message);
        }
      })()
    );
  }

  notifications.push(sendEmailNotification(emailSubject, emailHtml));

  await Promise.allSettled(notifications);

  return NextResponse.json({ success: true });
}
