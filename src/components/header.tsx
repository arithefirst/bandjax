'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Loader, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSectionSlug } from '@/app/actions';

export function Header() {
  const { user, isLoaded } = useUser();
  const [sectionSlug, setSectionSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !user?.id) {
        setSectionSlug(null);
        return;
      }

      try {
        const slug = await getSectionSlug(user.id);
        setSectionSlug(slug);
      } catch (error) {
        console.error('Failed to fetch section slug:', error);
        setSectionSlug(null);
      }
    }

    fetchData();
  }, [user?.id, isLoaded]);

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
        {user && sectionSlug && (
          <UserButton.MenuItems>
            <UserButton.Link
              label="View your section"
              href={`/section/${sectionSlug}`}
              labelIcon={<Users size={16} />}
            />
          </UserButton.MenuItems>
        )}
      </UserButton>
      <p>
        Welcome, <span className="font-bold">{user ? user.fullName : ''}</span>
      </p>
    </header>
  );
}
