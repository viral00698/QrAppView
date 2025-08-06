import { OrderStatus } from "../constent/order-status";
import { PaymentMode } from "../constent/payment-mode";
import { OrderDetails } from "./OrderDetails";

export class Orders{
    orderId?: string; // UUID as string
    customerUUID?: string; // UUID as string
    customerMobileNo?: string;
    token_no?: string;
    txid?: string;
    orderDetails?: OrderDetails[];
    orderAt?: Date;
    payment_mode?: PaymentMode;
    vendorId?: string; // UUID as string
    totelAmount?: number;
    gst?: number; // in Rs.
    sgst?: number; // in Rs.
    restaurantsCharge?: number; // in Rs.
    orderStatus?: OrderStatus;
    tableOrder?:any
}