'use client';

import { useResume } from '@/contexts/resume-context';
import { Skill, SkillsDatabase } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Sparkles } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useState, useEffect, useRef, useCallback } from 'react';

export function SkillsForm() {
  const { resume, addListItem, removeListItem } = useResume();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; category: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skillsDb, setSkillsDb] = useState<SkillsDatabase | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load skills database
  useEffect(() => {
    fetch('/skills.json')
      .then((res) => res.json())
      .then((data: SkillsDatabase) => setSkillsDb(data))
      .catch(() => {});
  }, []);

  // Filter suggestions based on query
  const filterSuggestions = useCallback((q: string) => {
    if (!skillsDb || !q.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = q.toLowerCase();
    const existingNames = new Set(resume.skills.map((s) => s.name.toLowerCase()));
    const results: { name: string; category: string }[] = [];

    for (const [cat, skills] of Object.entries(skillsDb.categories)) {
      for (const skill of skills) {
        if (skill.toLowerCase().includes(lower) && !existingNames.has(skill.toLowerCase())) {
          results.push({ name: skill, category: cat });
          if (results.length >= 10) break;
        }
      }
      if (results.length >= 10) break;
    }
    setSuggestions(results);
    setSelectedIndex(0);
  }, [skillsDb, resume.skills]);

  useEffect(() => {
    filterSuggestions(query);
  }, [query, filterSuggestions]);

  const addSkill = (name: string, cat: string) => {
    const newSkill: Skill = {
      id: generateId(),
      name,
      category: cat,
      proficiency: 'intermediate',
    };
    addListItem('skills', newSkill);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addSkill(suggestions[selectedIndex].name, suggestions[selectedIndex].category);
      } else if (query.trim()) {
        addSkill(query.trim(), category || 'General');
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Group existing skills by category
  const groupedSkills = resume.skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Add Skills
        </Label>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Search skills (e.g., React, Python, Leadership)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="rounded-xl"
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden max-h-[240px] overflow-y-auto"
                >
                  {suggestions.map((s, idx) => (
                    <button
                      key={`${s.name}-${s.category}`}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-sm transition-colors ${
                        idx === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => addSkill(s.name, s.category)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Select value={category} onValueChange={(val) => setCategory(val || '')}>
              <SelectTrigger className="w-[140px] rounded-xl text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {skillsDb &&
                  Object.keys(skillsDb.categories).map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-sm">
                      {cat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Type to search from 500+ skills or enter a custom skill. Press Enter to add.
        </p>
      </div>

      {/* Existing Skills */}
      {Object.entries(groupedSkills).map(([cat, catSkills]) => (
        <div key={cat}>
          <p className="text-xs font-semibold text-muted-foreground mb-2">{cat}</p>
          <div className="flex flex-wrap gap-1.5">
            {catSkills.map((skill) => {
              const skillIndex = resume.skills.findIndex((s) => s.id === skill.id);
              return (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-muted hover:bg-muted/80 transition-colors group"
                >
                  {skill.name}
                  <button
                    onClick={() => removeListItem('skills', skillIndex)}
                    className="ml-0.5 opacity-50 group-hover:opacity-100 hover:text-destructive transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      ))}

      {resume.skills.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          <p>No skills added yet. Start typing to search and add skills.</p>
        </div>
      )}
    </div>
  );
}
