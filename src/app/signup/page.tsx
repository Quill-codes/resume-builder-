'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { syncLocalToCloud } from '@/lib/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, FileText } from 'lucide-react';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const autoDownload = searchParams.get('autoDownload');

  useEffect(() => {
    // Check if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        let redirectUrl = returnTo;
        if (autoDownload) {
          redirectUrl += `?autoDownload=${autoDownload}`;
        }
        router.push(redirectUrl);
      }
    };
    checkSession();
  }, [supabase, router, returnTo, autoDownload]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnTo)}`,
        }
      });

      if (error) throw error;

      await syncLocalToCloud();

      // On successful signup, immediately log them in (if email confirmation is off)
      // or redirect. For simplicity, we just redirect back.
      let redirectUrl = returnTo;
      if (autoDownload) {
        redirectUrl += `?autoDownload=${autoDownload}`;
      }
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Link href="/" className="flex items-center gap-2.5 group mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary text-primary-foreground transition-transform group-hover:scale-105">
          <FileText className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">
          rizzume
        </span>
      </Link>
      
      <div className="w-full max-w-[420px] bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{autoDownload ? 'Sign up to download' : 'Create your account'}</h1>
          <p className="text-sm text-muted-foreground">{autoDownload ? 'Create a free account to download and save your resume' : 'Join thousands of professionals'}</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 px-4 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 px-4 rounded-xl"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl font-bold text-sm mt-4"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (autoDownload ? 'Sign up to download' : 'Sign up')}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={`/signin?returnTo=${encodeURIComponent(returnTo)}${autoDownload ? `&autoDownload=${autoDownload}` : ''}`} className="font-bold text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SignUpForm />
    </Suspense>
  );
}
