'use client';

import { useResume } from '@/contexts/resume-context';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function SummaryForm() {
  const { resume, updateSection } = useResume();
  const wordCount = resume.summary.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="summary" className="text-xs font-medium text-muted-foreground">
          Professional Summary
        </Label>
        <span className={`text-xs tabular-nums ${wordCount > 200 ? 'text-destructive' : wordCount >= 50 ? 'text-pinterest-success-deep' : 'text-muted-foreground'}`}>
          {wordCount} / 50–200 words
        </span>
      </div>
      <Textarea
        id="summary"
        placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications..."
        value={resume.summary}
        onChange={(e) => updateSection('summary', e.target.value)}
        rows={5}
        className="rounded-xl resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Tip: Include key skills and accomplishments. ATS systems scan summaries for relevant keywords.
      </p>
    </div>
  );
}
