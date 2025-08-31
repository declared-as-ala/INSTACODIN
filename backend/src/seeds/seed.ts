import { AppDataSource } from 'src/data-source';
import { Product } from '../products/product.entity';
import { Variant } from '../variants/variant.entity';
import { User } from '../users/user.entity';

async function seedDatabase() {
  // Ensure the DataSource is initialized
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);
  const variantRepo = AppDataSource.getRepository(Variant);

  // 1. Create an admin user
  const adminUser = userRepo.create({
    username: 'admin',
    passwordHash: 'hashed_password_here', // hash properly
  });
  await userRepo.save(adminUser);

  // 2. Create a product
  const product1 = productRepo.create({
    name: 'Classic Shoes',
    index: 1,
  });
  await productRepo.save(product1);

  // 3. Create variants
  const variants = [
    variantRepo.create({
      name: 'Classic Shoes - Red 42',
      index: 1,
      skuCode: '1_1',
      createdBy: adminUser.username,
      product: product1,
    }),
    variantRepo.create({
      name: 'Classic Shoes - Blue 43',
      index: 2,
      skuCode: '1_2',
      createdBy: adminUser.username,
      product: product1,
    }),
  ];

  await variantRepo.save(variants);

  console.log('Database seeded successfully!');
}

seedDatabase().catch((err) => console.error(err));
