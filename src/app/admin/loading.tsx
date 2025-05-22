import { Header } from '@/components/header';
import { Loader } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function Loading() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <Loader className="animate-spin" />
      </div>
      <Navbar active="admin" />
    </main>
  );
}
