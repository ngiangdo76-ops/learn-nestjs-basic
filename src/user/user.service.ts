import { InjectQueue } from '@nestjs/bullmq';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bullmq';
import { QueueName } from 'src/app.interface';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectQueue(QueueName.EMAIL)
    private emailQueue: Queue,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createnewUser(userData: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      throw new ConflictException('Email đã tồn tại');
    }
    const newuser = this.userRepository.create({
      ...userData,
      create_at: new Date(),
      update_at: new Date(),
    });

    const savedUser = await this.userRepository.save(newuser);
    await this.emailQueue.add(
      'send-welcome-email',
      {
        email: savedUser.email,
      },
      {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 2000,
        },
      },
    );
    return savedUser;
  }
  async createUser(body: any) {
    const job = await this.emailQueue.add(
      'sendEmail',
      {
        email: body.email,
        subject: 'Xin chào ' + body.email,
        message: 'Hello from NestJS',
      },
      {
        delay: 1000,
        attempts: 2,
        backoff: 1000,
      },
    );
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
  async saveRefreshToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    console.log(refreshToken);
    if (!user) {
      throw new NotFoundException('Refresh Tokenko tim thay user');
    }
    user.refresh_token = hashedRefreshToken;
    return this.userRepository.save(user);
  }

  async verifyRefreshToken(refreshToken: string, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user) {
      const status = await bcrypt.compare(refreshToken, user.refresh_token);
      if (status) {
        return user;
      }
    }
    return false;
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
