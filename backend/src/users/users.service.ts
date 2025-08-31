import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async onModuleInit() {
    // Seed test user if not exists
    const exists = await this.repo.findOne({ where: { username: 'test' } });
    if (!exists) {
      const u = this.repo.create({
        username: 'test',
        passwordHash: await bcrypt.hash('test', 10),
      });
      await this.repo.save(u);
      console.log('Seeded user: test/test');
    }
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
}
