import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPassword, makeSessionCookie, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

const Body = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!checkPassword(parsed.data.password)) {
    console.log('[admin-login] FAIL — wrong password (length:', parsed.data.password.length, ')');
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  // Auto-detect HTTPS из заголовков. Если сайт не на HTTPS — secure: false,
  // иначе браузер не сохранит cookie (а пользователь не сможет войти).
  const url = new URL(req.url);
  const xfProto = req.headers.get('x-forwarded-proto');
  const isHttps = url.protocol === 'https:' || xfProto === 'https';

  const session = makeSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps, // КЛЮЧЕВОЕ: secure=true ломает HTTP-сайты
    path: '/',
    maxAge: session.ttl,
  });
  console.log(`[admin-login] OK — cookie set (secure=${isHttps}, host=${url.host})`);
  return res;
}
