'use server';

import { createAdminClient } from '@/utils/supabase/admin';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendContactEmail(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const subject = (formData.get('subject') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  // Basic server-side validation
  if (!name || !email || !message) {
    return { success: false, error: 'Name, email, and message are required fields.' };
  }

  // Length validation to prevent abuse
  if (name.length > 100 || email.length > 254 || (subject && subject.length > 200) || message.length > 5000) {
    return { success: false, error: 'One or more fields exceed the maximum allowed length.' };
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY environment variable. Emails cannot be sent.');
    return { success: false, error: 'Server configuration error. Please try again later.' };
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = subject ? escapeHtml(subject) : 'N/A';
  const safeMessage = escapeHtml(message);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'ahmedessam.uiux@gmail.com',
        subject: `New Contact: ${safeSubject}`,
        reply_to: email,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #05f26c;">New Message from Portfolio</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${safeMessage}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend API Error:', errorData);
      return { success: false, error: 'Failed to send email. Please try again.' };
    }

    // After successful email, save to Supabase using the admin/service role client
    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([
        { name, email, subject, message }
      ]);
      
    if (dbError) {
      console.error('Supabase Error saving contact message:', dbError);
      // We still return true because the email itself was sent successfully
    }

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
