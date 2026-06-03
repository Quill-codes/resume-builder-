'use client';

import { useResume } from '@/contexts/resume-context';
import { Education } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, X } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

export function EducationForm() {
  const { resume, addListItem, removeListItem, updateListItem } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.education[0]?.id ?? null
  );
  const [courseworkInput, setCourseworkInput] = useState('');

  const handleAdd = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: [],
    };
    addListItem('education', newEdu);
    setExpandedId(newEdu.id);
  };

  const handleUpdate = (index: number, updates: Partial<Education>) => {
    updateListItem('education', index, { ...resume.education[index], ...updates });
  };

  const addCoursework = (index: number) => {
    if (!courseworkInput.trim()) return;
    const edu = resume.education[index];
    handleUpdate(index, { coursework: [...edu.coursework, courseworkInput.trim()] });
    setCourseworkInput('');
  };

  const removeCoursework = (eduIndex: number, cwIndex: number) => {
    const edu = resume.education[eduIndex];
    handleUpdate(eduIndex, { coursework: edu.coursework.filter((_, i) => i !== cwIndex) });
  };

  return (
    <div className="space-y-3">
      {resume.education.map((edu, index) => (
        <Card key={edu.id} className="rounded-xl border border-border overflow-hidden">
          <div
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {edu.degree || 'New Degree'}{edu.field ? ` in ${edu.field}` : ''}
              </p>
              <p className="text-xs text-muted-foreground truncate">{edu.institution || 'Institution'}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); removeListItem('education', index); }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {expandedId === edu.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>

          {expandedId === edu.id && (
            <div className="p-3 pt-0 space-y-3 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Institution</Label>
                  <Input placeholder="MIT" value={edu.institution} onChange={(e) => handleUpdate(index, { institution: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Degree</Label>
                  <Input placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => handleUpdate(index, { degree: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Field of Study</Label>
                  <Input placeholder="Computer Science" value={edu.field} onChange={(e) => handleUpdate(index, { field: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input placeholder="Cambridge, MA" value={edu.location} onChange={(e) => handleUpdate(index, { location: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">GPA</Label>
                  <Input placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => handleUpdate(index, { gpa: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Input type="month" value={edu.startDate} onChange={(e) => handleUpdate(index, { startDate: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Input type="month" value={edu.endDate} onChange={(e) => handleUpdate(index, { endDate: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
              </div>
              {/* Coursework */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Relevant Coursework</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {edu.coursework.map((course, cwIdx) => (
                    <span key={cwIdx} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                      {course}
                      <button onClick={() => removeCoursework(index, cwIdx)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Data Structures"
                    value={courseworkInput}
                    onChange={(e) => setCourseworkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCoursework(index)}
                    className="rounded-lg h-9 text-sm"
                  />
                  <Button variant="outline" size="sm" className="rounded-lg h-9" onClick={() => addCoursework(index)}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 border-dashed" onClick={handleAdd}>
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
