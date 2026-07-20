import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createUser(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    user.create_at = new Date();
    user.update_at = new Date();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }
  findByEmail(email: string) {
    const user = this.userRepository.findOneBy({ email });
    return user;
  }
  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const status = bcrypt.compareSync(password, user.password);
    if (status) {
      return user;
    }
    return null;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
