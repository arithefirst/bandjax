'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Loader, Users } from 'lucide-react';
import { getSectionSlug } from '@/app/actions';
import { useEffect, useState } from 'react';

export function Header() {
  const { user } = useUser();
  const [sectionSlug, setSectionSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (user) setSectionSlug(await getSectionSlug(user.id));
    }

    fetchData();
  }, [user]);

  return (
    <header className="relative flex h-14 w-full items-center gap-2 border-b px-4 py-2">
      <div className="bg-input flex size-9 items-center justify-center rounded-full">
        <Loader className="animate-spin" />
      </div>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: 'size-9!',
            rootBox: 'absolute ml-4 top-1/2 -translate-1/2 z-10',
          },
        }}
      >
        <UserButton.MenuItems>
          {user && (
            <UserButton.Link
              label="View your section"
              href={`/section/${sectionSlug}`}
              labelIcon={<Users size={16} />}
            ></UserButton.Link>
          )}
        </UserButton.MenuItems>
      </UserButton>
      <p>
        Welcome, <span className="font-bold">{user ? user.fullName : ''}</span>
      </p>
    </header>
  );
}
