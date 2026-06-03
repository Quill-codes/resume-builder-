import { Resume, createEmptyResume } from '@/types/resume';

export interface Preset {
  id: string;
  name: string;
  category: string;
  image: string;
  resumeData: Partial<Resume>;
}

const SWE_TEMPLATE_CONFIG = {
  type: "dynamic",
  config: {
    fontFamily: "Inter, sans-serif",
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    layout: "sidebar-left",
    headerVariant: "standard",
    sectionStyle: "clean"
  }
};

const UX_TEMPLATE_CONFIG = {
  type: "dynamic",
  config: {
    fontFamily: "Geist, sans-serif",
    primaryColor: "#e60023",
    backgroundColor: "#fafafa",
    layout: "sidebar-left",
    headerVariant: "standard",
    sectionStyle: "boxed"
  }
};

const DATA_TEMPLATE_CONFIG = {
  type: "dynamic",
  config: {
    fontFamily: "Inter, sans-serif",
    primaryColor: "#0891b2",
    backgroundColor: "#ffffff",
    layout: "sidebar-right",
    headerVariant: "standard",
    sectionStyle: "lined"
  }
};

export const PRESETS: Preset[] = [
  {
    id: 'preset-swe',
    name: 'Software Engineer',
    category: 'Technical',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Dhz7RsDNdVZ7b9TY4X79CNmwEmw6dHdeIZxdMU4WC7ps2HVAq6dm6HVqD9_geziLECawOFGcaLTrOhj2oD72EJxyxX3ATgExyhn_T2omq2hkVcG4cdR2Unib2LtFbzkFsEdXzMb7xB1bsMccG1tYLRcmnzODFRoGmt_pFjp0ONYHCDaHjw2H_9OdubvKDLSnAQicG71G6SMF80gA27PQ9GkqOjxYoim9nOttQeomj0u8_B1UIX6bCpegMz0um6_mAzcqX-Z2HkQ',
    resumeData: {
      template: JSON.stringify(SWE_TEMPLATE_CONFIG),
      personalInfo: {
        fullName: 'Alex Developer',
        jobTitle: 'Senior Software Engineer',
        email: 'alex.dev@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        website: 'alexdev.com',
        linkedin: 'linkedin.com/in/alexdev',
        github: 'github.com/alexdev',
        photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix'
      },
      summary: 'Results-driven Senior Software Engineer with 5+ years of experience architecting highly scalable distributed systems and leading cross-functional teams. Passionate about performance optimization, clean code, and delivering impactful products.',
      experience: [
        {
          id: 'exp-1',
          company: 'TechFlow Inc.',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2021-03',
          endDate: '',
          isCurrentRole: true,
          bullets: [
            'Led the migration of a monolithic architecture to Go microservices, reducing infrastructure costs by 40% and improving API latency by 60%.',
            'Mentored 4 junior engineers, establishing coding standards and automated CI/CD pipelines that reduced deployment times from 45 mins to 5 mins.',
            'Architected a real-time analytics dashboard using React, WebSockets, and Redis, processing over 1M events per day.'
          ]
        },
        {
          id: 'exp-2',
          company: 'InnovateHub',
          position: 'Software Engineer',
          location: 'Austin, TX',
          startDate: '2018-06',
          endDate: '2021-02',
          isCurrentRole: false,
          bullets: [
            'Developed and maintained 15+ RESTful APIs using Node.js and Express.',
            'Optimized PostgreSQL queries, reducing database load by 35% during peak traffic hours.',
            'Collaborated with product and design teams to deliver a new mobile app in React Native, achieving a 4.8 star rating on the App Store.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Austin, TX',
          startDate: '2014-08',
          endDate: '2018-05',
          gpa: '3.8',
          coursework: ['Data Structures', 'Algorithms', 'Distributed Systems', 'Database Design']
        }
      ],
      skills: [
        { id: 's-1', name: 'TypeScript', category: 'Languages', proficiency: 'expert' },
        { id: 's-2', name: 'Go', category: 'Languages', proficiency: 'advanced' },
        { id: 's-3', name: 'Python', category: 'Languages', proficiency: 'advanced' },
        { id: 's-4', name: 'React', category: 'Frontend', proficiency: 'expert' },
        { id: 's-5', name: 'Next.js', category: 'Frontend', proficiency: 'advanced' },
        { id: 's-6', name: 'Node.js', category: 'Backend', proficiency: 'expert' },
        { id: 's-7', name: 'PostgreSQL', category: 'Backend', proficiency: 'advanced' },
        { id: 's-8', name: 'AWS', category: 'DevOps', proficiency: 'intermediate' },
        { id: 's-9', name: 'Docker', category: 'DevOps', proficiency: 'advanced' }
      ],
      projects: [
        {
          id: 'p-1',
          name: 'OpenSource Analytics',
          description: 'A privacy-friendly analytics platform processing 10k+ events daily.',
          techStack: ['Next.js', 'ClickHouse', 'Tailwind'],
          liveUrl: '',
          repoUrl: '',
          startDate: '2022-01',
          endDate: '2022-06'
        }
      ],
      certifications: [],
      achievements: [],
      languages: []
    }
  },
  {
    id: 'preset-ux',
    name: 'Product Designer',
    category: 'Creative',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO2BNmUGb3IFwbpiRPQVs6tLXD7bgj4unKw9UjAu6pN3k8J6tVjoNi6N6g2HOeOBId8FBqEUuw-HrbF_808inpOJ5tROi6d54wZwffb5TAMBuc4WfWXZSt4foAQS6qiL1sYpOhRpsdF5p9bzzTNyywKQUtQQ1uIXFUufQ47Mddff3Vb5nEEs3tqOHcgss81vhTSUiSTkNUa_udRGDns80cmMc1o_f7a1KgjLOKJvVQ_C8NKE95FwxJqcDa0CzPcvm7fjFTTOqbugA',
    resumeData: {
      template: JSON.stringify(UX_TEMPLATE_CONFIG),
      personalInfo: {
        fullName: 'Sam Designer',
        jobTitle: 'Senior Product Designer',
        email: 'sam.design@example.com',
        phone: '(555) 987-6543',
        location: 'New York, NY',
        website: 'samportfolio.com',
        linkedin: 'linkedin.com/in/samdesign',
        github: '',
        photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aneka'
      },
      summary: 'Human-centered Product Designer with 6 years of experience transforming complex problems into intuitive, elegant digital experiences. Specializes in design systems, user research, and high-fidelity prototyping.',
      experience: [
        {
          id: 'exp-1',
          company: 'Creative Labs',
          position: 'Senior Product Designer',
          location: 'New York, NY',
          startDate: '2020-09',
          endDate: '',
          isCurrentRole: true,
          bullets: [
            'Spearheaded the redesign of the core SaaS platform, increasing user retention by 22% within the first quarter of launch.',
            'Built and maintained a scalable design system in Figma, accelerating design-to-development handoff by 40%.',
            'Conducted over 50 usability testing sessions to validate new feature concepts with target demographics.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Design Institute',
          degree: 'BFA in Interaction Design',
          field: '',
          location: 'New York, NY',
          startDate: '2014-08',
          endDate: '2018-05',
          gpa: '',
          coursework: []
        }
      ],
      skills: [
        { id: 's-1', name: 'Figma', category: 'Tools', proficiency: 'expert' },
        { id: 's-2', name: 'Prototyping', category: 'Design', proficiency: 'expert' },
        { id: 's-3', name: 'User Research', category: 'Design', proficiency: 'advanced' },
        { id: 's-4', name: 'Design Systems', category: 'Design', proficiency: 'expert' },
        { id: 's-5', name: 'HTML/CSS', category: 'Development', proficiency: 'intermediate' }
      ],
      projects: [],
      certifications: [],
      achievements: [],
      languages: []
    }
  },
  {
    id: 'preset-data',
    name: 'Data Analyst',
    category: 'Technical',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0fapJ5t64DuM4K1IlKgVOKFALw2kRbyeT2iydRAULC_BAG_rGjCnnIm_Dyu-o3lmaCGWeQNJNcakgrlFmZdqDni9g8qMz1M6UQSwGRpSoi3C-o4pev4iCpljkCVbjcPkf2a1v7L5k-aza1sVBRLQ-c2fMQBGmDyiJJNolGVE94JTCNt-ef1YckYBCDh7cFuQoUKPByxFVCxIUxgyJGdHabhqy5Csdmtj0gi2VWGH9uMJ_84Qsdllpzzz2SqpZx8akvAb-8w2TzUI',
    resumeData: {
      template: JSON.stringify(DATA_TEMPLATE_CONFIG),
      personalInfo: {
        fullName: 'Jordan Data',
        jobTitle: 'Data Analyst',
        email: 'jordan.data@example.com',
        phone: '(555) 246-8101',
        location: 'Seattle, WA',
        website: '',
        linkedin: 'linkedin.com/in/jordandata',
        github: 'github.com/jordandata',
        photoUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jasper'
      },
      summary: 'Detail-oriented Data Analyst adept at transforming raw data into actionable business insights. Proficient in SQL, Python, and Tableau. Proven track record of improving operational efficiency through data-driven recommendations.',
      experience: [
        {
          id: 'exp-1',
          company: 'Retail Solutions Corp',
          position: 'Data Analyst',
          location: 'Seattle, WA',
          startDate: '2021-05',
          endDate: '',
          isCurrentRole: true,
          bullets: [
            'Developed automated Tableau dashboards that replaced manual weekly reporting, saving the analytics team 15 hours per week.',
            'Analyzed customer purchasing behavior using Python (Pandas, Scikit-learn), identifying cross-selling opportunities that boosted Q3 revenue by 12%.',
            'Wrote complex SQL queries to extract and clean datasets of over 5 million rows from Snowflake data warehouse.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of Washington',
          degree: 'BS in Statistics',
          field: '',
          location: 'Seattle, WA',
          startDate: '2017-08',
          endDate: '2021-05',
          gpa: '3.9',
          coursework: []
        }
      ],
      skills: [
        { id: 's-1', name: 'SQL', category: 'Languages', proficiency: 'expert' },
        { id: 's-2', name: 'Python', category: 'Languages', proficiency: 'advanced' },
        { id: 's-3', name: 'Tableau', category: 'Tools', proficiency: 'expert' },
        { id: 's-4', name: 'Excel', category: 'Tools', proficiency: 'expert' },
        { id: 's-5', name: 'A/B Testing', category: 'Analysis', proficiency: 'advanced' }
      ],
      projects: [],
      certifications: [],
      achievements: [],
      languages: []
    }
  }
];
