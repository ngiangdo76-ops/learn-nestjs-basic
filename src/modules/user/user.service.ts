import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}
  getUsers() {
    return this.db.findAll();
  }
}
