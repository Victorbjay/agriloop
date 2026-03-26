
import { WasteType } from '@/types';

export const WASTE_TYPES: { value: WasteType; label: string }[] = [
  { value: 'cassava_peels', label: 'Cassava Peels' },
  { value: 'rice_husk', label: 'Rice Husk' },
  { value: 'maize_stalks', label: 'Maize Stalks' },
  { value: 'palm_kernel_shells', label: 'Palm Kernel Shells' },
  { value: 'cocoa_pods', label: 'Cocoa Pods' },
  { value: 'poultry_manure', label: 'Poultry Manure' },
  { value: 'cow_dung', label: 'Cow Dung' },
  { value: 'sawdust', label: 'Sawdust' },
  { value: 'other', label: 'Other (Specify...)' },
];

export const WASTE_CONDITIONS = [
  { value: 'fresh', label: 'Fresh' },
  { value: 'dried', label: 'Dried' },
  { value: 'mixed', label: 'Mixed' },
];

export const QUALITY_GRADES = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'mixed', label: 'Mixed' },
];

export const DELIVERY_METHODS = [
  { value: 'self_pickup', label: 'Self Pickup' },
  { value: 'request_delivery', label: 'Request Delivery' },
];
