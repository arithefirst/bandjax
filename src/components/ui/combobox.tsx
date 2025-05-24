'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ComboBoxProps {
  items: { value: string; label: string }[];
  itemName?: string;
  className?: string;
  externalValueState?: Dispatch<SetStateAction<string>>;
}

export function Combobox({ className, items, externalValueState, itemName = 'item' }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  // Sets the value inside the component and the one outside
  // if it is provided
  function setValues(v: string) {
    setValue(v);
    if (externalValueState) externalValueState(v);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {value ? items.find((item) => item.value === value)?.label : `Select ${itemName}...`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput tabIndex={-1} placeholder={`Search ${itemName}s...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {itemName} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  className="cursor-pointer"
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValues(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
