'use client';

import { onboardUser } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

interface OnboardingFormProps {
  sections: { value: string; label: string }[];
}

export function OnboardingForm({ sections }: OnboardingFormProps) {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Add loading state to prevent hydration issues
  if (!isLoaded) {
    return (
      <Card className="mx-auto w-full max-w-md rounded-lg">
        <CardContent className="flex items-center justify-center p-8">
          <div>
            <Loader className="animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  async function handleContinue() {
    if (selectedSection && isLoaded && user) {
      try {
        await onboardUser(selectedSection);
        router.push('/');
      } catch (e) {
        console.error('Onboarding Error: ', e);
        toast.error(JSON.stringify(e as Error));
      }
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">One last thing</CardTitle>
        <CardDescription>Please select your section to complete setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Combobox items={sections} itemName="section" externalValueState={setSelectedSection} className="w-full" />

        <Button onClick={handleContinue} disabled={!selectedSection} className="w-full cursor-pointer">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
