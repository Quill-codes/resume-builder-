import { Resume, ATSScore, ATSScoreCategory, ATSSuggestion, SkillsDatabase } from '@/types/resume';

let skillsDb: SkillsDatabase | null = null;

async function getSkillsDb(): Promise<SkillsDatabase> {
  if (skillsDb) return skillsDb;
  try {
    const res = await fetch('/skills.json');
    skillsDb = await res.json();
    return skillsDb!;
  } catch {
    return { categories: {}, atsKeywords: { highImpact: [], mediumImpact: [], actionVerbs: [] } };
  }
}

export async function analyzeResume(resume: Resume): Promise<ATSScore> {
  const db = await getSkillsDb();
  const suggestions: ATSSuggestion[] = [];
  const breakdown: ATSScoreCategory[] = [];

  // 1. Contact Completeness (10%)
  const contactScore = analyzeContact(resume, suggestions);
  breakdown.push({
    name: 'Contact Information',
    score: contactScore,
    maxScore: 10,
    description: 'Completeness of contact details',
  });

  // 2. Summary (10%)
  const summaryScore = analyzeSummary(resume, suggestions);
  breakdown.push({
    name: 'Professional Summary',
    score: summaryScore,
    maxScore: 10,
    description: 'Quality and length of summary',
  });

  // 3. Keyword Density (25%)
  const keywordScore = analyzeKeywords(resume, db, suggestions);
  breakdown.push({
    name: 'Keywords & Skills',
    score: keywordScore,
    maxScore: 25,
    description: 'Relevance and density of ATS keywords',
  });

  // 4. Action Verbs (15%)
  const actionVerbScore = analyzeActionVerbs(resume, db, suggestions);
  breakdown.push({
    name: 'Action Verbs',
    score: actionVerbScore,
    maxScore: 15,
    description: 'Use of strong action verbs in experience',
  });

  // 5. Quantified Achievements (15%)
  const quantScore = analyzeQuantifiedAchievements(resume, suggestions);
  breakdown.push({
    name: 'Quantified Results',
    score: quantScore,
    maxScore: 15,
    description: 'Use of numbers and metrics',
  });

  // 6. Section Completeness (10%)
  const sectionScore = analyzeSections(resume, suggestions);
  breakdown.push({
    name: 'Section Completeness',
    score: sectionScore,
    maxScore: 10,
    description: 'Key resume sections filled in',
  });

  // 7. Formatting (10%)
  const formatScore = analyzeFormatting(resume, suggestions);
  breakdown.push({
    name: 'Formatting',
    score: formatScore,
    maxScore: 10,
    description: 'Consistent formatting and dates',
  });

  // 8. Length (5%)
  const lengthScore = analyzeLength(resume, suggestions);
  breakdown.push({
    name: 'Resume Length',
    score: lengthScore,
    maxScore: 5,
    description: 'Appropriate resume length',
  });

  const overall = breakdown.reduce((sum, cat) => sum + cat.score, 0);

  return { overall, breakdown, suggestions };
}

function analyzeContact(resume: Resume, suggestions: ATSSuggestion[]): number {
  let score = 0;
  const { personalInfo } = resume;

  if (personalInfo.fullName.trim()) score += 2;
  else suggestions.push({ id: 'c1', category: 'Contact', severity: 'critical', message: 'Add your full name', section: 'personalInfo' });

  if (personalInfo.email.trim()) score += 2;
  else suggestions.push({ id: 'c2', category: 'Contact', severity: 'critical', message: 'Add your email address', section: 'personalInfo' });

  if (personalInfo.phone.trim()) score += 2;
  else suggestions.push({ id: 'c3', category: 'Contact', severity: 'warning', message: 'Add your phone number', section: 'personalInfo' });

  if (personalInfo.linkedin.trim()) score += 2;
  else suggestions.push({ id: 'c4', category: 'Contact', severity: 'info', message: 'Add your LinkedIn profile URL', section: 'personalInfo' });

  if (personalInfo.location.trim()) score += 1;
  else suggestions.push({ id: 'c5', category: 'Contact', severity: 'info', message: 'Add your location (city, state)', section: 'personalInfo' });

  if (personalInfo.jobTitle.trim()) score += 1;
  else suggestions.push({ id: 'c6', category: 'Contact', severity: 'warning', message: 'Add a professional title', section: 'personalInfo' });

  return Math.min(score, 10);
}

