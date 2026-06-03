'use client';

import { useState } from 'react';
import { useResume } from '@/contexts/resume-context';
import { PRESETS, Preset } from '@/lib/presets';
import { Card } from '@/components/ui/card';


export function PresetGallery() {
  const { resume, updateSection, setTemplate } = useResume();
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const handleSelectPreset = (preset: Preset) => {
    const confirmed = window.confirm(
      `Apply ${preset.name} Preset?\n\nThis will overwrite your current resume content (name, experience, skills, etc.) with placeholder data tailored for this career path.\n\nAre you sure you want to proceed?`
    );
    if (confirmed) {
      handleApplyPreset(preset);
    }
  };

  const handleApplyPreset = (preset: Preset) => {
    // Apply template
    setTemplate(preset.resumeData.template as any);
    
    // Apply all other sections
    const sectionsToCopy = [
      'personalInfo', 'summary', 'experience', 'education', 
      'skills', 'projects', 'certifications', 'achievements', 'languages'
    ] as const;

    sectionsToCopy.forEach((section) => {
      if (preset.resumeData[section]) {
        updateSection(section, preset.resumeData[section]);
      }
    });

    setSelectedPreset(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-foreground">Start from a Preset</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Click an image to instantly load a fully populated, standard resume layout for your career path.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {PRESETS.map((preset) => (
          <Card 
            key={preset.id}
            className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-sm"
            onClick={() => handleSelectPreset(preset)}
          >
            <div className="aspect-[3/4] w-full overflow-hidden bg-muted relative">
              <img 
                src={preset.image} 
                alt={preset.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Use Preset
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-2 border-t border-border/50 text-center">
              <p className="font-semibold text-xs text-foreground leading-tight">{preset.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
