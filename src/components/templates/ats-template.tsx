'use client';

import { Resume } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface ATSTemplateProps {
  resume: Resume;
}

export function ATSTemplate({ resume }: ATSTemplateProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages } = resume;

  return (
    <div className="resume-page p-[20mm] font-serif" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '11pt', lineHeight: '1.4', color: '#000' }}>
      {/* Header */}
      <div className="text-center mb-3 pb-2" style={{ borderBottom: '2px solid #000' }}>
        {personalInfo.fullName && (
          <h1 className="text-2xl font-bold mb-0.5" style={{ fontSize: '22pt', letterSpacing: '1px' }}>
            {personalInfo.fullName.toUpperCase()}
          </h1>
        )}
        {personalInfo.jobTitle && (
          <p className="text-sm mb-1.5" style={{ fontSize: '11pt', color: '#333' }}>
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-xs" style={{ fontSize: '9.5pt' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <><span>|</span><span>{personalInfo.phone}</span></>}
          {personalInfo.location && <><span>|</span><span>{personalInfo.location}</span></>}
          {personalInfo.linkedin && <><span>|</span><span>{personalInfo.linkedin}</span></>}
          {personalInfo.github && <><span>|</span><span>{personalInfo.github}</span></>}
          {personalInfo.website && <><span>|</span><span>{personalInfo.website}</span></>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Professional Summary
          </h2>
          <p className="text-xs" style={{ fontSize: '10.5pt', lineHeight: '1.45' }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ fontSize: '10.5pt' }}>{exp.position}</span>
                <span className="text-xs" style={{ fontSize: '9.5pt' }}>
                  {formatDate(exp.startDate)} — {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic" style={{ fontSize: '10.5pt' }}>{exp.company}</span>
                {exp.location && <span className="text-xs" style={{ fontSize: '9.5pt' }}>{exp.location}</span>}
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 ml-4 list-disc" style={{ fontSize: '10.5pt' }}>
                  {exp.bullets.filter(b => b.trim()).map((bullet, i) => (
                    <li key={i} className="mb-0.5 pl-1">{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ fontSize: '10.5pt' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                <span className="text-xs" style={{ fontSize: '9.5pt' }}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic" style={{ fontSize: '10.5pt' }}>{edu.institution}</span>
                {edu.gpa && <span className="text-xs" style={{ fontSize: '9.5pt' }}>GPA: {edu.gpa}</span>}
              </div>
              {edu.coursework.length > 0 && (
                <p className="text-xs mt-0.5" style={{ fontSize: '10pt' }}>
                  <span className="font-semibold">Relevant Coursework:</span> {edu.coursework.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Skills
          </h2>
          <div style={{ fontSize: '10.5pt' }}>
            {Object.entries(
              skills.reduce((acc, skill) => {
                const cat = skill.category || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(skill.name);
                return acc;
              }, {} as Record<string, string[]>)
            ).map(([category, skillNames]) => (
              <p key={category} className="mb-0.5">
                <span className="font-bold">{category}:</span> {skillNames.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold" style={{ fontSize: '10.5pt' }}>
                  {project.name}
                  {project.liveUrl && (
                    <span className="font-normal"> — {project.liveUrl}</span>
                  )}
                </span>
                {project.startDate && (
                  <span className="text-xs" style={{ fontSize: '9.5pt' }}>
                    {formatDate(project.startDate)}{project.endDate ? ` — ${formatDate(project.endDate)}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ fontSize: '10.5pt' }}>{project.description}</p>
              {project.techStack.length > 0 && (
                <p className="text-xs mt-0.5" style={{ fontSize: '10pt' }}>
                  <span className="font-semibold">Technologies:</span> {project.techStack.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-1">
              <div className="flex justify-between items-baseline">
                <span style={{ fontSize: '10.5pt' }}>
                  <span className="font-bold">{cert.name}</span> — {cert.issuer}
                </span>
                {cert.date && <span className="text-xs" style={{ fontSize: '9.5pt' }}>{formatDate(cert.date)}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && achievements.some(a => a.trim()) && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Achievements
          </h2>
          <ul className="ml-4 list-disc" style={{ fontSize: '10.5pt' }}>
            {achievements.filter(a => a.trim()).map((achievement, i) => (
              <li key={i} className="mb-0.5 pl-1">{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ fontSize: '11pt', borderBottom: '1px solid #000', letterSpacing: '2px' }}>
            Languages
          </h2>
          <p style={{ fontSize: '10.5pt' }}>
            {languages.map((lang) => `${lang.name} (${lang.proficiency.charAt(0).toUpperCase() + lang.proficiency.slice(1)})`).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
}