function analyzeSummary(resume: Resume, suggestions: ATSSuggestion[]): number {
  const words = resume.summary.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    suggestions.push({ id: 's1', category: 'Summary', severity: 'critical', message: 'Add a professional summary (50–200 words recommended)', section: 'summary' });
    return 0;
  }
  if (words.length < 30) {
    suggestions.push({ id: 's2', category: 'Summary', severity: 'warning', message: 'Your summary is too short. Aim for at least 50 words.', section: 'summary' });
    return 4;
  }
  if (words.length > 250) {
    suggestions.push({ id: 's3', category: 'Summary', severity: 'warning', message: 'Your summary is too long. Keep it under 200 words.', section: 'summary' });
    return 6;
  }
  if (words.length >= 50 && words.length <= 200) {
    return 10;
  }
  return 7;
}

function analyzeKeywords(resume: Resume, db: SkillsDatabase, suggestions: ATSSuggestion[]): number {
  const resumeText = getResumeFullText(resume).toLowerCase();
  const skillNames = resume.skills.map((s) => s.name.toLowerCase());

  const matchedHigh = db.atsKeywords.highImpact.filter(
    (kw) => resumeText.includes(kw.toLowerCase()) || skillNames.includes(kw.toLowerCase())
  );
  const matchedMedium = db.atsKeywords.mediumImpact.filter(
    (kw) => resumeText.includes(kw.toLowerCase()) || skillNames.includes(kw.toLowerCase())
  );

  const highRatio = matchedHigh.length / Math.min(db.atsKeywords.highImpact.length, 15);
  const medRatio = matchedMedium.length / Math.min(db.atsKeywords.mediumImpact.length, 10);

  if (resume.skills.length === 0) {
    suggestions.push({ id: 'k1', category: 'Keywords', severity: 'critical', message: 'Add skills to your resume. ATS systems scan for relevant keywords.', section: 'skills' });
  } else if (resume.skills.length < 5) {
    suggestions.push({ id: 'k2', category: 'Keywords', severity: 'warning', message: 'Add more skills (aim for 8–15) to improve keyword matching.', section: 'skills' });
  }

  if (matchedHigh.length < 3) {
    suggestions.push({ id: 'k3', category: 'Keywords', severity: 'warning', message: 'Include more high-impact industry keywords in your experience and skills sections.', section: 'skills' });
  }

  const score = Math.round((highRatio * 0.7 + medRatio * 0.3) * 25);
  return Math.min(score, 25);
}

function analyzeActionVerbs(resume: Resume, db: SkillsDatabase, suggestions: ATSSuggestion[]): number {
  const allBullets = resume.experience.flatMap((exp) => exp.bullets);
  if (allBullets.length === 0) {
    suggestions.push({ id: 'a1', category: 'Action Verbs', severity: 'critical', message: 'Add bullet points to your experience describing your achievements.', section: 'experience' });
    return 0;
  }

  const actionVerbsLower = db.atsKeywords.actionVerbs.map((v) => v.toLowerCase());
  let verbCount = 0;

  allBullets.forEach((bullet) => {
    const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (firstWord && actionVerbsLower.includes(firstWord)) {
      verbCount++;
    }
  });

  const ratio = verbCount / allBullets.length;
  if (ratio < 0.5) {
    suggestions.push({ id: 'a2', category: 'Action Verbs', severity: 'warning', message: 'Start more bullet points with strong action verbs (e.g., "Developed", "Led", "Optimized").', section: 'experience', actionLabel: 'View suggestions' });
  }

  return Math.min(Math.round(ratio * 15), 15);
}

