import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPassword, makeSessionCookie, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

const Body = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  // Поддерживаем как JSON (fetch из формы), так и form-encoded (form action="POST")
  const contentType = req.headers.get('content-type') ?? '';
  let rawPassword: string | null = null;

  if (contentType.includes('application/json')) {
    try {
      const json = await req.json();
      const parsed = Body.safeParse(json);
      if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
      rawPassword = parsed.data.password;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: 'Invalid form' }, { status: 400 });
    const v = form.get('password');
    if (typeof v !== 'string') return NextResponse.json({ error: 'password required' }, { status: 400 });
    rawPassword = v;
  }

  // Защита от случайных пробелов (Safari/iOS вставляет при autofill)
  const password = rawPassword.trim();
  console.log(`[admin-login] attempt — input length: ${rawPassword.length} (after trim: ${password.length})`);

  if (!checkPassword(password)) {
    console.log('[admin-login] FAIL — wrong password');
    await new Promise((r) => setTimeout(r, 600));

    if (contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }
    // Form post — редиректим обратно с флагом ошибки
    const back = new URL('/admin/login?err=1', req.url);
    return NextResponse.redirect(back, { status: 303 });
  }

  // Auto-detect HTTPS из заголовков
  const url = new URL(req.url);
  const xfProto = req.headers.get('x-forwarded-proto');
  const isHttps = url.protocol === 'https:' || xfProto === 'https';

  const session = makeSessionCookie();
  console.log(`[admin-login] OK — cookie set (secure=${isHttps}, host=${url.host}, ttl=${session.ttl}s)`);

  if (contentType.includes('application/json')) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, session.value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      path: '/',
      maxAge: session.ttl,
    });
    return res;
  }

  // Form post — server-side редирект на /admin (надёжнее client-side router.replace)
  const next = url.searchParams.get('next') || '/admin';
  const target = new URL(next.startsWith('/') ? next : '/admin', req.url);
  const res = NextResponse.redirect(target, { status: 303 });
  res.cookies.set(ADMIN_COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps,
    path: '/',
    maxAge: session.ttl,
  });
  return res;
}
