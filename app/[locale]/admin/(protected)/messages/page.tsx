import { createAdminClient } from '@/utils/supabase/admin';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminMessagesPage() {
  const supabase = createAdminClient();

  // Fetch all messages, newest first
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  // Server action to mark a message as read
  async function markAsRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const supabase = createAdminClient();
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    revalidatePath('/admin/messages');
    revalidatePath('/admin');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mail className="w-8 h-8 text-brand-primary" /> Inbox
        </h1>
        <p className="text-white/60">Manage inquiries received from your public contact form.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {messages && messages.length > 0 ? (
          <div className="divide-y divide-white/10">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-6 transition-colors ${msg.status === 'new' ? 'bg-white/5' : 'hover:bg-white/5'}`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                      {msg.status === 'new' && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">New</span>
                      )}
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-brand-primary text-sm hover:underline">{msg.email}</a>
                  </div>
                  <div className="flex flex-col md:items-end gap-2 text-white/40 text-sm">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleString()}</span>
                    
                    {msg.status === 'new' && (
                      <form action={markAsRead}>
                        <input type="hidden" name="id" value={msg.id} />
                        <button type="submit" className="text-white/60 hover:text-white flex items-center gap-1 text-xs mt-2 transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark as Read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  {msg.subject && <h4 className="text-white font-medium mb-2 pb-2 border-b border-white/10">Subject: {msg.subject}</h4>}
                  <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Inbox is empty</h3>
            <p className="text-white/40">When visitors contact you, their messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
