'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { Resume, ResumeSection, TemplateType, createEmptyResume } from '@/types/resume';
import { saveResume as storeResume, getResume } from '@/lib/resume-store';
import { generateId } from '@/lib/utils';

type ResumeAction =
  | { type: 'SET_RESUME'; payload: Resume }
  | { type: 'UPDATE_FIELD'; payload: { section: ResumeSection; field: string; value: unknown } }
  | { type: 'UPDATE_SECTION'; payload: { section: ResumeSection; value: unknown } }
  | { type: 'SET_TEMPLATE'; payload: TemplateType }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'ADD_LIST_ITEM'; payload: { section: ResumeSection; item: unknown } }
  | { type: 'REMOVE_LIST_ITEM'; payload: { section: ResumeSection; index: number } }
  | { type: 'UPDATE_LIST_ITEM'; payload: { section: ResumeSection; index: number; item: unknown } }
  | { type: 'REORDER_LIST'; payload: { section: ResumeSection; fromIndex: number; toIndex: number } };

interface ResumeContextType {
  resume: Resume;
  dispatch: React.Dispatch<ResumeAction>;
  updateField: (section: ResumeSection, field: string, value: unknown) => void;
  updateSection: (section: ResumeSection, value: unknown) => void;
  setTemplate: (template: TemplateType) => void;
  setTitle: (title: string) => void;
  addListItem: (section: ResumeSection, item: unknown) => void;
  removeListItem: (section: ResumeSection, index: number) => void;
  updateListItem: (section: ResumeSection, index: number, item: unknown) => void;
  reorderList: (section: ResumeSection, fromIndex: number, toIndex: number) => void;
  isDirty: boolean;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

function resumeReducer(state: Resume, action: ResumeAction): Resume {
  switch (action.type) {
    case 'SET_RESUME':
      return action.payload;

    case 'UPDATE_FIELD': {
      const { section, field, value } = action.payload;
      if (section === 'personalInfo') {
        return {
          ...state,
          personalInfo: { ...state.personalInfo, [field]: value },
          updatedAt: new Date().toISOString(),
        };
      }
      return state;
    }

    case 'UPDATE_SECTION': {
      const { section, value } = action.payload;
      return {
        ...state,
        [section]: value,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'SET_TEMPLATE':
      return { ...state, template: action.payload, updatedAt: new Date().toISOString() };

    case 'SET_TITLE':
      return { ...state, title: action.payload, updatedAt: new Date().toISOString() };

    case 'ADD_LIST_ITEM': {
      const { section, item } = action.payload;
      const list = state[section];
      if (!Array.isArray(list)) return state;
      return {
        ...state,
        [section]: [...list, item],
        updatedAt: new Date().toISOString(),
      };
    }

    case 'REMOVE_LIST_ITEM': {
      const { section, index } = action.payload;
      const list = state[section];
      if (!Array.isArray(list)) return state;
      return {
        ...state,
        [section]: list.filter((_: unknown, i: number) => i !== index),
        updatedAt: new Date().toISOString(),
      };
    }

    case 'UPDATE_LIST_ITEM': {
      const { section, index, item } = action.payload;
      const list = state[section];
      if (!Array.isArray(list)) return state;
      const newList = [...list];
      newList[index] = item as any;
      return {
        ...state,
        [section]: newList,
        updatedAt: new Date().toISOString(),
      };
    }

    case 'REORDER_LIST': {
      const { section, fromIndex, toIndex } = action.payload;
      const list = state[section];
      if (!Array.isArray(list)) return state;
      const newList = [...list];
      const [removed] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, removed);
      return {
        ...state,
        [section]: newList,
        updatedAt: new Date().toISOString(),
      };
    }

    default:
      return state;
  }
}

export function ResumeProvider({
  children,
  resumeId,
}: {
  children: React.ReactNode;
  resumeId: string;
}) {
  const [resume, dispatch] = useReducer(resumeReducer, createEmptyResume(resumeId));
  const [isDirty, setIsDirty] = React.useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef(false);

  // Load resume from storage
  useEffect(() => {
    if (initializedRef.current) return;
    let isMounted = true;
    
    async function loadResume() {
      try {
        const stored = await getResume(resumeId);
        if (!isMounted) return;
        
        if (stored) {
          dispatch({ type: 'SET_RESUME', payload: stored });
        } else {
          const newResume = createEmptyResume(resumeId);
          await storeResume(newResume);
          if (isMounted) dispatch({ type: 'SET_RESUME', payload: newResume });
        }
      } catch (err) {
        console.error('Failed to load resume', err);
      }
    }
    
    loadResume();
    initializedRef.current = true;
    
    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  // Auto-save with debounce
  useEffect(() => {
    if (!initializedRef.current) return;
    setIsDirty(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await storeResume(resume);
      } catch (err) {
        console.error('Failed to auto-save', err);
      } finally {
        setIsDirty(false);
      }
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resume]);

  const updateField = useCallback(
    (section: ResumeSection, field: string, value: unknown) =>
      dispatch({ type: 'UPDATE_FIELD', payload: { section, field, value } }),
    []
  );

  const updateSection = useCallback(
    (section: ResumeSection, value: unknown) =>
      dispatch({ type: 'UPDATE_SECTION', payload: { section, value } }),
    []
  );

  const setTemplate = useCallback(
    (template: TemplateType) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    []
  );

  const setTitle = useCallback(
    (title: string) => dispatch({ type: 'SET_TITLE', payload: title }),
    []
  );

  const addListItem = useCallback(
    (section: ResumeSection, item: unknown) =>
      dispatch({ type: 'ADD_LIST_ITEM', payload: { section, item } }),
    []
  );

  const removeListItem = useCallback(
    (section: ResumeSection, index: number) =>
      dispatch({ type: 'REMOVE_LIST_ITEM', payload: { section, index } }),
    []
  );

  const updateListItem = useCallback(
    (section: ResumeSection, index: number, item: unknown) =>
      dispatch({ type: 'UPDATE_LIST_ITEM', payload: { section, index, item } }),
    []
  );

  const reorderList = useCallback(
    (section: ResumeSection, fromIndex: number, toIndex: number) =>
      dispatch({ type: 'REORDER_LIST', payload: { section, fromIndex, toIndex } }),
    []
  );

  return (
    <ResumeContext.Provider
      value={{
        resume,
        dispatch,
        updateField,
        updateSection,
        setTemplate,
        setTitle,
        addListItem,
        removeListItem,
        updateListItem,
        reorderList,
        isDirty,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

export { generateId };
