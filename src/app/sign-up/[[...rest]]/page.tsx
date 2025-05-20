import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bandjax | Sign Up',
};

export default function Page() {
  return (
    <main className="h-screen w-screen">
      <div className="absolute top-1/2 left-1/2 h-fit w-fit -translate-1/2">
        <SignUp
          appearance={{
            elements: {
              cardBox: 'rounded-none! shadow-none! absolute top-1/2 -translate-y-1/2',
              rootBox:
                'relative! h-[75vh]! rounded-lg border border-[#2E2E32] ' +
                'bg-[linear-gradient(180deg,#1F1F23_0%,#1F1F23_50%,#26262A_50%,#26262A_100%)]',
              footer: 'mt-auto!',
            },
          }}
        />
      </div>
    </main>
  );
}
