'use client';

import { logExercise } from '@/app/actions';
import { Combobox } from '@/components/ui/combobox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Exercise, SectionsType } from '@/db/schema';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, buttonVariants } from './ui/button';

interface LogExerciseFormProps {
  section: SectionsType | undefined;
}

export function LogExerciseForm({ section }: LogExerciseFormProps) {
  const comboBoxItems =
    section?.exercises.map((e) => ({
      value: e.id,
      label: `${e.name} (${e.pointsPer} points/${e.scoringType === 'perMin' ? 'min' : 'rep'})`,
    })) || [];
  const [currentExerciseId, setExerciseId] = useState<string>('');
  const [currentExercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [count, setCount] = useState<number | null>(10);

  useEffect(() => {
    setExercise(section?.exercises.find((e) => e.id === currentExerciseId) || null);
  }, [currentExerciseId, section?.exercises]);

  async function onSubmit() {
    if (count && count > 0) {
      try {
        if (!currentExercise) {
          toast.error('You must select and exercise first.');
          return;
        }
        setLoading(true);
        await logExercise(section!, currentExerciseId, count);
        setLoading(false);
        toast.success('Exercise successfully logged.');
        setIsOpen(false); // Close the drawer on success
      } catch (e) {
        console.error(e);
        toast.error('An unexpected error has occurred. See the console for details.');
      }
    } else {
      toast.error(
        `${!currentExercise ? 'Rep Count' : currentExercise.scoringType === 'perMin' ? 'Minutes' : 'Rep Count'} cannot be less than 1`,
      );
    }
  }

  const handleDrawerClose = () => {
    setExercise(null);
    setExerciseId('');
    setCount(10);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} onClose={handleDrawerClose}>
      <DrawerTrigger className={cn('mb-5 w-3/4 cursor-pointer', buttonVariants({ size: 'lg' }))}>
        Log Exercise
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log Exercise</DrawerTitle>
          <DrawerDescription>Record your completed exercises for the {section?.displayName}</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Combobox items={comboBoxItems} itemName="exercise" externalValueState={setExerciseId} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise-name">
              {!currentExercise ? 'Reps' : currentExercise.scoringType === 'perMin' ? 'Minutes' : 'Reps'}
            </Label>
            <Input
              type="number"
              disabled={currentExercise === null}
              value={count || ''}
              onChange={(e) => setCount(+e.target.value)}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button className="cursor-pointer" onClick={onSubmit} disabled={isLoading || !currentExercise}>
            {isLoading ? <Loader className="animate-spin" /> : 'Log Exercise'}
          </Button>
          <DrawerClose className={cn('cursor-pointer', buttonVariants({ variant: 'outline' }))}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
