'use client';

import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { addSection } from '@/app/actions';

export function AddSectionForm() {
  const [value, setValue] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  async function handleSubmit() {
    if (value !== '') {
      try {
        setLoading(true);
        const slug = value.toLocaleLowerCase().split(' ').join('-');
        await addSection(slug, value);
        setLoading(false);
        toast.success(`Successfully created the "${value}" section`);
      } catch (e) {
        console.error('Section addition error: ', e);
        toast.error('An unexpected error has occurred. See the console for details.');
        setLoading(false);
      }
    }
  }

  return (
    <div className="bg-input/50 flex w-full flex-col gap-3 rounded-lg border p-3">
      <h1 className="text-sm">Add Section</h1>
      <Input
        placeholder="Section Name (Plural; E.G: Tubas)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={isLoading || value === ''}
        className="ml-auto w-[187px] cursor-pointer text-center"
      >
        {isLoading ? <Loader className="animate-spin" /> : 'Add section'}
      </Button>
    </div>
  );
}
