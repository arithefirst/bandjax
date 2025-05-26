'use client';

import { updateBio } from '@/app/actions';
import { Edit, Loader, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface SectionBioProps {
  value: string;
  canEdit: boolean;
  sectionSlug: string;
}

export function SectionBio({ value, canEdit, sectionSlug }: SectionBioProps) {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [newBio, setNewBio] = useState<string>(value);

  async function handleUpdate() {
    setLoading(true);
    try {
      await updateBio(sectionSlug, newBio);
      setEditing(false);
      toast.success('Bio successfully updated.');
    } catch (e) {
      console.error('Bio Update Error: ', e);
      toast.error('An unexpected error has occurred. See the console for details.');
    }
    setLoading(false);
  }

  return (
    <>
      {canEdit && (
        <button
          className="bg-background/30 absolute top-2 right-2 flex size-10 cursor-pointer items-center justify-center rounded-full p-2"
          onClick={() => setEditing((e) => !e)}
        >
          {isEditing ? <X /> : <Edit size={20} />}
        </button>
      )}
      {isEditing ? (
        <>
          <Textarea
            className="mt-2"
            value={newBio}
            placeholder="Write your section bio here"
            onChange={(e) => setNewBio(e.target.value)}
          />
          <Button className="mt-1 w-full cursor-pointer" onClick={handleUpdate}>
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <Save />
                Save Bio
              </>
            )}
          </Button>
        </>
      ) : (
        <p className="mt-2 indent-4">{value}</p>
      )}
    </>
  );
}
