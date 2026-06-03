'use client';

import { useEffect, useState } from 'react';
import { useResume } from '@/contexts/resume-context';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { TemplateType } from '@/types/resume';

interface Template {
  id: string;
  name: string;
  category: string;
  preview_image_url: string;
  is_premium: boolean;
  template_json: { type: TemplateType };
}

const FALLBACK_TEMPLATES: Template[] = [
  {
    id: 'fallback-ats',
    name: 'ATS-Friendly',
    category: 'Technical',
    preview_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fapJ5t64DuM4K1IlKgVOKFALw2kRbyeT2iydRAULC_BAG_rGjCnnIm_Dyu-o3lmaCGWeQNJNcakgrlFmZdqDni9g8qMz1M6UQSwGRpSoi3C-o4pev4iCpljkCVbjcPkf2a1v7L5k-aza1sVBRLQ-c2fMQBGmDyiJJNolGVE94JTCNt-ef1YckYBCDh7cFuQoUKPByxFVCxIUxgyJGdHabhqy5Csdmtj0gi2VWGH9uMJ_84Qsdllpzzz2SqpZx8akvAb-8w2TzUI',
    is_premium: false,
    template_json: { type: 'ats' }
  },
  {
    id: 'fallback-modern',
    name: 'Modern Color',
    category: 'Creative',
    preview_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC14M7B4q-5SUXjaMzM4ceVMPevjdv95AcS2YKN5ZrzeP6OCZ6yN3TUIOeQDV7tu5iWbz10yJEyHeOa4a_o2BQDhSH3pYmhyfIVsDtDRVESltwP7LWe0iSMz-7Wab-RVB5TXCseKwk5XKCgl2Y3bjOlAkZrpB6fow0jZd37SKFk_0RSLtBnA_ajrVMHTyK8OwJjwcSoWKimvLVWwg3SjAWc-YGyD3zHpnB5IiIXn8zSNIVlYlJ4IFVNDq43dqhpdkCkziENTvU2ghc',
    is_premium: false,
    template_json: { type: 'modern' }
  }
];

export function TemplateSelector() {
  const { resume, setTemplate } = useResume();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('templates').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTemplates(data as Template[]);
        } else {
          setTemplates(FALLBACK_TEMPLATES);
        }
      } catch (error) {
        console.error('Failed to fetch templates from Supabase, using fallbacks:', error);
        setTemplates(FALLBACK_TEMPLATES);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading templates...</p>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = activeCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Choose a Template</h2>
        <p className="text-sm text-muted-foreground">Select a layout that best fits your industry and style. Changes apply instantly.</p>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => {
          const isDynamic = tpl.template_json?.type === 'dynamic';
          const templateVal = isDynamic ? JSON.stringify(tpl.template_json) : tpl.template_json.type;
          const isSelected = resume.template === templateVal;
          
          return (
            <Card 
              key={tpl.id}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-primary shadow-md ring-2 ring-primary/20 scale-[1.02]' 
                  : 'border-border/40 hover:border-primary/50 hover:shadow-sm'
              }`}
              onClick={() => setTemplate(templateVal)}
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-muted relative">
                <img 
                  src={tpl.preview_image_url} 
                  alt={tpl.name}
                  className={`h-full w-full object-cover transition-transform duration-700 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                />
                {!isSelected && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-background/95 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                      Preview
                    </span>
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-tight">{tpl.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{tpl.category}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
