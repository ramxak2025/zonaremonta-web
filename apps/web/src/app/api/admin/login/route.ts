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
    // лёгкая задержка от brute-force
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  const session = makeSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: session.ttl,
  });
  return res;
}
