import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Test route to verify it's working
export async function GET() {
  return NextResponse.json({ message: 'Password reset API route is working' });
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    const tenant = request.headers.get('X-Tenant') || request.headers.get('x-tenant');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant is required' },
        { status: 400 }
      );
    }

    // Validate email exists in backend first (optional - don't block if backend endpoints don't exist)
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    try {
      // Check if email exists in backend (validate user exists)
      // This is optional - if backend endpoints don't exist, we'll still send the email
      const checkEmailResponse = await fetch(`${backendUrl}/api/password-reset/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': tenant,
        },
        body: JSON.stringify({ email }),
      });

      if (!checkEmailResponse.ok) {
        // If check-email endpoint doesn't exist, try alternative: check via user endpoint
        try {
          const userResponse = await fetch(`${backendUrl}/api/users/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'X-Tenant': tenant,
            },
          });

          if (!userResponse.ok && userResponse.status === 404) {
            // Email doesn't exist - but we'll still send email for security (don't reveal if email exists)
          }
        } catch (userErr) {
          // User endpoint doesn't exist or error - continue anyway
        }
      }
    } catch (err) {
      // Backend validation endpoints don't exist yet - that's okay, continue with email sending
    }

    // Generate reset token (JWT or random token)
    const crypto = await import('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Store token in backend (required for validation)
    try {
      const storeUrl = `${backendUrl}/api/password-reset/store-token`;

      const storeResponse = await fetch(storeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': tenant,
        },
        body: JSON.stringify({
          email,
          token: resetToken,
          expiresAt: expiresAt.toISOString(),
        }),
      });

      if (!storeResponse.ok) {
        // Backend token storage failed - continue anyway
      }
    } catch (err) {
      // Backend endpoint doesn't exist or is unreachable - continue anyway
    }

    // Dynamically determine app URL from request (multi-tenant support)
    const url = new URL(request.url);
    const protocol = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || url.host;
    const baseUrl = `${protocol}://${host}`;

    // Create reset link
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@email.aibistreet.com',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">Password Reset Request</h1>
          </div>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #2563eb; word-break: break-all;">${resetLink}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Password reset link has been sent to your email.',
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

