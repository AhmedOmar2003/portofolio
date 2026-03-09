'use client';

import { useState } from 'react';
import { sendContactEmail } from '@/app/actions/contact';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus({ type: 'success', message: result.message! });
      (e.target as HTMLFormElement).reset(); // Clear form on success
    } else {
      setStatus({ type: 'error', message: result.error! });
    }

    setIsPending(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
      <h3 className="text-xl font-bold text-zinc-50 mb-6">Send a Message</h3>
      
      {status && (
        <div 
          className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium ${
            status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="pt-0.5">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
            <input 
              type="text" 
              name="name" 
              id="name"
              required
              disabled={isPending}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50 disabled:opacity-50" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email"
              required
              disabled={isPending}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50 disabled:opacity-50" 
              placeholder="john@example.com" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-zinc-400">Subject (Optional)</label>
          <input 
            type="text" 
            name="subject" 
            id="subject"
            disabled={isPending}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50 disabled:opacity-50" 
            placeholder="Project Inquiry" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
          <textarea 
            name="message"
            id="message"
            rows={5} 
            required
            disabled={isPending}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-zinc-50 resize-none disabled:opacity-50" 
            placeholder="How can I help you?"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="btn btn-primary w-full py-4 text-base rounded-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
