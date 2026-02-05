
import pool from './backend/config/database.js';
import { generateUUID } from './backend/utils/uuid.js';

const products = [
    // Black Soap - Home Page
    {
        name: 'Natural Black Soap',
        type: 'black-soap',
        description: 'Natural African black soap made with traditional methods. Rich in vitamins and antioxidants, perfect for deep cleansing and nourishing your skin naturally.',
        price: 2000,
        stock: 100,
        image_url: '/assets/black-soap.jpg'
    },
    //Kernel Oil - Home Page
    {
        name: 'Pure Kernel Oil',
        type: 'kernel-oil',
        description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
        price: 1500,
        stock: 100,
        image_url: '/assets/kernel-oil.jpg'
    },
    // Black Soap - Exquisite Variants
    {
        name: 'Black Soap - Exquisite (250g)',
        type: 'black-soap',
        description: 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.',
        price: 2500,
        stock: 50,
        image_url: '/assets/bs_et-250.jpg'
    },
    {
        name: 'Black Soap - Exquisite (500g)',
        type: 'black-soap',
        description: 'Natural African black soap made with traditional methods. Exquisite variant with premium ingredients for luxury skincare.',
        price: 4500,
        stock: 30,
        image_url: '/assets/bs_et-500.jpg'
    },
    // Black Soap - Perfume Variants
    {
        name: 'Black Soap - Perfume (250g)',
        type: 'black-soap',
        description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.',
        price: 2200,
        stock: 45,
        image_url: '/assets/bs_p-250.jpg'
    },
    {
        name: 'Black Soap - Perfume (500g)',
        type: 'black-soap',
        description: 'African black soap infused with natural fragrances. Perfect for those who love a gentle scent with their skincare routine.',
        price: 4000,
        stock: 25,
        image_url: '/assets/bs_p-500.jpg'
    },
    // Black Soap - Natural Variants
    {
        name: 'Black Soap - Natural (250g)',
        type: 'black-soap',
        description: 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.',
        price: 2000,
        stock: 60,
        image_url: '/assets/bs_nf-250.jpg'
    },
    {
        name: 'Black Soap - Natural (500g)',
        type: 'black-soap',
        description: 'Pure natural African black soap with no added fragrances. Perfect for sensitive skin and those who prefer unscented products.',
        price: 3800,
        stock: 40,
        image_url: '/assets/bs_nf-500.jpg'
    },
    // Kernel Oil Variants
    {
        name: 'Pure Kernel Oil (250ml)',
        type: 'kernel-oil',
        description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
        price: 1500,
        stock: 70,
        image_url: '/assets/ke_250.jpg'
    },
    {
        name: 'Pure Kernel Oil (500ml)',
        type: 'kernel-oil',
        description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
        price: 2800,
        stock: 50,
        image_url: '/assets/ke_500.jpg'
    },
    {
        name: 'Pure Kernel Oil (1000ml)',
        type: 'kernel-oil',
        description: 'Cold-pressed pure kernel oil extracted from premium palm kernels. Rich in essential fatty acids, perfect for hair and skin moisturizing.',
        price: 5000,
        stock: 30,
        image_url: '/assets/ke_1000.jpg'
    }
];

async function seedProducts() {
    try {
        console.log('Seeding products...');

        // Check if table empty
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
        if (rows[0].count > 0) {
            console.log('Products table already has data. Skipping seed.');
            process.exit(0);
        }

        for (const p of products) {
            const id = generateUUID();
            await pool.execute(
                `INSERT INTO products (id, name, type, description, price, stock, image_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [id, p.name, p.type, p.description, p.price, p.stock, p.image_url]
            );
            console.log(`Inserted ${p.name}`);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedProducts();
