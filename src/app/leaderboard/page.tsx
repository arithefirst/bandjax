import { Header } from '@/components/header';
import { LeaderboardItem } from '@/components/lboardItem';
import { Navbar } from '@/components/navbar';

const leaderboardData = [
  {
    name: 'Bari Saxes',
    image: 'https://michaelcreative.com/wp-content/uploads/sites/27/2017/09/RobHead.jpg',
    score: 9850,
  },
  {
    name: 'Alto Saxes',
    image: 'fogettaboutit.png',
    score: 8720,
  },
  {
    name: 'Tenor Saxes',
    image: 'fogettaboutit.png',
    score: 7640,
  },
  {
    name: 'Tubas',
    image: 'fogettaboutit.png',
    score: 6580,
  },
  {
    name: 'Flutes',
    image: 'fogettaboutit.png',
    score: 5930,
  },
  {
    name: 'Bari Saxes',
    image: 'https://michaelcreative.com/wp-content/uploads/sites/27/2017/09/RobHead.jpg',
    score: 9850,
  },
  {
    name: 'Alto Saxes',
    image: 'fogettaboutit.png',
    score: 8720,
  },
  {
    name: 'Tenor Saxes',
    image: 'fogettaboutit.png',
    score: 7640,
  },
  {
    name: 'Tubas',
    image: 'fogettaboutit.png',
    score: 6580,
  },
  {
    name: 'Flutes',
    image: 'fogettaboutit.png',
    score: 5930,
  },
];

export default function Page() {
  return (
    <main className="flex h-screen w-screen flex-col items-center">
      <Header />
      <div className="w-full flex-1 overflow-scroll p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">Leaderboard</h1>
        <div className="flex w-full flex-col gap-2">
          {leaderboardData.map((item, i) => (
            <LeaderboardItem {...item} key={`lbi-${i}`} place={i + 1} />
          ))}
        </div>
      </div>
      <Navbar active="leaderboard" />
    </main>
  );
}
