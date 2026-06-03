'use client';

import { use, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ResumeProvider, useResume } from '@/contexts/resume-context';
import { Header } from '@/components/header';
import { TemplateRenderer } from '@/components/templates/template-renderer';
import { ATSScorePanel } from '@/components/ats-score-panel';
import { PersonalInfoForm } from '@/components/editor/sections/personal-info-form';
import { SummaryForm } from '@/components/editor/sections/summary-form';
import { ExperienceForm } from '@/components/editor/sections/experience-form';
import { EducationForm } from '@/components/editor/sections/education-form';
import { SkillsForm } from '@/components/editor/sections/skills-form';
import { ProjectsForm } from '@/components/editor/sections/projects-form';
import { CertificationsForm } from '@/components/editor/sections/certifications-form';
import { AchievementsForm } from '@/components/editor/sections/achievements-form';
import { LanguagesForm } from '@/components/editor/sections/languages-form';
import { TemplateSelector } from '@/components/editor/template-selector';
import { PresetGallery } from '@/components/editor/sections/preset-gallery';
import { exportToPDF } from '@/lib/pdf-export';
import { exportResumeJSON } from '@/lib/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Download,
  FileJson,
  Eye,
  PenLine,
  Layout,
  Check,
  Loader2,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderKanban,
  Award,
  Trophy,
  Languages,
  BarChart3,
  ChevronLeft,
  LogOut,
  User as UserIcon,
  Star,
} from 'lucide-react';

interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { id } = use(params);
  return (
    <ResumeProvider resumeId={id}>
      <EditorContent />
    </ResumeProvider>
  );
}

