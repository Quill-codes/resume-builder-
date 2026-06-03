'use client';

import { useResume } from '@/contexts/resume-context';
import { Project } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, X } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

export function ProjectsForm() {
  const { resume, addListItem, removeListItem, updateListItem } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(resume.projects[0]?.id ?? null);
  const [techInput, setTechInput] = useState('');

  const handleAdd = () => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      startDate: '',
      endDate: '',
    };
    addListItem('projects', newProj);
    setExpandedId(newProj.id);
  };

  const handleUpdate = (index: number, updates: Partial<Project>) => {
    updateListItem('projects', index, { ...resume.projects[index], ...updates });
  };

  const addTech = (index: number) => {
    if (!techInput.trim()) return;
    const proj = resume.projects[index];
    handleUpdate(index, { techStack: [...proj.techStack, techInput.trim()] });
    setTechInput('');
  };

  const removeTech = (projIndex: number, techIndex: number) => {
    const proj = resume.projects[projIndex];
    handleUpdate(projIndex, { techStack: proj.techStack.filter((_, i) => i !== techIndex) });
  };

  return (
    <div className="space-y-3">
      {resume.projects.map((proj, index) => (
        <Card key={proj.id} className="rounded-xl border border-border overflow-hidden">
          <div
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{proj.name || 'New Project'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {proj.techStack.length > 0 ? proj.techStack.slice(0, 3).join(', ') : 'No technologies'}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={(e) => { e.stopPropagation(); removeListItem('projects', index); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {expandedId === proj.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>

          {expandedId === proj.id && (
            <div className="p-3 pt-0 space-y-3 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Project Name</Label>
                  <Input placeholder="My Awesome Project" value={proj.name} onChange={(e) => handleUpdate(index, { name: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea placeholder="Built a full-stack web application that..." value={proj.description} onChange={(e) => handleUpdate(index, { description: e.target.value })} rows={2} className="rounded-lg text-sm resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Live URL</Label>
                  <Input placeholder="https://project.com" value={proj.liveUrl} onChange={(e) => handleUpdate(index, { liveUrl: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Repository URL</Label>
                  <Input placeholder="github.com/user/project" value={proj.repoUrl} onChange={(e) => handleUpdate(index, { repoUrl: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input type="month" value={proj.startDate} onChange={(e) => handleUpdate(index, { startDate: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input type="month" value={proj.endDate} onChange={(e) => handleUpdate(index, { endDate: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
              </div>
              {/* Tech Stack */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tech Stack</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {proj.techStack.map((tech, techIdx) => (
                    <Badge key={techIdx} variant="secondary" className="gap-1 rounded-full px-2 py-0.5 text-xs">
                      {tech}
                      <button onClick={() => removeTech(index, techIdx)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="React" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTech(index)} className="rounded-lg h-9 text-sm" />
                  <Button variant="outline" size="sm" className="rounded-lg h-9" onClick={() => addTech(index)}>Add</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 border-dashed" onClick={handleAdd}>
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
