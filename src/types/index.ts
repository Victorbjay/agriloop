import { Timestamp, GeoPoint } from 'firebase/firestore';

export type UserRole = 'seller' | 'buyer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    businessName?: string;
    rcNumber?: string;
  };
  verification: {
    bvn: string;
    bvnVerified: boolean;
    cacVerified: boolean;
    verificationStatus: 'pending' | 'verified' | 'failed';
    verifiedAt?: Timestamp;
  };
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  badge: 'none' | 'bronze' | 'silver' | 'gold';
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  availableFrom: Timestamp;
  availableUntil?: Timestamp;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    geohash: string;
  };
  description?: string;
  images?: string[];
  status: 'active' | 'sold' | 'expired' | 'draft';
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  listingSnapshot: Listing;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  quantityKg: number;
  pricePerKg: number;
  totalAmount: number;
  deliveryMethod: 'self_pickup' | 'request_delivery';
  status: OrderStatus;
  payment?: {
    interswitchRef: string;
    transactionRef: string;
    paidAt: Timestamp;
    verifiedAt: Timestamp;
  };
  timeline: {
    orderedAt: Timestamp;
    paidAt?: Timestamp;
    confirmedAt?: Timestamp;
    readyAt?: Timestamp;
    completedAt?: Timestamp;
    cancelledAt?: Timestamp;
  };
  pickupLocation: {
    address: string;
    coordinates: { lat: number; lng: number };
    contactPhone: string;
  };
  disputeReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}