function EditorContent() {
  const { resume, setTemplate, setTitle, isDirty } = useResume();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [previewScale, setPreviewScale] = useState(0.5);
  const [showATS, setShowATS] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<any>(null);
  const supabase = createClient();

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

  // Calculate preview scale based on container width
  const updatePreviewScale = useCallback(() => {
    if (previewContainerRef.current) {
      const containerWidth = previewContainerRef.current.clientWidth - 32; // padding
      const scale = Math.min(containerWidth / 794, 0.75);
      setPreviewScale(scale);
    }
  }, []);

  useEffect(() => {
    updatePreviewScale();
    window.addEventListener('resize', updatePreviewScale);
    return () => window.removeEventListener('resize', updatePreviewScale);
  }, [updatePreviewScale]);

  useEffect(() => {
    const checkAutoDownload = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('autoDownload') === 'true') {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Remove autoDownload from URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            // Give the preview a small amount of time to render fully
            setTimeout(() => {
              handleExportPDF();
            }, 1000);
          }
        }
      }
    };
    checkAutoDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExportPDF() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push(`/signin?returnTo=${encodeURIComponent(`/editor/${resume.id}`)}&autoDownload=true`);
      return;
    }

    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const filename = `${resume.personalInfo.fullName || resume.title || 'resume'}_resume.pdf`
        .replace(/[^a-zA-Z0-9_.\-]/g, '_');
      await exportToPDF(previewRef.current, filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    const json = exportResumeJSON(resume);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sectionIcons: Record<string, React.ReactNode> = {
    personalInfo: <User className="h-4 w-4" />,
    summary: <FileText className="h-4 w-4" />,
    experience: <Briefcase className="h-4 w-4" />,
    education: <GraduationCap className="h-4 w-4" />,
    skills: <Sparkles className="h-4 w-4" />,
    projects: <FolderKanban className="h-4 w-4" />,
    certifications: <Award className="h-4 w-4" />,
    achievements: <Trophy className="h-4 w-4" />,
    languages: <Languages className="h-4 w-4" />,
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-border bg-card/80 backdrop-blur-xl px-3 sm:px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg flex-shrink-0"
            onClick={() => router.push('/dashboard')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            value={resume.title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-8 border-0 bg-transparent text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 px-1.5 max-w-[200px] sm:max-w-[300px]"
            placeholder="Resume Title"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
            {isDirty ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>
            ) : (
              <><Check className="h-3 w-3 text-green-500" /> Saved</>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* ATS Score (compact) */}
          <Sheet open={showATS} onOpenChange={setShowATS}>
            <SheetTrigger>
              <span className="hidden sm:flex">
                <ATSScorePanel resume={resume} compact />
              </span>
            </SheetTrigger>
            <SheetContent className="w-[380px] sm:w-[420px] rounded-l-2xl">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  ATS Analysis
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ATSScorePanel resume={resume} />
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl gap-1.5 text-xs hidden sm:flex"
            onClick={handleExportJSON}
          >
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </Button>

          <Button onClick={handleExportPDF} disabled={isExporting} size="sm" className="h-8 px-2 sm:px-3 text-xs sm:text-sm shadow-sm hover:scale-105 transition-transform">
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <Download className="h-4 w-4 sm:mr-2" />}
            <span className="hidden sm:inline">PDF</span>
          </Button>
          
          {session ? (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => router.push('/signin')} className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Sign in">
              <UserIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="flex sm:hidden border-b border-border">
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === 'edit'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setMobileTab('edit')}
        >
          <PenLine className="h-4 w-4" /> Edit
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === 'preview'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setMobileTab('preview')}
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-[420px] lg:w-[460px] border-r border-border flex-shrink-0 bg-background overflow-y-auto`}>
          <div className="p-4">
            {/* Mobile Template + ATS */}
            <div className="flex sm:hidden items-center gap-2 mb-4">
              <Sheet open={showATS} onOpenChange={setShowATS}>
                <SheetTrigger>
                  <span>
                    <ATSScorePanel resume={resume} compact />
                  </span>
                </SheetTrigger>
              </Sheet>
            </div>

            <Accordion
              className="space-y-2"
            >
              <AccordionItem value="template" className="border-border/50 bg-card/50 rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Layout className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">Template</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <TemplateSelector />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="presets" className="border-border/50 bg-card/50 rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Star className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">Inspirations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <PresetGallery />
                </AccordionContent>
              </AccordionItem>
              {[
                { key: 'personalInfo', label: 'Personal Info', form: <PersonalInfoForm /> },
                { key: 'summary', label: 'Summary', form: <SummaryForm /> },
                { key: 'experience', label: 'Experience', form: <ExperienceForm /> },
                { key: 'education', label: 'Education', form: <EducationForm /> },
                { key: 'skills', label: 'Skills', form: <SkillsForm /> },
                { key: 'projects', label: 'Projects', form: <ProjectsForm /> },
                { key: 'certifications', label: 'Certifications', form: <CertificationsForm /> },
                { key: 'achievements', label: 'Achievements', form: <AchievementsForm /> },
                { key: 'languages', label: 'Languages', form: <LanguagesForm /> },
              ].map(({ key, label, form }) => (
                <AccordionItem
                  key={key}
                  value={key}
                  className="border border-border rounded-xl px-3 data-[state=open]:bg-card/50"
                >
                  <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline gap-2 [&>svg]:h-4 [&>svg]:w-4">
                    <div className="flex items-center gap-2">
                      {sectionIcons[key]}
                      {label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">{form}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Preview Panel */}
        <div
          ref={previewContainerRef}
          className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} sm:flex flex-1 flex-col bg-muted/30 overflow-auto items-center`}
        >
          <div className="p-4 w-full flex justify-center">
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                marginBottom: `${-(1123 * (1 - previewScale))}px`,
              }}
            >
              <div
                ref={previewRef}
                className="shadow-2xl rounded-lg overflow-hidden"
                style={{ width: '794px', minHeight: '1123px' }}
              >
                {resume.template === 'ats' ? (
                  <TemplateRenderer resume={resume} scale={1} />
                ) : (
                  <TemplateRenderer resume={resume} scale={1} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
