'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Resume } from '@/types/resume';
import {
  listResumes,
  createNewResume,
  deleteResume,
  duplicateResume,
  exportResumeJSON,
  importResumeJSON,
} from '@/lib/resume-store';
import {
  Plus,
  MoreVertical,
  FileText,
  Copy,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Calendar,
  Layout,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [mounted, setMounted] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchResumes = async () => {
      const data = await listResumes();
      setResumes(data);
    };
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    const resume = await createNewResume();
    router.push(`/editor/${resume.id}`);
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateResume(id);
    if (dup) {
      const data = await listResumes();
      setResumes(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteResume(id);
    const data = await listResumes();
    setResumes(data);
    setDeleteConfirmId(null);
  };

  const handleExport = (resume: Resume) => {
    const json = exportResumeJSON(resume);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const imported = await importResumeJSON(importJson);
    if (imported) {
      const data = await listResumes();
      setResumes(data);
      setImportDialogOpen(false);
      setImportJson('');
      router.push(`/editor/${imported.id}`);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-[1200px] px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[280px] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-border"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import JSON</span>
          </Button>
        }
      />

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3" style={{ letterSpacing: '-1.2px' }}>
            Your Resumes
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            Create professional, ATS-optimized resumes that land interviews.
          </p>
        </div>

        {/* Resume Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {/* Create New Card */}
          <Card
            className="group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed border-border rounded-2xl bg-muted/30 transition-all hover:border-primary/40 hover:bg-muted/60 hover:shadow-lg"
            onClick={handleCreate}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Plus className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground text-base">Create New Resume</p>
              <p className="text-sm text-muted-foreground mt-1">Start from scratch</p>
            </div>
          </Card>

          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="group relative flex min-h-[280px] flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 cursor-pointer"
              onClick={() => router.push(`/editor/${resume.id}`)}
            >
              {/* Preview Header */}
              <div className="flex-1 p-5 pb-3">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="h-8 w-8 inline-flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem
                        className="gap-2 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(resume.id);
                        }}
                      >
                        <Copy className="h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(resume);
                        }}
                      >
                        <Download className="h-4 w-4" /> Export JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 rounded-lg text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(resume.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold text-foreground text-base mb-1 truncate">
                  {resume.title || 'Untitled Resume'}
                </h3>
                {resume.personalInfo.fullName && (
                  <p className="text-sm text-muted-foreground truncate">
                    {resume.personalInfo.fullName}
                    {resume.personalInfo.jobTitle ? ` — ${resume.personalInfo.jobTitle}` : ''}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    <Layout className="h-3 w-3" />
                    {resume.template === 'ats' ? 'ATS' : 'Modern'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="mt-12 text-center animate-fade-in-up">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No resumes yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Create your first resume to get started. Our AI-powered ATS analysis will help you land more interviews.
            </p>
            <Button onClick={handleCreate} size="lg" className="rounded-xl gap-2 px-6">
              <Plus className="h-4 w-4" />
              Create Your First Resume
            </Button>
          </div>
        )}
      </main>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Resume</DialogTitle>
            <DialogDescription>
              Paste a previously exported resume JSON to import it.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder='{"id": "...", "title": "My Resume", ...}'
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            rows={8}
            className="rounded-xl font-mono text-sm"
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleImport} disabled={!importJson.trim()}>
              Import & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the resume.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
