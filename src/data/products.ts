import { Product } from '@/types/product';
import blackSoapImg from '@/assets/black-soap.jpg';
import kernelOilImg from '@/assets/kernel-oil.jpg';

export const products: Product[] = [
  {
    id: 'black-soap',
    name: 'Natural Black Soap',
    type: 'black-soap',
    description: 'Authentic African black soap made with traditional methods. Rich in vitamins and antioxidants, perfect for deep cleansing and nourishing your skin naturally.',
    image: blackSoapImg,
    basePrice: 2000,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '250g', price: 2500, stock: 50 },
          { size: '500g', price: 4500, stock: 30 }
        ]
      },
      {
        variant: 'perfume',
        sizes: [
          { size: '250g', price: 2200, stock: 45 },
          { size: '500g', price: 4000, stock: 25 }
        ]
      },
      {
        variant: 'natural',
        sizes: [
          { size: '250g', price: 2000, stock: 60 },
          { size: '500g', price: 3800, stock: 40 }
        ]
      }
    ]
  },
  {
    id: 'kernel-oil',
    name: 'Pure Kernel Oil',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: kernelOilImg,
    basePrice: 1500,
    sizes: [
      { size: '250ml', price: 1500, stock: 70 },
      { size: '500ml', price: 2800, stock: 50 },
      { size: '1000ml', price: 5000, stock: 30 }
    ]
  }
];
