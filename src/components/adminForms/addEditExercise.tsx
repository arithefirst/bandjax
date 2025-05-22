'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { addExersice } from '@/app/actions';
import { toast } from 'sonner';
import { v4 } from 'uuid';

interface AddEditExerciseProps {
  sections: { value: string; label: string }[];
}

export function AddEditExercise({ sections }: AddEditExerciseProps) {
  const [value, setValue] = useState<string>('');
  const [exerciseName, setExerciseName] = useState('');
  const [scoringType, setScoringType] = useState<'perMin' | 'perRep'>('perMin');
  const [points, setPoints] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sectionLabel, setSectionLabel] = useState<string>('');

  useEffect(() => {
    setSectionLabel(sections.find((e) => e.value === value)?.label || 'the selected section');
  }, [sections, value]);

  async function handleAddSubmit() {
    setIsLoading(true);
    try {
      await addExersice(value, {
        name: exerciseName,
        scoringType,
        pointsPer: points,
        id: v4(),
      });

      toast.success(`Successfully added "${exerciseName}" for the ${sectionLabel}`);
    } catch (e) {
      console.error('Add Exercise Error: ', e);
      toast.error('An unexpected error has occured. See the console for details.');
    }
    setIsLoading(false);
  }

  return (
    <div className="bg-input/50 flex w-full flex-col gap-3 rounded-lg border p-3">
      <h1 className="text-sm">Add/Edit Exercise</h1>
      <Combobox externalValueState={setValue} items={sections} itemName="section" />
      <div className="ml-auto flex gap-2">
        <Drawer>
          <DrawerTrigger
            disabled={value === ''}
            className={cn('w-20 cursor-pointer text-center', buttonVariants())}
          >
            Add
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Exercise</DrawerTitle>
              <DrawerDescription>Create a new exercise for the {sectionLabel}.</DrawerDescription>
            </DrawerHeader>

            <div className="space-y-4 px-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="exercise-name">Exercise Name</Label>
                <Input
                  id="exercise-name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="Enter exercise name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoring-type">Scoring Type</Label>
                <Select value={scoringType} onValueChange={(value: 'perMin' | 'perRep') => setScoringType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scoring type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perMin">Per Minute</SelectItem>
                    <SelectItem value="perRep">Per Rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">{scoringType === 'perMin' ? 'Points Per Minute' : 'Points Per Rep'}</Label>
                <Input
                  id="points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  placeholder="Enter points"
                />
              </div>
            </div>

            <DrawerFooter>
              <Button type="submit" disabled={isLoading} onClick={handleAddSubmit}>
                {isLoading ? <Loader className="animate-spin" /> : 'Save Exercise'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
