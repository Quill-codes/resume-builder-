'use client';

import { useResume } from '@/contexts/resume-context';
import { Experience } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

export function ExperienceForm() {
  const { resume, addListItem, removeListItem, updateListItem } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.experience[0]?.id ?? null
  );

  const handleAdd = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      bullets: [''],
    };
    addListItem('experience', newExp);
    setExpandedId(newExp.id);
  };

  const handleUpdate = (index: number, updates: Partial<Experience>) => {
    updateListItem('experience', index, { ...resume.experience[index], ...updates });
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
    const exp = resume.experience[expIndex];
    const bullets = [...exp.bullets];
    bullets[bulletIndex] = value;
    handleUpdate(expIndex, { bullets });
  };

  const addBullet = (expIndex: number) => {
    const exp = resume.experience[expIndex];
    handleUpdate(expIndex, { bullets: [...exp.bullets, ''] });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const exp = resume.experience[expIndex];
    handleUpdate(expIndex, { bullets: exp.bullets.filter((_, i) => i !== bulletIndex) });
  };

  return (
    <div className="space-y-3">
      {resume.experience.map((exp, index) => (
        <Card
          key={exp.id}
          className="rounded-xl border border-border overflow-hidden"
        >
          <div
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {exp.position || 'New Position'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {exp.company || 'Company'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                removeListItem('experience', index);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {expandedId === exp.id ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>

          {expandedId === exp.id && (
            <div className="p-3 pt-0 space-y-3 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) => handleUpdate(index, { position: e.target.value })}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <Input
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) => handleUpdate(index, { company: e.target.value })}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input
                    placeholder="Mountain View, CA"
                    value={exp.location}
                    onChange={(e) => handleUpdate(index, { location: e.target.value })}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={exp.isCurrentRole}
                      onCheckedChange={(checked) => handleUpdate(index, { isCurrentRole: checked, endDate: checked ? '' : exp.endDate })}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Label className="text-xs text-muted-foreground">Current Role</Label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleUpdate(index, { startDate: e.target.value })}
                    className="rounded-lg h-9 text-sm"
                  />
                </div>
                {!exp.isCurrentRole && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleUpdate(index, { endDate: e.target.value })}
                      className="rounded-lg h-9 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Bullet Points */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Achievements & Responsibilities</Label>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <span className="text-xs text-muted-foreground mt-2.5 select-none">•</span>
                    <Textarea
                      placeholder="Developed and maintained..."
                      value={bullet}
                      onChange={(e) => handleBulletChange(index, bulletIndex, e.target.value)}
                      rows={1}
                      className="rounded-lg text-sm resize-none flex-1 min-h-[36px]"
                    />
                    {exp.bullets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive flex-shrink-0 mt-0.5"
                        onClick={() => removeBullet(index, bulletIndex)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1 rounded-lg"
                  onClick={() => addBullet(index)}
                >
                  <Plus className="h-3 w-3" /> Add bullet
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full rounded-xl gap-2 border-dashed"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}
