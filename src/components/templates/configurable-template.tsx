'use client';

import { Resume } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Globe, Link, GitBranch } from 'lucide-react';

export interface TemplateConfig {
  fontFamily?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: 'standard' | 'sidebar-left' | 'sidebar-right' | 'minimal';
  headerVariant?: 'standard' | 'gradient' | 'dark' | 'sidebar';
  sectionStyle?: 'clean' | 'boxed' | 'lined' | 'pill';
}

interface ConfigurableTemplateProps {
  resume: Resume;
  config: TemplateConfig;
}

export function ConfigurableTemplate({ resume, config }: ConfigurableTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages } = resume;

  // Defaults
  const font = config.fontFamily || 'Inter, sans-serif';
  const primary = config.primaryColor || '#000000';
  const bg = config.backgroundColor || '#ffffff';
  const textCol = config.textColor || '#333333';
  const layout = config.layout || 'standard';
  const header = config.headerVariant || 'standard';
  const secStyle = config.sectionStyle || 'clean';

  const isDarkText = textCol === '#333333';
  const mutedText = isDarkText ? '#666666' : '#a1a1aa';
  const borderCol = isDarkText ? '#e5e5e5' : '#3f3f46';

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const getHeaderStyles = () => {
    if (header === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${primary} 0%, #000000 100%)`,
        color: '#ffffff',
        padding: '32px 40px',
      };
    }
    if (header === 'dark') {
      return {
        background: '#18181b',
        color: '#ffffff',
        padding: '32px 40px',
        borderBottom: `4px solid ${primary}`
      };
    }
    // Standard
    return {
      background: 'transparent',
      color: textCol,
      padding: '32px 40px 16px 40px',
      borderBottom: `2px solid ${primary}`
    };
  };

  const getSectionTitleStyles = () => {
    const base = {
      fontSize: '13pt',
      fontWeight: 700,
      color: header === 'sidebar' && (layout === 'sidebar-left' || layout === 'sidebar-right') ? textCol : primary,
      textTransform: 'uppercase' as const,
      letterSpacing: '1.5px',
      marginBottom: '16px',
    };
    if (secStyle === 'lined') {
      return { ...base, borderBottom: `2px solid ${borderCol}`, paddingBottom: '6px' };
    }
    if (secStyle === 'boxed') {
      return { ...base, background: primary, color: '#ffffff', padding: '6px 12px', borderRadius: '4px', display: 'inline-block' };
    }
    if (secStyle === 'pill') {
      return { ...base, background: `${primary}15`, color: primary, padding: '6px 16px', borderRadius: '100px', display: 'inline-block' };
    }
    return base;
  };

  const contactIconStyle = { width: '12px', height: '12px', opacity: 0.7, flexShrink: 0, marginTop: '2px' };

  const renderHeader = () => {
    // If header is 'sidebar' and we have a sidebar layout, we render it inside the sidebar instead of here.
    if (header === 'sidebar' && (layout === 'sidebar-left' || layout === 'sidebar-right')) return null;

    return (
      <div style={getHeaderStyles()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32pt', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p style={{ fontSize: '14pt', fontWeight: 500, marginTop: '8px', opacity: 0.9, letterSpacing: '0.5px' }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          {personalInfo.photoUrl && (
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${primary}`, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={personalInfo.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        
        {/* Contact Row for standard/minimal layouts */}
        {(layout === 'standard' || layout === 'minimal') && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px', fontSize: '9.5pt', opacity: 0.85, fontWeight: 500 }}>
            {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail style={contactIconStyle}/>{personalInfo.email}</div>}
            {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone style={contactIconStyle}/>{personalInfo.phone}</div>}
            {personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin style={contactIconStyle}/>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Link style={contactIconStyle}/>{personalInfo.linkedin}</div>}
            {personalInfo.github && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GitBranch style={contactIconStyle}/>{personalInfo.github}</div>}
          </div>
        )}
      </div>
    );
  };

  const renderSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* If header is sidebar, render Name/Avatar here */}
      {header === 'sidebar' && (layout === 'sidebar-left' || layout === 'sidebar-right') && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '8px' }}>
          {personalInfo.photoUrl && (
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${isDarkText ? primary : '#ffffff'}`, marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img src={personalInfo.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <h1 style={{ fontSize: '22pt', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-0.5px', color: isDarkText ? primary : '#ffffff' }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '11pt', fontWeight: 600, marginTop: '8px', color: isDarkText ? textCol : '#e4e4e7', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
      )}

      {/* Contact for Sidebar */}
      {(layout === 'sidebar-left' || layout === 'sidebar-right') && (
        <div>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: isDarkText ? primary : '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', borderBottom: `1px solid ${isDarkText ? '#e5e5e5' : '#3f3f46'}`, paddingBottom: '8px' }}>Contact</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '9.5pt', color: isDarkText ? textCol : '#e4e4e7' }}>
            {personalInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail style={contactIconStyle}/> <span style={{wordBreak: 'break-all'}}>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone style={contactIconStyle}/> <span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin style={contactIconStyle}/> <span>{personalInfo.location}</span></div>}
            {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Link style={contactIconStyle}/> <span style={{wordBreak: 'break-all'}}>{personalInfo.linkedin}</span></div>}
            {personalInfo.github && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><GitBranch style={contactIconStyle}/> <span style={{wordBreak: 'break-all'}}>{personalInfo.github}</span></div>}
            {personalInfo.website && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Globe style={contactIconStyle}/> <span style={{wordBreak: 'break-all'}}>{personalInfo.website}</span></div>}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: isDarkText ? primary : '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', borderBottom: `1px solid ${isDarkText ? '#e5e5e5' : '#3f3f46'}`, paddingBottom: '8px' }}>Skills</h2>
          {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '9.5pt', fontWeight: 700, color: isDarkText ? textCol : '#ffffff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {catSkills.map(s => (
                  <span key={s.id} style={{ fontSize: '8.5pt', padding: '4px 10px', borderRadius: '100px', background: isDarkText ? '#f1f5f9' : '#3f3f46', color: isDarkText ? textCol : '#ffffff', fontWeight: 500 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: isDarkText ? primary : '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', borderBottom: `1px solid ${isDarkText ? '#e5e5e5' : '#3f3f46'}`, paddingBottom: '8px' }}>Languages</h2>
          {languages.map(l => (
            <div key={l.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt' }}>
                <span style={{ color: isDarkText ? textCol : '#ffffff', fontWeight: 600 }}>{l.name}</span>
                <span style={{ color: isDarkText ? mutedText : '#a1a1aa' }}>{l.proficiency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: isDarkText ? primary : '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', borderBottom: `1px solid ${isDarkText ? '#e5e5e5' : '#3f3f46'}`, paddingBottom: '8px' }}>Certifications</h2>
          {certifications.map(c => (
            <div key={c.id} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '9.5pt', fontWeight: 600, color: isDarkText ? textCol : '#ffffff' }}>{c.name}</div>
              <div style={{ fontSize: '8.5pt', color: isDarkText ? mutedText : '#a1a1aa', marginTop: '2px' }}>{c.issuer}</div>
              {c.date && <div style={{ fontSize: '8pt', color: isDarkText ? mutedText : '#a1a1aa', marginTop: '2px' }}>{formatDate(c.date)}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMainContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {summary && (
        <div>
          <h2 style={getSectionTitleStyles()}>Profile</h2>
          <p style={{ fontSize: '10.5pt', lineHeight: 1.6, color: textCol }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div>
          <h2 style={getSectionTitleStyles()}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 700, color: textCol }}>{exp.position}</h3>
                  <span style={{ fontSize: '9.5pt', color: primary, fontWeight: 600, background: `${primary}10`, padding: '2px 8px', borderRadius: '4px' }}>
                    {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: '10.5pt', color: textCol, fontWeight: 600, marginBottom: '8px' }}>
                  {exp.company} {exp.location && <span style={{ color: mutedText, fontWeight: 400 }}>| {exp.location}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: 0, listStyle: 'outside' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '10pt', lineHeight: 1.6, color: textCol, marginBottom: '6px' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 style={getSectionTitleStyles()}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {education.map(edu => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 700, color: textCol }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span style={{ fontSize: '9.5pt', color: primary, fontWeight: 600, background: `${primary}10`, padding: '2px 8px', borderRadius: '4px' }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: '10.5pt', color: textCol, fontWeight: 600 }}>{edu.institution}</div>
                {edu.gpa && <div style={{ fontSize: '9.5pt', color: mutedText, marginTop: '4px' }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div>
          <h2 style={getSectionTitleStyles()}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {projects.map(proj => (
              <div key={proj.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '12pt', fontWeight: 700, color: textCol }}>{proj.name}</h3>
                  {proj.startDate && (
                    <span style={{ fontSize: '9.5pt', color: primary, fontWeight: 600, background: `${primary}10`, padding: '2px 8px', borderRadius: '4px' }}>
                      {formatDate(proj.startDate)}{proj.endDate ? ` - ${formatDate(proj.endDate)}` : ''}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '10pt', lineHeight: 1.6, color: textCol, marginBottom: '8px' }}>{proj.description}</p>
                {proj.techStack.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {proj.techStack.map((tech, i) => (
                      <span key={i} style={{ fontSize: '8.5pt', color: primary, fontWeight: 600, padding: '2px 8px', border: `1px solid ${primary}40`, borderRadius: '4px' }}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements.length > 0 && achievements.some(a => a.trim()) && (
        <div>
          <h2 style={getSectionTitleStyles()}>Achievements</h2>
          <ul style={{ paddingLeft: '18px', margin: 0, listStyle: 'outside' }}>
            {achievements.filter(a => a.trim()).map((a, i) => (
              <li key={i} style={{ fontSize: '10pt', lineHeight: 1.6, color: textCol, marginBottom: '6px' }}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: font,
        backgroundColor: bg,
        color: textCol,
        width: '100%',
        minHeight: '1123px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderHeader()}

      <div style={{ display: 'flex', flex: 1 }}>
        {layout === 'sidebar-left' && (
          <div style={{ width: '240px', background: isDarkText ? '#f8fafc' : '#27272a', padding: '32px 24px', flexShrink: 0 }}>
            {renderSidebarContent()}
          </div>
        )}

        <div style={{ flex: 1, padding: '32px 40px' }}>
          {layout === 'standard' && (
            <div style={{ display: 'flex', gap: '32px' }}>
              <div style={{ flex: '1 1 70%' }}>{renderMainContent()}</div>
              <div style={{ flex: '1 1 30%' }}>{renderSidebarContent()}</div>
            </div>
          )}
          
          {(layout === 'sidebar-left' || layout === 'sidebar-right' || layout === 'minimal') && renderMainContent()}
          {layout === 'minimal' && renderSidebarContent()}
        </div>

        {layout === 'sidebar-right' && (
          <div style={{ width: '240px', background: isDarkText ? '#f8fafc' : '#27272a', padding: '32px 24px', flexShrink: 0 }}>
            {renderSidebarContent()}
          </div>
        )}
      </div>
    </div>
  );
}
