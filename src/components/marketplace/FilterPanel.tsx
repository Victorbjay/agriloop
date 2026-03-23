"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WASTE_TYPES, WASTE_CONDITIONS, QUALITY_GRADES } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

export default function FilterPanel() {
  return (
    <div className="sticky top-20 space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">Filters</h3>
        <Separator className="mb-6" />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Waste Type</h4>
        <div className="grid gap-3">
          {WASTE_TYPES.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox id={type.value} />
              <Label htmlFor={type.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range (₦/kg)</h4>
        <Slider defaultValue={[0, 500]} max={1000} step={10} className="py-4" />
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>₦0</span>
          <span>₦1,000+</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Condition</h4>
        <div className="grid gap-3">
          {WASTE_CONDITIONS.map((cond) => (
            <div key={cond.value} className="flex items-center space-x-2">
              <Checkbox id={`cond-${cond.value}`} />
              <Label htmlFor={`cond-${cond.value}`} className="text-sm font-medium">
                {cond.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Radius (km)</h4>
        <Slider defaultValue={[50]} max={500} step={5} />
        <div className="text-right text-xs font-bold text-primary">50km</div>
      </div>
    </div>
  );
}