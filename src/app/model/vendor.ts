import { Address } from "./address";

export class Vendor {
  vendorId?: string; // UUID as string
  storeName!: string;
  ownerName!: string;
  gstNo?: string;
  fssiNo?: string;
  gstCharge?: number;         // in %
  sgstCharge?: number;        // in %
  resturentCharge?: number;   // in %
  photo?: string;
  status?: boolean;
  createAt?: Date;

  upa?: string;
  rk?: string;
  sk?: string;
  mobileNo!:string;
  aadharNo?:string;
	aadharDoc?:string;
	panNo?:string;
	panDoc?:string;
	fssiDoc?:string;
	gstDoc?:string;
  address?:Address
  constructor(init?: Partial<Vendor>) {
    Object.assign(this, init);
  }
}
