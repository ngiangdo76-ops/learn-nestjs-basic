import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Mật khẩu đã mã hóa

  @Column()
  create_at: Date;

  @Column()
  update_at: Date;
}
