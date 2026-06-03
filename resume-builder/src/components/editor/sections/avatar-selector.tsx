'use client';

import { useRef } from 'react';
import { useResume } from '@/contexts/resume-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bot, Upload } from 'lucide-react';

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Bandit',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Mimi',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Midnight',
];

export function AvatarSelector() {
  const { resume, updateField } = useResume();
  const { photoUrl } = resume.personalInfo;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('personalInfo', 'photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 sm:col-span-2 mt-4 pt-4 border-t border-border/50">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5" /> Select Avatar
        </Label>
        {photoUrl && (
          <button 
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => updateField('personalInfo', 'photoUrl', '')}
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl gap-2 h-10 w-full sm:w-auto"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
          
          {photoUrl && !AVATARS.includes(photoUrl) && (
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary ring-2 ring-primary/20">
              <img src={photoUrl} alt="Custom avatar" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {AVATARS.map((url) => {
          const isSelected = photoUrl === url;
          return (
            <button
              key={url}
              onClick={() => updateField('personalInfo', 'photoUrl', url)}
              className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                isSelected 
                  ? 'border-primary ring-2 ring-primary/20 scale-110 bg-primary/10' 
                  : 'border-border/50 bg-muted hover:border-primary/50'
              }`}
            >
              <img src={url} alt="Avatar option" className="h-full w-full p-1 object-cover" />
            </button>
          );
        })}
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Choose a clean, tech-friendly avatar to stand out on modern resume templates.
      </p>
    </div>
  );
}
