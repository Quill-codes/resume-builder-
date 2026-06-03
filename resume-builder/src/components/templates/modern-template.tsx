'use client';

import { Resume } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Globe, Link, GitBranch } from 'lucide-react';

interface ModernTemplateProps {
  resume: Resume;
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages } = resume;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div
      className="resume-page"
      style={{
        fontFamily: 'Inter, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.4',
        color: '#33332e',
        background: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ background: '#e60023', padding: '28px 32px 24px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26pt', fontWeight: 700, letterSpacing: '-1.2px', lineHeight: 1.1, margin: 0 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p style={{ fontSize: '13pt', fontWeight: 400, opacity: 0.92, marginTop: '4px', letterSpacing: '0.2px' }}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>
        {personalInfo.photoUrl && (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ffffff', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.8)', flexShrink: 0 }}>
            <img src={personalInfo.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(1123px - 90px)' }}>
        {/* Sidebar */}
        <div style={{ width: '230px', background: '#f6f6f3', padding: '20px 18px', flexShrink: 0 }}>
          {/* Contact */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e60023', marginBottom: '10px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
              Contact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {personalInfo.email && (
                <ContactItem icon="mail" text={personalInfo.email} />
              )}
              {personalInfo.phone && (
                <ContactItem icon="phone" text={personalInfo.phone} />
              )}
              {personalInfo.location && (
                <ContactItem icon="location" text={personalInfo.location} />
              )}
              {personalInfo.website && (
                <ContactItem icon="globe" text={personalInfo.website} />
              )}
              {personalInfo.linkedin && (
                <ContactItem icon="linkedin" text={personalInfo.linkedin} />
              )}
              {personalInfo.github && (
                <ContactItem icon="github" text={personalInfo.github} />
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e60023', marginBottom: '10px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Skills
              </h3>
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category} style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '8.5pt', fontWeight: 600, color: '#262622', marginBottom: '4px' }}>{category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {catSkills.map((skill) => (
                      <span
                        key={skill.id}
                        style={{
                          fontSize: '7.5pt',
                          padding: '2px 7px',
                          borderRadius: '9999px',
                          background: '#ffffff',
                          border: '1px solid #dadad3',
                          color: '#33332e',
                          fontWeight: 500,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e60023', marginBottom: '10px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Languages
              </h3>
              {languages.map((lang) => (
                <div key={lang.id} style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '9pt', fontWeight: 600, color: '#262622' }}>{lang.name}</span>
                    <span style={{ fontSize: '7.5pt', color: '#62625b', textTransform: 'capitalize' }}>{lang.proficiency}</span>
                  </div>
                  <div style={{ height: '3px', background: '#dadad3', borderRadius: '9999px' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        background: '#e60023',
                        width: getProficiencyWidth(lang.proficiency),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications (Sidebar) */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#e60023', marginBottom: '10px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Certifications
              </h3>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '9pt', fontWeight: 600, color: '#262622', lineHeight: 1.3 }}>{cert.name}</p>
                  <p style={{ fontSize: '8pt', color: '#62625b' }}>{cert.issuer}</p>
                  {cert.date && <p style={{ fontSize: '7.5pt', color: '#91918c' }}>{formatDate(cert.date)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px 24px' }}>
          {/* Summary */}
          {summary && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#000000', letterSpacing: '-0.3px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Professional Summary
              </h2>
              <p style={{ fontSize: '9.5pt', lineHeight: '1.5', color: '#33332e' }}>{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#000000', letterSpacing: '-0.3px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Experience
              </h2>
              {experience.map((exp, idx) => (
                <div key={exp.id} style={{ marginBottom: idx < experience.length - 1 ? '14px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#000000' }}>{exp.position}</h3>
                    <span style={{ fontSize: '8.5pt', color: '#62625b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {formatDate(exp.startDate)} — {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '9.5pt', fontWeight: 600, color: '#e60023' }}>{exp.company}</span>
                    {exp.location && <span style={{ fontSize: '8.5pt', color: '#91918c' }}>{exp.location}</span>}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul style={{ marginTop: '4px', paddingLeft: '16px', listStyle: 'disc' }}>
                      {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '9.5pt', lineHeight: '1.45', color: '#33332e', marginBottom: '2px' }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#000000', letterSpacing: '-0.3px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Education
              </h2>
              {education.map((edu, idx) => (
                <div key={edu.id} style={{ marginBottom: idx < education.length - 1 ? '10px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#000000' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <span style={{ fontSize: '8.5pt', color: '#62625b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <span style={{ fontSize: '9.5pt', fontWeight: 600, color: '#e60023' }}>{edu.institution}</span>
                  {edu.gpa && <span style={{ fontSize: '8.5pt', color: '#62625b', marginLeft: '8px' }}>GPA: {edu.gpa}</span>}
                  {edu.coursework.length > 0 && (
                    <p style={{ fontSize: '8.5pt', color: '#62625b', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600 }}>Relevant Coursework:</span> {edu.coursework.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#000000', letterSpacing: '-0.3px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Projects
              </h2>
              {projects.map((project, idx) => (
                <div key={project.id} style={{ marginBottom: idx < projects.length - 1 ? '10px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#000000' }}>{project.name}</h3>
                    {project.startDate && (
                      <span style={{ fontSize: '8.5pt', color: '#62625b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {formatDate(project.startDate)}{project.endDate ? ` — ${formatDate(project.endDate)}` : ''}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '9.5pt', lineHeight: '1.45', color: '#33332e', marginTop: '2px' }}>{project.description}</p>
                  {project.techStack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '7.5pt',
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            background: '#f6f6f3',
                            border: '1px solid #dadad3',
                            color: '#33332e',
                            fontWeight: 500,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && achievements.some(a => a.trim()) && (
            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#000000', letterSpacing: '-0.3px', marginBottom: '6px', paddingBottom: '4px', borderBottom: '2px solid #e60023' }}>
                Achievements
              </h2>
              <ul style={{ paddingLeft: '16px', listStyle: 'disc' }}>
                {achievements.filter(a => a.trim()).map((achievement, i) => (
                  <li key={i} style={{ fontSize: '9.5pt', lineHeight: '1.45', color: '#33332e', marginBottom: '2px' }}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, text }: { icon: string; text: string }) {
  const iconSize = 11;
  const iconStyle = { width: iconSize, height: iconSize, color: '#e60023', flexShrink: 0, marginTop: '2px' };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
      {icon === 'mail' && <Mail style={iconStyle} />}
      {icon === 'phone' && <Phone style={iconStyle} />}
      {icon === 'location' && <MapPin style={iconStyle} />}
      {icon === 'globe' && <Globe style={iconStyle} />}
      {icon === 'linkedin' && <Link style={iconStyle} />}
      {icon === 'github' && <GitBranch style={iconStyle} />}
      <span style={{ fontSize: '8.5pt', color: '#33332e', wordBreak: 'break-all', lineHeight: '1.35' }}>{text}</span>
    </div>
  );
}

function getProficiencyWidth(proficiency: string): string {
  switch (proficiency) {
    case 'native': return '100%';
    case 'fluent': return '85%';
    case 'advanced': return '70%';
    case 'intermediate': return '50%';
    case 'basic': return '25%';
    default: return '50%';
  }
}
