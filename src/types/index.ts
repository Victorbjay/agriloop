import { Timestamp } from 'firebase/firestore';

export type UserRole = 'seller' | 'buyer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  businessName?: string;
  rcNumber?: string;
  bvn: string;
  bvnVerified: boolean;
  cacVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verifiedAt?: string;
  address: string;
  latitude: number;
  longitude: number;
  badge: 'none' | 'bronze' | 'silver' | 'gold';
  createdAt: string;
  updatedAt: string;
}

export type WasteType = 
  | 'cassava_peels' 
  | 'rice_husk' 
  | 'maize_stalks' 
  | 'palm_kernel_shells' 
  | 'cocoa_pods' 
  | 'poultry_manure' 
  | 'cow_dung' 
  | 'sawdust';

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerBadge: 'none' | 'bronze' | 'silver' | 'gold';
  wasteType: WasteType;
  wasteTypeLabel: string;
  condition: 'fresh' | 'dried' | 'mixed';
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  moqKg: number;
  qualityGrade: 'premium' | 'standard' | 'mixed';
  availableFrom: string;
  availableUntil?: string;
  locationAddress: string;
  locationLatitude: number;
  locationLongitude: number;
  locationGeohash: string;
  description?: string;
  images?: string[];
  status: 'active' | 'sold' | 'expired' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending_payment' 
  | 'payment_held' 
  | 'seller_confirmed' 
  | 'ready_for_pickup' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export interface Order {
  id: string;
  listingId: string;
  listingSnapshotId: string;
  listingSnapshotWasteType: string;
  listingSnapshotWasteTypeLabel: string;
  listingSnapshotCondition: string;
  listingSnapshotPricePerKg: number;
  listingSnapshotMoqKg: number;
  listingSnapshotQualityGrade: string;
  listingSnapshotAvailableFrom: string;
  listingSnapshotAvailableUntil?: string;
  listingSnapshotDescription?: string;
  listingSnapshotImages?: string[];
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  deliveryMethod: 'self_pickup' | 'request_delivery';
  status: OrderStatus;
  interswitchRef: string;
  transactionRef: string;
  paymentPaidAt: string;
  paymentVerifiedAt: string;
  timelineOrderedAt: string;
  timelinePaidAt?: string;
  timelineConfirmedAt?: string;
  timelineReadyAt?: string;
  timelineCompletedAt?: string;
  timelineCancelledAt?: string;
  pickupLocationAddress: string;
  pickupLocationLatitude: number;
  pickupLocationLongitude: number;
  pickupLocationContactPhone: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}