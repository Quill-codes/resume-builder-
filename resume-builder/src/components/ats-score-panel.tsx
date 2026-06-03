'use client';

import { useEffect, useState } from 'react';
import { Resume, ATSScore } from '@/types/resume';
import { analyzeResume } from '@/lib/ats-analyzer';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Target,
} from 'lucide-react';

interface ATSScorePanelProps {
  resume: Resume;
  compact?: boolean;
}

export function ATSScorePanel({ resume, compact = false }: ATSScorePanelProps) {
  const [score, setScore] = useState<ATSScore | null>(null);
  const [expanded, setExpanded] = useState(!compact);

  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeResume(resume).then(setScore);
    }, 300);
    return () => clearTimeout(timer);
  }, [resume]);

  if (!score) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <Target className="h-4 w-4" />
        Analyzing...
      </div>
    );
  }

  const getScoreColor = (s: number) => {
    if (s >= 75) return 'text-green-600 dark:text-green-400';
    if (s >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (s: number) => {
    if (s >= 75) return 'bg-green-500';
    if (s >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 60) return 'Fair';
    if (s >= 40) return 'Needs Work';
    return 'Poor';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />;
      case 'warning': return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />;
      default: return <Info className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />;
    }
  };

  if (compact) {
    return (
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative h-6 w-6">
          <svg className="h-6 w-6 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted-foreground/20" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" strokeWidth="3"
              strokeDasharray={`${(score.overall / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className={getScoreColor(score.overall)}
              stroke="currentColor"
            />
          </svg>
        </div>
        <span className={`text-sm font-bold tabular-nums ${getScoreColor(score.overall)}`}>
          {score.overall}
        </span>
        <span className="text-xs text-muted-foreground">ATS</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted-foreground/15" />
            <circle
              cx="18" cy="18" r="15.5" fill="none" strokeWidth="2.5"
              strokeDasharray={`${(score.overall / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className={getScoreColor(score.overall)}
              stroke="currentColor"
              style={{ animation: 'gauge-fill 1s ease-out' }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums ${getScoreColor(score.overall)}`}>
            {score.overall}
          </span>
        </div>
        <div>
          <p className={`text-sm font-semibold ${getScoreColor(score.overall)}`}>
            {getScoreLabel(score.overall)}
          </p>
          <p className="text-xs text-muted-foreground">ATS Compatibility Score</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5">
        {score.breakdown.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{cat.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {cat.score}/{cat.maxScore}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreBg(
                  (cat.score / cat.maxScore) * 100
                )}`}
                style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {score.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Suggestions ({score.suggestions.length})
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1.5">
              {score.suggestions
                .sort((a, b) => {
                  const order = { critical: 0, warning: 1, info: 2 };
                  return order[a.severity] - order[b.severity];
                })
                .map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs"
                  >
                    {getSeverityIcon(suggestion.severity)}
                    <span className="text-foreground/80 leading-relaxed">{suggestion.message}</span>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {score.overall >= 85 && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-xs text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>Your resume is well-optimized for ATS systems!</span>
        </div>
      )}
    </div>
  );
}
