import { Resume, createEmptyResume } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const STORAGE_KEY = 'resume-builder-data';

interface StorageData {
  resumes: Resume[];
  lastEditedId: string | null;
}

function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return { resumes: [], lastEditedId: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { resumes: [], lastEditedId: null };
    return JSON.parse(raw) as StorageData;
  } catch {
    return { resumes: [], lastEditedId: null };
  }
}

function setStorageData(data: StorageData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function isEmptyResume(resume: Resume): boolean {
  return (
    resume.title === 'Untitled Resume' &&
    !resume.personalInfo.fullName &&
    !resume.summary &&
    resume.experience.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.projects.length === 0 &&
    resume.certifications.length === 0 &&
    resume.achievements.length === 0 &&
    resume.languages.length === 0
  );
}

export async function listResumes(): Promise<Resume[]> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const { data, error } = await supabase.from('resumes').select('*').order('updated_at', { ascending: false });
    if (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }
    
    const validResumes: Resume[] = [];
    for (const row of data) {
      const r = {
        ...row.content,
        id: row.id,
        title: row.title,
        updatedAt: row.updated_at,
      } as Resume;
      
      if (isEmptyResume(r)) {
        // Fire and forget delete to clean up database
        supabase.from('resumes').delete().eq('id', r.id).then();
      } else {
        validResumes.push(r);
      }
    }
    return validResumes;
  } else {
    const data = getStorageData();
    const validResumes = data.resumes.filter(r => !isEmptyResume(r));
    
    if (validResumes.length !== data.resumes.length) {
      data.resumes = validResumes;
      if (data.lastEditedId && !validResumes.find((r) => r.id === data.lastEditedId)) {
        data.lastEditedId = validResumes[0]?.id ?? null;
      }
      setStorageData(data);
    }
    
    return validResumes;
  }
}

export async function getResume(id: string): Promise<Resume | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();
    if (error || !data) return null;
    return {
      ...data.content,
      id: data.id,
      title: data.title,
      updatedAt: data.updated_at,
    } as Resume;
  } else {
    const data = getStorageData();
    return data.resumes.find((r) => r.id === id) ?? null;
  }
}

export async function saveResume(resume: Resume): Promise<void> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const updated = { ...resume, updatedAt: new Date().toISOString() };
  
  if (session) {
    const { error } = await supabase.from('resumes').upsert({
      id: resume.id,
      user_id: session.user.id,
      title: resume.title || 'Untitled',
      content: updated,
      updated_at: updated.updatedAt,
    });
    if (error) {
      console.error('Error saving resume to Supabase:', error.message, error.details, error.hint);
    }
  } else {
    const data = getStorageData();
    const index = data.resumes.findIndex((r) => r.id === resume.id);
    if (index >= 0) {
      data.resumes[index] = updated;
    } else {
      data.resumes.push(updated);
    }
    data.lastEditedId = resume.id;
    setStorageData(data);
  }
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await supabase.from('resumes').delete().eq('id', id);
  } else {
    const data = getStorageData();
    data.resumes = data.resumes.filter((r) => r.id !== id);
    if (data.lastEditedId === id) {
      data.lastEditedId = data.resumes[0]?.id ?? null;
    }
    setStorageData(data);
  }
}

export async function createNewResume(): Promise<Resume> {
  const id = generateId();
  const resume = createEmptyResume(id);
  await saveResume(resume);
  return resume;
}

export async function duplicateResume(id: string): Promise<Resume | null> {
  const original = await getResume(id);
  if (!original) return null;
  const newId = generateId();
  const duplicate: Resume = {
    ...JSON.parse(JSON.stringify(original)),
    id: newId,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveResume(duplicate);
  return duplicate;
}

export function exportResumeJSON(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}

export async function importResumeJSON(json: string): Promise<Resume | null> {
  try {
    const parsed = JSON.parse(json) as Resume;
    parsed.id = generateId();
    parsed.createdAt = new Date().toISOString();
    parsed.updatedAt = new Date().toISOString();
    await saveResume(parsed);
    return parsed;
  } catch {
    return null;
  }
}

export async function syncLocalToCloud(): Promise<void> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const data = getStorageData();
  if (data.resumes.length === 0) return;

  let hasError = false;

  for (const resume of data.resumes) {
    const { error } = await supabase.from('resumes').upsert({
      id: resume.id,
      user_id: session.user.id,
      title: resume.title || 'Untitled',
      content: resume,
      updated_at: resume.updatedAt,
    });
    if (error) {
      console.error('Error syncing local resume to cloud:', error.message, error.details);
      hasError = true;
    }
  }

  if (!hasError) {
    setStorageData({ resumes: [], lastEditedId: null });
  }
}
