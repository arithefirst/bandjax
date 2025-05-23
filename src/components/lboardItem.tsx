import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardItemProps {
  place: number;
  name: string;
  image: string;
  score: number;
  sectionSlug: string;
}

export function LeaderboardItem({ place, name, image, score, sectionSlug }: LeaderboardItemProps) {
  function Icon() {
    switch (place) {
      case 1:
        return <Trophy className="mr-2 h-6 w-6 text-amber-600" />;
      case 2:
        return <Trophy className="mr-2 h-6 w-6 text-slate-500" />;
      case 3:
        return <Trophy className="mr-2 h-6 w-6 text-amber-800" />;
      default:
        return <span className="text-black-500 mr-3 text-center font-bold">{place}</span>;
    }
  }

  function getColorClasses() {
    switch (place) {
      case 1:
        return 'border-amber-400 border-2 text-muted bg-gradient-to-br from-amber-100 to-amber-300';
      case 2:
        return 'border-slate-400 border-2 bg-gradient-to-br text-muted from-slate-100 to-slate-300';
      case 3:
        return 'border-orange-400 border-2 bg-gradient-to-br from-orange-100 text-muted to-orange-300';
      default:
        return 'bg-input/50 border-input';
    }
  }

  return (
    <Link
      href={`/section/${sectionSlug}`}
      className={`flex w-full items-center rounded-lg border p-4 shadow-sm ${getColorClasses()} `}
    >
      <div className="flex w-10 items-center justify-center">
        <Icon />
      </div>

      <Avatar className="h-10 w-10 border border-white shadow-sm">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="ml-2 flex-1">
        <p className="font-medium">{name}</p>
      </div>

      <div className="text-lg font-bold">{score.toLocaleString()}</div>
    </Link>
  );
}
