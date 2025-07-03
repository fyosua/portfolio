// src/app/api/verify-recaptcha/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { success: false, message: 'reCAPTCHA secret key is not set.' },
      { status: 500 }
    );
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(verificationUrl, { method: 'POST' });
    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // data['error-codes'] contains more info on failure
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification failed.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error verifying reCAPTCHA.' },
      { status: 500 }
    );
  }
}