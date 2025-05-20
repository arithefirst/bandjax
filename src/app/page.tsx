import { House, Medal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Ribbon } from '@/components/ribbon';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <header className="flex h-14 w-full items-center gap-3 border-b px-4 py-2">
        <Avatar>
          <AvatarImage src="https://michaelcreative.com/wp-content/uploads/sites/27/2017/09/RobHead.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <p>
          Welcome, <span className="font-bold">John Doe</span>
        </p>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <Ribbon color="silver" className="scale-75" />
      </div>
      <nav className="grid h-22 w-full grid-cols-2 border-t">
        {/* Remember to make these do things later :D */}
        <div className="flex h-full w-full flex-col items-center justify-center border-r">
          <House size={36} strokeWidth={1.5} />
          <span className="font-bold">Home</span>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Medal size={36} strokeWidth={1.5} />
          <span className="font-bold">Leaderboard</span>
        </div>
      </nav>
    </main>
  );
}
