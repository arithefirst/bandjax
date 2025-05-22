'use client';

import { upgradeUserToAdmin } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

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
        await upgradeUserToAdmin(value);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
  }

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="bg-input/50 flex w-full flex-col gap-3 rounded-lg border p-2">
      <h1 className="text-sm">Add admin</h1>
      <Combobox externalValueState={setValue} items={users} itemName="user" />
      <Button onClick={handleSubmit} disabled={isLoading} className="ml-auto w-[187px] cursor-pointer text-center">
        {isLoading ? <Loader className="animate-spin" /> : 'Upgrade user to admin'}
      </Button>
    </div>
  );
}
