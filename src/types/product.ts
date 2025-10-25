export type ProductType = 'black-soap' | 'kernel-oil';
export type SoapVariant = 'exquisite' | 'perfume' | 'natural';
export type SoapSize = '250g' | '500g';
export type OilSize = '250ml' | '500ml' | '1000ml';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  image: string;
  basePrice: number;
  variants?: {
    variant: SoapVariant;
    sizes: {
      size: SoapSize;
      price: number;
      stock: number;
    }[];
  }[];
  sizes?: {
    size: OilSize;
    price: number;
    stock: number;
  }[];
}

export interface CartItem {
  productId: string;
  name: string;
  type: ProductType;
  variant?: SoapVariant;
  size: string;
  price: number;
  quantity: number;
  image: string;
}
