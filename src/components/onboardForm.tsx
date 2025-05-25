'use client';

import { onboardUser } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OnboardingFormProps {
  sections: { value: string; label: string }[];
}

export function CheckOnboarding({ sections }: OnboardingFormProps) {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const { user, isLoaded } = useUser();
  const [isOnboarded, setOnboarded] = useState<boolean>(true);

  useEffect(() => {
    if (user && isLoaded) {
      setOnboarded(user?.publicMetadata.onboarded === true);
    }
  }, [isLoaded, user]);

  async function handleContinue() {
    if (selectedSection && isLoaded && user) {
      try {
        await onboardUser(selectedSection);
        window.location.reload();
      } catch (e) {
        console.error('Onboarding Error: ', e);
        toast.error(JSON.stringify(e as Error));
      }
    }
  }

  return (
    <>
      {!isOnboarded && (
        <>
          <div className="bg-background/70 fixed top-0 left-0 z-10 h-screen w-screen backdrop-blur-md"></div>
          <Card className="fixed top-1/2 left-1/2 z-20 w-11/12 -translate-1/2 rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">One last thing</CardTitle>
              <CardDescription>Please select your section to complete setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Combobox
                items={[...sections, { value: 'spectator', label: 'None (Cannot log exercise)' }]}
                itemName="section"
                externalValueState={setSelectedSection}
                className="w-full"
              />

              <Button onClick={handleContinue} disabled={!selectedSection} className="w-full cursor-pointer">
                Continue
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
