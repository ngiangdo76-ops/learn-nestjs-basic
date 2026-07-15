import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  // constructor(private readonly db: DatabaseService) {}
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  getUsers() {
    // return this.db.findAll();
  }
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  find(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
  create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOneBy({ id });
  }
  delete(id: number) {
    return this.userRepository.delete(id);
  }
}
