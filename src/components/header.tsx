import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="flex h-14 w-full items-center gap-3 border-b px-4 py-2">
      <Avatar>
        <AvatarImage src="https://michaelcreative.com/wp-content/uploads/sites/27/2017/09/RobHead.jpg" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <p>
        Welcome, <span className="font-bold">John Doe</span>
      </p>
    </header>
  );
}
