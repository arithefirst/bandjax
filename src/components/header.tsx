import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { Loader } from 'lucide-react';

export async function Header() {
  const user = await currentUser();

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
      />
      <p>
        Welcome, <span className="font-bold">{user?.fullName}</span>
      </p>
    </header>
  );
}
