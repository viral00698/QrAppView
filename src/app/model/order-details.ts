export class OrderDetails {
  orderDetailsId?: string;
  itemName!: string;
  productId!: string;
  foodCategory?: any;
  amount!: number;
  isJain!: boolean;
  quntity!: number;
  orderId?: any;
  offerId?: string;
  offerType?: any;
  offerApplied: boolean = false;
  isDelivered?: boolean;

  constructor(init?: Partial<OrderDetails>) {
    Object.assign(this, init);
  }
}