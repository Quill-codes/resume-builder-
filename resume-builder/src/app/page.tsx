'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutGrid, 
  FileEdit, 
  DownloadCloud, 
  CheckCircle2, 
  LogOut,
  ArrowRight,
  Globe,
  Share2,
  Link as LinkIcon,
  Star,
  Zap
} from 'lucide-react';

import { createNewResume, saveResume } from '@/lib/resume-store';
import { RizzumeLogo } from '@/components/ui/rizzume-logo';

export default function LandingPage() {
  const [session, setSession] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleCreateAndEdit = async () => {
    try {
      setIsCreating(true);
      const newResume = await createNewResume();
      await saveResume(newResume);
      router.push(`/editor/${newResume.id}`);
    } catch (err) {
      console.error('Failed to create resume:', err);
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll('.masonry-scroll-item');
      const scrollPos = window.scrollY;
      items.forEach((item, index) => {
        const speed = (index + 1) * 0.1;
        (item as HTMLElement).style.transform = `translateY(${scrollPos * speed * -0.2}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <RizzumeLogo size={28} />
              <span className="text-2xl font-bold tracking-tighter text-primary">rizzume</span>
            </div>
            <div className="hidden md:flex gap-6">
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="rounded-full font-semibold text-sm">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="rounded-full font-semibold text-sm px-6 gap-2">
                  <LogOut className="h-4 w-4" /> Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="rounded-full font-semibold text-sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full font-semibold text-sm px-6">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-[70px] font-bold leading-[1.1] tracking-[-1.2px] text-foreground">
              Create a resume that <span className="text-primary">gets you hired.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Experience the first resume builder inspired by the visual discovery of Pinterest. Modular, elegant, and engineered to pass every ATS check.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full font-bold text-sm px-8 h-12 shadow-sm hover:scale-95 transition-transform gap-2"
                onClick={handleCreateAndEdit}
                disabled={isCreating}
              >
                <Zap className="h-4 w-4" />
                Build Your Resume
                <ArrowRight className="h-4 w-4" />
              </Button>
              {!session && (
                <Link href="/signin">
                  <Button variant="outline" size="lg" className="rounded-full font-bold text-sm px-8 h-12">
                    I already have an account
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="relative h-[600px] overflow-hidden hidden lg:block">
            <div className="grid grid-cols-2 gap-4 absolute inset-0">
              <div className="space-y-4 pt-12">
                <div className="masonry-scroll-item bg-muted rounded-2xl overflow-hidden relative group h-[280px]">
                  <img 
                    alt="Template Preview" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUuqKfmhHPjGsQ0axqS9DKA7P0AZl_ly5Z8kazsJlhMqET180PreNlmtIEKxSCCgp8Ax-u5hLYDhq-CsucSKczy1aVzVjO7J8a_Cl6WLFA38wrCb0KfdpvGUvHHgw9BgqcxXFLZwSEiq5wZ67qHTyeefpmjfSzKciw-kFoQi165SbQ4hztJC7EIsyAzOTOTdNd8xNCWHiKOmSk_Nk8n-4oWD9bk40apHyfvvJrB857aG81FgJqlTTeM4AkXBOLfh9HoylUv6VdhY4"
                  />
                </div>
                <div className="masonry-scroll-item bg-muted rounded-2xl overflow-hidden relative group h-[340px]">
                  <img 
                    alt="Template Preview" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWTCBd9bWZi_0BA2FVOTSv-_qUPZ8QEuvCFitA1Pe8FgHrC_r2rJO5KmcRU5J4tCM1GCcYb61uoG3VGZGBRJRRExm1ia770YUNZU1Ug1BgCJA98oEaFb1XIMKX4V5j7pKs1kLJraoNxenddtkGASIe8fDG0YsYLhlHsbYQXWZl9bCDZLIcqvFhu2Nm83D-YS_sArCE53C-cyl4n0_0FgdWQ8W6A6s3m5LUtd2hvs-iX9_SeFs3haQT-aSlYPffYdowfu4GyCdWEjc"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="masonry-scroll-item bg-muted rounded-2xl overflow-hidden relative group h-[340px]">
                  <img 
                    alt="Template Preview" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBslVi2LEK_fsGZwJ5mVipFGj3EZKeBZbMuexOwTGtKr22mbYB3iskcsFhXP0vm-6FXtWaF9O_gLcNYsqp8dLgOgagkml7cZUwPu6_ZUqIHoLFPC054OULL2KSfHEd0LQz-LaP82j9gmQhXqNc9J26msWt1-uaKGD1vCHMFNnzW8ezHaVpQDYQ0rATasyhVs7xM2gpr8dUYPXUBhEwbi5LGhE9jpuouAO-c3GTNoEcg_4iBeRht9h2JvdR7sCkGaa306UnS88P5k"
                  />
                </div>
                <div className="masonry-scroll-item bg-muted rounded-2xl overflow-hidden relative group h-[280px]">
                  <img 
                    alt="Template Preview" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_WFxA9_panWx1LPn5ydT0-Dhqs1xB_JjV6S4D7qsVjkYfNnXKRRsNSoZTi_G5wrsmUkv-zgPv1POOFIXA_SjsS9KgTVAOQL2_BGHR1H9n4NkfMXf5c74eLIFDj-xTf8gx45TzLxjWG7-bG3_dClbrDaTEMpnzmMONbI3K4uK8tcQkwaqHgqrq4PUeN59WueTctATPsgGIK9L6OHhI_bAStDP6rvD4BEn_R2K5Mg1zKYgdZ6peVLzvYc0A_3BSUoSE2OByyydSWxE"
                  />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/80"></div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Bring your favorite ideas to life</h2>
            <p className="text-lg text-muted-foreground">A simple 3-step process to a world-class resume.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Pick a template → Dashboard */}
            <div 
              className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/50 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 group-hover:bg-primary transition-colors duration-300">
                <LayoutGrid className="text-primary group-hover:text-primary-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">1. Pick a template</h3>
              <p className="text-muted-foreground leading-relaxed">Select from our curated gallery of ATS-optimized designs tailored for your specific industry.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Browse templates <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            {/* Step 2: Fill in details → Create resume & open editor */}
            <div 
              className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/50 cursor-pointer"
              onClick={handleCreateAndEdit}
            >
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 group-hover:bg-primary transition-colors duration-300">
                <FileEdit className="text-primary group-hover:text-primary-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">2. Fill in details</h3>
              <p className="text-muted-foreground leading-relaxed">Use our intuitive editor to drag, drop, and craft your experience with real-time preview.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Start editing <ArrowRight className="h-4 w-4" />
              </div>
            </div>
            {/* Step 3: Download → Sign in */}
            <div 
              className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/50 cursor-pointer"
              onClick={() => router.push('/signin')}
            >
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6 group-hover:bg-primary transition-colors duration-300">
                <DownloadCloud className="text-primary group-hover:text-primary-foreground h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">3. Download & Apply</h3>
              <p className="text-muted-foreground leading-relaxed">Export a pixel-perfect PDF and start your application journey with confidence.</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Sign in to download <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="max-w-[1440px] mx-auto px-4 md:px-8 py-24">
          <div className="bg-zinc-900 rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden relative">
            <div className="space-y-8 relative z-10">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Built for performance</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">Powerful features for the modern applicant</h2>
              <ul className="space-y-4">
                <li className="flex gap-4 items-center text-zinc-200">
                  <CheckCircle2 className="text-zinc-400 h-5 w-5" />
                  <span className="text-lg">ATS-Optimized Formatting</span>
                </li>
                <li className="flex gap-4 items-center text-zinc-200">
                  <CheckCircle2 className="text-zinc-400 h-5 w-5" />
                  <span className="text-lg">Live Real-time Preview</span>
                </li>
                <li className="flex gap-4 items-center text-zinc-200">
                  <CheckCircle2 className="text-zinc-400 h-5 w-5" />
                  <span className="text-lg">AI-Powered Skill Suggestions</span>
                </li>
                <li className="flex gap-4 items-center text-zinc-200">
                  <CheckCircle2 className="text-zinc-400 h-5 w-5" />
                  <span className="text-lg">Custom Brand Color Accents</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] lg:h-full min-h-[300px]">
              <div className="absolute top-0 right-0 w-[120%] h-[120%] rotate-3 bg-zinc-800/50 rounded-2xl backdrop-blur-3xl border border-white/10 p-6 shadow-2xl">
                <div className="bg-white rounded-xl h-full w-full p-6 overflow-hidden flex flex-col gap-4">
                  <div className="h-12 w-full bg-muted rounded-lg flex items-center px-4 gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                    <div className="h-4 w-32 bg-border/50 rounded-md"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-3/4 bg-border/40 rounded-md"></div>
                    <div className="h-4 w-1/2 bg-border/40 rounded-md"></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/20"></div>
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/20"></div>
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-24">
          <div className="bg-primary rounded-[40px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 gap-4 rotate-12 -translate-y-1/2">
                <div className="h-64 bg-white rounded-2xl"></div>
                <div className="h-64 bg-white rounded-2xl mt-12"></div>
                <div className="h-64 bg-white rounded-2xl"></div>
                <div className="h-64 bg-white rounded-2xl mt-12"></div>
                <div className="h-64 bg-white rounded-2xl"></div>
                <div className="h-64 bg-white rounded-2xl mt-12"></div>
                <div className="h-64 bg-white rounded-2xl"></div>
                <div className="h-64 bg-white rounded-2xl mt-12"></div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-foreground relative z-10 leading-tight">
              Ready to build your career legacy?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals who have landed roles at world-class companies using rizzume&apos;s Pinterest-inspired editor.
            </p>
            <div className="pt-4 relative z-10">
              <Button 
                variant="secondary" 
                size="lg" 
                className="rounded-full font-bold text-base px-10 h-14 shadow-xl hover:scale-95 transition-transform text-primary hover:text-primary hover:bg-white bg-white gap-2"
                onClick={handleCreateAndEdit}
                disabled={isCreating}
              >
                <Zap className="h-5 w-5" />
                Build Your Resume Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Brand */}
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-2">
                <RizzumeLogo size={28} />
                <span className="text-2xl font-bold tracking-tighter text-primary">rizzume</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Pinterest-inspired resume builder for the modern professional. 100% free, forever.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm text-muted-foreground font-medium">Made by —</span>
                <a href="https://www.linkedin.com/in/muhab-ahmad-khan-1357a4375" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200" title="LinkedIn">
                  <LinkIcon className="h-4 w-4" />
                </a>
                <a href="https://github.com/Quill-codes" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200" title="GitHub">
                  <Share2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-12 md:gap-16">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Product</h4>
                <ul className="space-y-3">
                  <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                  <li><Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</Link></li>
                  <li><Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border/40 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} rizzume. All rights reserved.</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Made with <Star className="h-3 w-3 text-primary fill-primary" /> for job seekers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
