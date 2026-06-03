'use client';

import { useResume } from '@/contexts/resume-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export function AchievementsForm() {
  const { resume, updateSection } = useResume();
  const achievements = resume.achievements;

  const handleChange = (index: number, value: string) => {
    const updated = [...achievements];
    updated[index] = value;
    updateSection('achievements', updated);
  };

  const handleAdd = () => {
    updateSection('achievements', [...achievements, '']);
  };

  const handleRemove = (index: number) => {
    updateSection('achievements', achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {achievements.map((achievement, index) => (
        <div key={index} className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-sm text-muted-foreground select-none">🏆</span>
          <Input
            placeholder="Won 1st place in national hackathon..."
            value={achievement}
            onChange={(e) => handleChange(index, e.target.value)}
            className="rounded-lg h-9 text-sm flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive flex-shrink-0"
            onClick={() => handleRemove(index)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 border-dashed" onClick={handleAdd}>
        <Plus className="h-4 w-4" /> Add Achievement
      </Button>

      {achievements.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Add awards, honors, or notable achievements.
        </p>
      )}
    </div>
  );
}
