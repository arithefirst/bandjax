'use client';

import { addExersice, updateExersice } from '@/app/actions';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exercise, SectionsType } from '@/db/schema';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v4 } from 'uuid';

interface AddEditExerciseProps {
  sections: SectionsType[];
}

export function AddEditExercise({ sections }: AddEditExerciseProps) {
  const [value, setValue] = useState<string>('');
  const [exerciseName, setExerciseName] = useState('');
  const [scoringType, setScoringType] = useState<'perMin' | 'perRep'>('perMin');
  const [points, setPoints] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sectionLabel, setSectionLabel] = useState<string>('');
  const [selectedExercise, selectExercise] = useState<Exercise | null>(null);

  async function handleAddSubmit() {
    setIsLoading(true);

    if (points && points >= 1) {
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
        if ((e as Error).message === 'Duplicate Name') {
          toast.error(`The name "${exerciseName}" is already in use for the ${sectionLabel}.`);
        } else {
          toast.error('An unexpected error has occured. See the console for details.');
        }
      }
    } else {
      toast.error(`"Points Per ${scoringType === 'perMin' ? 'Minute' : 'Rep'}" cannot be less than 1`);
    }

    setIsLoading(false);
  }

  async function handleEditSubmit() {
    setIsLoading(true);
    if (points && points >= 1) {
      try {
        if (!selectedExercise) throw new Error('Selected Exercise is null');
        await updateExersice(value, selectedExercise);
        toast.success(`Successfully updated "${selectedExercise.name}" for the ${sectionLabel}`);
      } catch (e) {
        console.error('Add Exercise Error: ', e);
        toast.error('An unexpected error has occured. See the console for details.');
      }
    }
    setIsLoading(false);
  }

  const comboboxSections = sections.map((s) => ({ value: s.slug, label: s.displayName }));

  useEffect(() => {
    setSectionLabel(comboboxSections.find((e) => e.value === value)?.label || 'the selected section');
  }, [sections, value, comboboxSections]);

  return (
    <div className="bg-input/50 flex w-full flex-col gap-3 rounded-lg border p-3">
      <h1 className="text-sm">Add/Edit Exercises</h1>
      <Combobox externalValueState={setValue} items={comboboxSections} itemName="section" />
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
                  value={points || ''}
                  onChange={(e) => setPoints(+e.target.value)}
                  placeholder="Enter points"
                />
              </div>
            </div>

            <DrawerFooter>
              <Button type="submit" disabled={isLoading} onClick={handleAddSubmit}>
                {isLoading ? <Loader className="animate-spin" /> : 'Save Exercise'}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer onClose={() => selectExercise(null)}>
          <DrawerTrigger
            disabled={value === ''}
            className={cn('w-20 cursor-pointer text-center', buttonVariants())}
          >
            Edit
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Exercises</DrawerTitle>
              <DrawerDescription>Edit an existing exercise for the {sectionLabel}.</DrawerDescription>
            </DrawerHeader>

            <div className="grid w-full grid-cols-1">
              {(() => {
                if (!selectedExercise) {
                  const currentSection = sections.find((s) => s.slug === value);

                  if (currentSection) {
                    return currentSection.exercises.map((e) => (
                      <button
                        className="bg-input/50 mx-auto w-11/12 cursor-pointer rounded-lg border p-4"
                        key={e.id}
                        onClick={() => selectExercise(e)}
                      >
                        {e.name} ({e.pointsPer.toLocaleString()} {e.scoringType === 'perMin' ? 'P/M' : 'P/R'})
                      </button>
                    ));
                  }
                }
              })()}

              {selectedExercise && (
                <div className="space-y-4 px-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-name">Exercise Name</Label>
                    <Input
                      id="edit-exercise-name"
                      defaultValue={selectedExercise.name}
                      onChange={(e) => selectExercise({ ...selectedExercise, name: e.target.value })}
                      placeholder="Enter exercise name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scoring-type">Scoring Type</Label>
                    <Select
                      value={selectedExercise.scoringType}
                      onValueChange={(value: 'perMin' | 'perRep') =>
                        selectExercise({ ...selectedExercise, scoringType: value })
                      }
                    >
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
                    <Label htmlFor="points">
                      {selectedExercise.scoringType === 'perMin' ? 'Points Per Minute' : 'Points Per Rep'}
                    </Label>
                    <Input
                      id="edit-points"
                      type="number"
                      defaultValue={selectedExercise.pointsPer}
                      onChange={(e) => selectExercise({ ...selectedExercise, pointsPer: +e.target.value })}
                      placeholder="Enter points"
                    />
                  </div>
                </div>
              )}
            </div>

            <DrawerFooter>
              {selectedExercise && (
                <Button type="submit" disabled={isLoading} onClick={handleEditSubmit}>
                  {isLoading ? <Loader className="animate-spin" /> : 'Save Exercise'}
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
