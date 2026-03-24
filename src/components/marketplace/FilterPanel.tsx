
"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { WASTE_TYPES, WASTE_CONDITIONS } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { WasteType } from '@/types';

interface FilterPanelProps {
  selectedTypes?: WasteType[];
  onTypeChange?: (types: WasteType[]) => void;
  maxPrice?: number;
  onPriceChange?: (price: number) => void;
}

export default function FilterPanel({ 
  selectedTypes = [], 
  onTypeChange, 
  maxPrice = 5000, 
  onPriceChange 
}: FilterPanelProps) {
  
  const handleTypeToggle = (type: WasteType) => {
    if (!onTypeChange) return;
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

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
              <Checkbox 
                id={type.value} 
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleTypeToggle(type.value)}
              />
              <Label htmlFor={type.value} className="text-sm font-medium leading-none cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Max Price (₦/kg)</h4>
        <Slider 
          value={[maxPrice]} 
          onValueChange={(val) => onPriceChange?.(val[0])}
          max={5000} 
          step={50} 
          className="py-4" 
        />
        <div className="flex justify-between text-xs font-medium text-muted-foreground">
          <span>₦0</span>
          <span className="font-bold text-primary">Up to ₦{maxPrice}</span>
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
        <Slider defaultValue={[100]} max={500} step={5} />
        <div className="text-right text-xs font-bold text-primary">100km</div>
      </div>
    </div>
  );
}
