import { Product } from '@/types/product';
import blackSoapImg from '@/assets/black-soap.jpg';
import kernelOilImg from '@/assets/kernel-oil.jpg';
import bs_et250 from '@/assets/bs_et-250.jpg';
import bs_et500 from '@/assets/bs_et-500.jpg';
import bs_nf250 from '@/assets/bs_nf-250.jpg';
import bs_nf500 from '@/assets/bs_nf-500.jpg';
import bs_p250 from '@/assets/bs_p-250.jpg';
import bs_p500 from '@/assets/bs_p-500.jpg';
import ke250 from '@/assets/ke_250.jpg';
import ke500 from '@/assets/ke_500.jpg';
import ke1k from '@/assets/ke_1000.jpg';


export const products: Product[] = [
  // Black Soap - Home Page
  {
    id: 'black-soap',
    name: 'Natural Black Soap',
    type: 'black-soap',
    description: 'Natural African black soap made with traditional methods. Rich in vitamins and antioxidants, perfect for deep cleansing and nourishing your skin naturally.',
    image: blackSoapImg,
    basePrice: 2000,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '250g', price: 2000, stock: 50 },
          { size: '500g', price: 4000, stock: 30 }
        ]
      },
      {
        variant: 'perfume',
        sizes: [
          { size: '250g', price: 2000, stock: 45 },
          { size: '500g', price: 4000, stock: 25 }
        ]
      },
      {
        variant: 'natural',
        sizes: [
          { size: '250g', price: 2000, stock: 60 },
          { size: '500g', price: 4000, stock: 40 }
        ]
      }
    ]
  },
  //Kernel Oil - Home Page
  {
    id: 'kernel-oil',
    name: 'Pure Kernel Oil',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: kernelOilImg,
    basePrice: 2500,
    sizes: [
      { size: '250ml', price: 2500, stock: 70 },
      { size: '500ml', price: 4500, stock: 50 },
      { size: '1000ml', price: 8000, stock: 30 }
    ]
  },
  // Black Soap - Exquisite Variants
  {
    id: 'black-soap-exquisite-250g',
    name: 'Black Soap - Exquisite (250g)',
    type: 'black-soap',
    description: 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skin care.',
    image: bs_et250,
    basePrice: 2000,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '250g', price: 2000, stock: 50 }
        ]
      }
    ]
  },
  {
    id: 'black-soap-exquisite-500g',
    name: 'Black Soap - Exquisite (500g)',
    type: 'black-soap',
    description: 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skin care.',
    image: bs_et500,
    basePrice: 4000,
    variants: [
      {
        variant: 'exquisite',
        sizes: [
          { size: '500g', price: 4000, stock: 30 }
        ]
      }
    ]
  },
  // Black Soap - Perfume Variants
  {
    id: 'black-soap-perfume-250g',
    name: 'Black Soap - Perfume (250g)',
    type: 'black-soap',
    description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skin care routine.',
    image: bs_p250,
    basePrice: 2000,
    variants: [
      {
        variant: 'perfume',
        sizes: [
          { size: '250g', price: 2000, stock: 45 }
        ]
      }
    ]
  },
  {
    id: 'black-soap-perfume-500g',
    name: 'Black Soap - Perfume (500g)',
    type: 'black-soap',
    description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skin care routine.',
    image: bs_p500,
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
    image: bs_nf250,
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
    image: bs_nf500,
    basePrice: 4000,
    variants: [
      {
        variant: 'natural',
        sizes: [
          { size: '500g', price: 4000, stock: 40 }
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
    image: ke250,
    basePrice: 2500,
    sizes: [
      { size: '250ml', price: 2500, stock: 70 }
    ]
  },
  {
    id: 'kernel-oil-500ml',
    name: 'Pure Kernel Oil (500ml)',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: ke500,
    basePrice: 4500,
    sizes: [
      { size: '500ml', price: 4500, stock: 50 }
    ]
  },
  {
    id: 'kernel-oil-1000ml',
    name: 'Pure Kernel Oil (1000ml)',
    type: 'kernel-oil',
    description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
    image: ke1k,
    basePrice: 8000,
    sizes: [
      { size: '1000ml', price: 8000, stock: 30 }
    ]
  }
];
