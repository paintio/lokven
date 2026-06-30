import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { message: err.message || 'Login failed' },
        { status: 400 }
      );
    }

    const data = await response.json();

    const res = NextResponse.json({ user: data.user });

    // 🔐 КЛЮЧЕВОЕ ИЗМЕНЕНИЕ — COOKIE
    res.cookies.set('token', data.token, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    });

    res.cookies.set('user', JSON.stringify(data.user), {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
    });

    return res;
  } catch (e) {
    return NextResponse.json(
      { message: 'Internal error' },
      { status: 500 }
    );
  }
}