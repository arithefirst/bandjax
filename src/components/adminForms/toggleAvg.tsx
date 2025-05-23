'use client';

import { setGlobalSetting } from '@/app/actions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Loader, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ToggleAvgProps {
  settings: {
    enable: boolean;
    setting: string;
  }[];
}

export function ToggleAvg({ settings }: ToggleAvgProps) {
  const avg_scores_setting = settings.find((i) => i.setting === 'avg_scores');
  const [checked, setChecked] = useState<boolean>(avg_scores_setting ? avg_scores_setting.enable : false);
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onChange(e: boolean) {
    try {
      setChecked(e);
      setLoading(true);
      await setGlobalSetting('avg_scores', e);
      toast.success(`Successfully ${e ? 'enabled' : 'disabled'} score averaging`);
    } catch (e) {
      console.error(e);
      toast.error('An unexpected error has occured. See the console for details.');
    }
    setLoading(false);
  }

  return (
    <div className="relative text-center">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            initial="hidden"
            exit="hidden"
            animate="visible"
            transition={{ duration: 0.2 }}
            className="bg-background/50 absolute top-1/2 z-10 flex h-[120%] w-full -translate-y-1/2 items-center justify-center rounded-md border backdrop-blur-sm"
          >
            <Loader className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <Popover>
        <PopoverTrigger className="mx-auto flex cursor-pointer items-center justify-center gap-1">
          <h1 className="text-sm">Average Scores</h1>
          <Info size={17} />
        </PopoverTrigger>
        <PopoverContent>
          When enabled, scores are divided by the number of members in a section, preventing large sections from
          having an advantage over smaller ones.
        </PopoverContent>
      </Popover>

      <div className="flex h-8 items-center justify-center">
        <Switch
          className="cursor-pointer"
          checked={checked}
          onCheckedChange={(e) => {
            onChange(e);
          }}
        />
      </div>
    </div>
  );
}
