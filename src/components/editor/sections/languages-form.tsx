'use client';

import { useResume } from '@/contexts/resume-context';
import { Language } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/utils';

const PROFICIENCY_LEVELS: { value: Language['proficiency']; label: string }[] = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'basic', label: 'Basic' },
];

export function LanguagesForm() {
  const { resume, addListItem, removeListItem, updateListItem } = useResume();

  const handleAdd = () => {
    const newLang: Language = {
      id: generateId(),
      name: '',
      proficiency: 'intermediate',
    };
    addListItem('languages', newLang);
  };

  const handleUpdate = (index: number, updates: Partial<Language>) => {
    updateListItem('languages', index, { ...resume.languages[index], ...updates });
  };

  return (
    <div className="space-y-3">
      {resume.languages.map((lang, index) => (
        <div key={lang.id} className="flex items-center gap-2">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground sr-only">Language</Label>
              <Input
                placeholder="English"
                value={lang.name}
                onChange={(e) => handleUpdate(index, { name: e.target.value })}
                className="rounded-lg h-9 text-sm"
              />
            </div>
            <Select
              value={lang.proficiency}
              onValueChange={(val) => handleUpdate(index, { proficiency: val as Language['proficiency'] })}
            >
              <SelectTrigger className="rounded-lg h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PROFICIENCY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive flex-shrink-0"
            onClick={() => removeListItem('languages', index)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 border-dashed" onClick={handleAdd}>
        <Plus className="h-4 w-4" /> Add Language
      </Button>
    </div>
  );
}