function analyzeQuantifiedAchievements(resume: Resume, suggestions: ATSSuggestion[]): number {
  const allBullets = resume.experience.flatMap((exp) => exp.bullets);
  if (allBullets.length === 0) return 0;

  const numberPattern = /\d+%|\$[\d,]+|\d+[xX]|\d{2,}/;
  const quantifiedCount = allBullets.filter((b) => numberPattern.test(b)).length;
  const ratio = quantifiedCount / allBullets.length;

  if (quantifiedCount === 0) {
    suggestions.push({ id: 'q1', category: 'Metrics', severity: 'warning', message: 'Add quantified results to your experience (e.g., "Increased revenue by 25%", "Reduced load time by 40%").', section: 'experience' });
  } else if (ratio < 0.3) {
    suggestions.push({ id: 'q2', category: 'Metrics', severity: 'info', message: 'Try to quantify more achievements. Numbers help ATS systems rank your resume higher.', section: 'experience' });
  }

  return Math.min(Math.round(ratio * 15), 15);
}

function analyzeSections(resume: Resume, suggestions: ATSSuggestion[]): number {
  let score = 0;
  if (resume.experience.length > 0) score += 3;
  else suggestions.push({ id: 'sec1', category: 'Sections', severity: 'critical', message: 'Add work experience to your resume.', section: 'experience' });

  if (resume.education.length > 0) score += 2;
  else suggestions.push({ id: 'sec2', category: 'Sections', severity: 'warning', message: 'Add your education details.', section: 'education' });

  if (resume.skills.length > 0) score += 3;
  else suggestions.push({ id: 'sec3', category: 'Sections', severity: 'critical', message: 'Add a skills section.', section: 'skills' });

  if (resume.projects.length > 0) score += 1;
  if (resume.certifications.length > 0) score += 1;

  return Math.min(score, 10);
}

function analyzeFormatting(resume: Resume, suggestions: ATSSuggestion[]): number {
  let score = 10;

  // Check for consistent date formats
  const dates = [
    ...resume.experience.flatMap((e) => [e.startDate, e.endDate]),
    ...resume.education.flatMap((e) => [e.startDate, e.endDate]),
  ].filter(Boolean);

  const hasInconsistentDates = dates.some((d) => !d.match(/^\d{4}-\d{2}$/));
  if (hasInconsistentDates && dates.length > 0) {
    score -= 3;
    suggestions.push({ id: 'f1', category: 'Formatting', severity: 'info', message: 'Use consistent date formats across all sections.', section: 'experience' });
  }

  // Check for empty bullets
  const emptyBullets = resume.experience.some((exp) => exp.bullets.some((b) => b.trim().length === 0));
  if (emptyBullets) {
    score -= 3;
    suggestions.push({ id: 'f2', category: 'Formatting', severity: 'warning', message: 'Remove empty bullet points from your experience.', section: 'experience' });
  }

  return Math.max(score, 0);
}

function analyzeLength(resume: Resume, suggestions: ATSSuggestion[]): number {
  const totalText = getResumeFullText(resume);
  const wordCount = totalText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 100) {
    suggestions.push({ id: 'l1', category: 'Length', severity: 'critical', message: 'Your resume is too short. Add more details to your experience and skills.', section: 'experience' });
    return 1;
  }
  if (wordCount < 250) {
    suggestions.push({ id: 'l2', category: 'Length', severity: 'warning', message: 'Your resume could use more detail. Aim for 300–700 words.', section: 'experience' });
    return 3;
  }
  if (wordCount > 1000) {
    suggestions.push({ id: 'l3', category: 'Length', severity: 'info', message: 'Your resume may be too long. Keep it to 1–2 pages for best results.', section: 'summary' });
    return 3;
  }
  return 5;
}

function getResumeFullText(resume: Resume): string {
  const parts = [
    resume.personalInfo.fullName,
    resume.personalInfo.jobTitle,
    resume.summary,
    ...resume.experience.flatMap((e) => [e.company, e.position, ...e.bullets]),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.skills.map((s) => s.name),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.techStack]),
    ...resume.certifications.map((c) => `${c.name} ${c.issuer}`),
    ...resume.achievements,
  ];
  return parts.join(' ');
}
