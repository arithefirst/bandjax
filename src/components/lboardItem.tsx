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
        return 'border-amber-500 bg-gradient-to-br from-amber-300 to-amber-400';
      case 2:
        return 'border-gray-500 from-gray-300 bg-gradient-to-br to-gray-400';
      case 3:
        return 'border-amber-700 from-amber-500 to-amber-600 bg-gradient-to-br';
      default:
        return 'bg-input border-input';
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
