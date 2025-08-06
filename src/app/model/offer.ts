export class Offer {

  offerId!: string; 
  offerName!: string;
  isActive!: boolean;
  offerType!: 'PERCENTAGE' | 'FIXED' | 'FLAT' | string; // Enum as string
  discountBypercentage!: number;
  fixAmount!: number;
  flatDiscount!: number;
  minOrderAmount!: number;
  message!: string;
  expireDate!: number; // timestamp in ms
  vendorId!: string; // UUID
  freeItem!: string; // UUID
  createAt!: number;
  productIds!: Set<string>; // UUIDs
}
