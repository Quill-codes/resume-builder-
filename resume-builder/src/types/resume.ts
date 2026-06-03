export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  coursework: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export type TemplateType = 'ats' | 'modern' | string;

export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template: TemplateType;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
  languages: Language[];
}

export type ResumeSection =
  | 'personalInfo'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages';

export interface ATSScore {
  overall: number;
  breakdown: ATSScoreCategory[];
  suggestions: ATSSuggestion[];
}

export interface ATSScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface ATSSuggestion {
  id: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  section: ResumeSection;
  actionLabel?: string;
}

export interface SkillsDatabase {
  categories: Record<string, string[]>;
  atsKeywords: {
    highImpact: string[];
    mediumImpact: string[];
    actionVerbs: string[];
  };
}

export function createEmptyResume(id: string): Resume {
  return {
    id,
    title: 'Untitled Resume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    template: 'modern',
    personalInfo: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  };
}
