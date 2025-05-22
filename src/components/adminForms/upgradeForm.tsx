'use client';

import { upgradeUserToAdmin } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminUpgradeFormProps {
  users: { value: string; label: string }[];
}

export function AdminUpgradeForm({ users }: AdminUpgradeFormProps) {
  const [value, setValue] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  async function handleSubmit() {
    if (value !== '') {
      try {
        setLoading(true);
        const name = await upgradeUserToAdmin(value);
        setLoading(false);

        toast.success(`Successfully made ${name} an admin.`);
      } catch (e) {
        console.error('Admin Upgrade Error: ', e);
        toast.error('An unexpected error has occured. See the console for details.');
        setLoading(false);
      }
    }
  }

  return (
    <div className="bg-input/50 flex w-full flex-col gap-3 rounded-lg border p-3">
      <h1 className="text-sm">Add admin</h1>
      <Combobox externalValueState={setValue} items={users} itemName="user" />
      <Button onClick={handleSubmit} disabled={isLoading} className="ml-auto w-[187px] cursor-pointer text-center">
        {isLoading ? <Loader className="animate-spin" /> : 'Upgrade user to admin'}
      </Button>
    </div>
  );
}
