import { Product } from '@/types/product';
import blackSoapImg from '@/assets/black-soap.jpg';
import kernelOilImg from '@/assets/kernel-oil.jpg';

export const products: Product[] = [
  // Black Soap - Exquisite Variants
  {
    id: 'black-soap-exquisite-250g',
    name: 'Black Soap - Exquisite (250g)',
    type: 'black-soap',
    description: 'Authentic African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.',
    image: blackSoapImg,
    basePrice: 2500,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '250g', price: 2500, stock: 50 }
        ]
      }
    ]
  },
  {
    id: 'black-soap-exquisite-500g',
    name: 'Black Soap - Exquisite (500g)',
    type: 'black-soap',
    description: 'Authentic African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.',
    image: blackSoapImg,
    basePrice: 4500,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '500g', price: 4500, stock: 30 }
        ]
      }
    ]
  },
  // Black Soap - Perfume Variants
  {
    id: 'black-soap-perfume-250g',
    name: 'Black Soap - Perfume (250g)',
    type: 'black-soap',
    description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.',
    image: blackSoapImg,
    basePrice: 2200,
    variants: [
      {
        variant: 'perfume',
        sizes: [
          { size: '250g', price: 2200, stock: 45 }
        ]
      }
    ]
  },
  {
    id: 'black-soap-perfume-500g',
    name: 'Black Soap - Perfume (500g)',
    type: 'black-soap',
    description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.',
    image: blackSoapImg,
    basePrice: 4000,
    variants: [
      {
        variant: 'perfume',
        sizes: [
          { size: '500g', price: 4000, stock: 25 }
        ]
      }
    ]
  },
  // Black Soap - Natural Variants
  {
    id: 'black-soap-natural-250g',
    name: 'Black Soap - Natural (250g)',
    type: 'black-soap',
    description: 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.',
    image: blackSoapImg,
    basePrice: 2000,
    variants: [
      {
        variant: 'natural',
        sizes: [
          { size: '250g', price: 2000, stock: 60 }
        ]
      }
    ]
  },
  {
    id: 'black-soap-natural-500g',
    name: 'Black Soap - Natural (500g)',
    type: 'black-soap',
    description: 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.',
    image: blackSoapImg,
    basePrice: 3800,
    variants: [
      {
        variant: 'natural',
        sizes: [
          { size: '500g', price: 3800, stock: 40 }
        ]
      }
    ]
  },
  // Kernel Oil Variants
  {
    id: 'kernel-oil-250ml',
    name: 'Pure Kernel Oil (250ml)',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: kernelOilImg,
    basePrice: 1500,
    sizes: [
      { size: '250ml', price: 1500, stock: 70 }
    ]
  },
  {
    id: 'kernel-oil-500ml',
    name: 'Pure Kernel Oil (500ml)',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: kernelOilImg,
    basePrice: 2800,
    sizes: [
      { size: '500ml', price: 2800, stock: 50 }
    ]
  },
  {
    id: 'kernel-oil-1000ml',
    name: 'Pure Kernel Oil (1000ml)',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: kernelOilImg,
    basePrice: 5000,
    sizes: [
      { size: '1000ml', price: 5000, stock: 30 }
    ]
  }
];
