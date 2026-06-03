'use client';

import { useResume } from '@/contexts/resume-context';
import { Certification } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useState } from 'react';

export function CertificationsForm() {
  const { resume, addListItem, removeListItem, updateListItem } = useResume();
  const [expandedId, setExpandedId] = useState<string | null>(resume.certifications[0]?.id ?? null);

  const handleAdd = () => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    };
    addListItem('certifications', newCert);
    setExpandedId(newCert.id);
  };

  const handleUpdate = (index: number, updates: Partial<Certification>) => {
    updateListItem('certifications', index, { ...resume.certifications[index], ...updates });
  };

  return (
    <div className="space-y-3">
      {resume.certifications.map((cert, index) => (
        <Card key={cert.id} className="rounded-xl border border-border overflow-hidden">
          <div
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{cert.name || 'New Certification'}</p>
              <p className="text-xs text-muted-foreground truncate">{cert.issuer || 'Issuer'}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={(e) => { e.stopPropagation(); removeListItem('certifications', index); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            {expandedId === cert.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>

          {expandedId === cert.id && (
            <div className="p-3 pt-0 space-y-3 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Certification Name</Label>
                  <Input placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => handleUpdate(index, { name: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Issuer</Label>
                  <Input placeholder="Amazon Web Services" value={cert.issuer} onChange={(e) => handleUpdate(index, { issuer: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Issue Date</Label>
                  <Input type="month" value={cert.date} onChange={(e) => handleUpdate(index, { date: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                  <Input type="month" value={cert.expiryDate} onChange={(e) => handleUpdate(index, { expiryDate: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Credential ID</Label>
                  <Input placeholder="ABC123XYZ" value={cert.credentialId} onChange={(e) => handleUpdate(index, { credentialId: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Credential URL</Label>
                  <Input placeholder="https://credential.net/..." value={cert.credentialUrl} onChange={(e) => handleUpdate(index, { credentialUrl: e.target.value })} className="rounded-lg h-9 text-sm" />
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Button variant="outline" size="sm" className="w-full rounded-xl gap-2 border-dashed" onClick={handleAdd}>
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
