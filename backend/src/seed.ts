import 'reflect-metadata';
import { AppDataSource } from './typeorm.config';
import { User } from './users/user.entity';
import * as bcrypt from 'bcryptjs';

(async () => {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const exists = await repo.findOne({ where: { username: 'test' } });
  if (!exists) {
    const u = repo.create({
      username: 'test',
      passwordHash: await bcrypt.hash('test', 10),
    });
    await repo.save(u);
    console.log('Seeded user: test/test');
  } else {
    console.log('User already exists');
  }
  await AppDataSource.destroy();
})();
