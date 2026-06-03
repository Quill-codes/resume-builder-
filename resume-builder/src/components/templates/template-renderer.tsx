'use client';

import React, { forwardRef } from 'react';
import { Resume } from '@/types/resume';
import { ATSTemplate } from './ats-template';
import { ModernTemplate } from './modern-template';
import { ConfigurableTemplate, TemplateConfig } from './configurable-template';

interface TemplateRendererProps {
  resume: Resume;
  scale?: number;
}

export const TemplateRenderer = forwardRef<HTMLDivElement, TemplateRendererProps>(
  function TemplateRenderer({ resume, scale = 1 }, ref) {
    return (
      <div
        ref={ref}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '794px',
          minHeight: '1123px',
        }}
      >
        {(() => {
          if (resume.template === 'ats') return <ATSTemplate resume={resume} />;
          if (resume.template === 'modern') return <ModernTemplate resume={resume} />;
          
          try {
            const config = JSON.parse(resume.template) as { type?: string, config?: TemplateConfig };
            if (config && config.type === 'dynamic' && config.config) {
              return <ConfigurableTemplate resume={resume} config={config.config} />;
            }
          } catch (e) {
            // Not a JSON string or parsing failed, fallback
          }
          
          return <ModernTemplate resume={resume} />;
        })()}
      </div>
    );
  }
);
