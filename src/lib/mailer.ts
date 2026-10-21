/**
 * Email delivery via the Resend REST API (fetch-based — no new dependency).
 * Password reset + email verification stay wired up; they activate when
 * RESEND_API_KEY + MAIL_FROM are configured in the environment.
 * Never logs addresses, links, or tokens — only a boolean outcome.
 */
export type MailKind = 'reset' | 'verify';

export function mailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

export async function sendMail(to: string, kind: MailKind, url: string): Promise<boolean> {
  if (!mailerConfigured()) return false;
  const subject =
    kind === 'reset'
      ? 'PyPath — Password reset'
      : 'PyPath — Verify your email';
  const body =
    kind === 'reset'
      ? `Someone requested a password reset for your PyPath account.\n\nOpen the link to choose a new password (one-time, 60 minutes):\n\n${url}\n\nIf you did not request this, you can ignore this email.`
      : `Welcome to PyPath!\n\nConfirm your email address (one-time, 24 hours):\n\n${url}\n\nIf you did not create an account, you can ignore this email.`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [to],
        subject,
        text: body,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
