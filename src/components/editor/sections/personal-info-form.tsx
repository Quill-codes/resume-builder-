'use client';

import { useResume } from '@/contexts/resume-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Briefcase, Mail, Phone, MapPin, Globe, Link, GitBranch } from 'lucide-react';
import { AvatarSelector } from './avatar-selector';

export function PersonalInfoForm() {
  const { resume, updateField } = useResume();
  const { personalInfo } = resume;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('personalInfo', field, e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Full Name
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={personalInfo.fullName}
            onChange={handleChange('fullName')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="jobTitle" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" /> Professional Title
          </Label>
          <Input
            id="jobTitle"
            placeholder="Senior Software Engineer"
            value={personalInfo.jobTitle}
            onChange={handleChange('jobTitle')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={personalInfo.email}
            onChange={handleChange('email')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Phone
          </Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Location
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={personalInfo.location}
            onChange={handleChange('location')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Website
          </Label>
          <Input
            id="website"
            placeholder="johndoe.com"
            value={personalInfo.website}
            onChange={handleChange('website')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Link className="h-3.5 w-3.5" /> LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={personalInfo.linkedin}
            onChange={handleChange('linkedin')}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="github" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" /> GitHub
          </Label>
          <Input
            id="github"
            placeholder="github.com/johndoe"
            value={personalInfo.github}
            onChange={handleChange('github')}
            className="rounded-xl"
          />
        </div>
      </div>
      
      <AvatarSelector />
    </div>
  );
}
