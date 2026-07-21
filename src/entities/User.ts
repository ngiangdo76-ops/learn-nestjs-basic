import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    nullable: true,
  })
  refresh_token?: string;

  @Column()
  password: string;

  @Column()
  create_at: Date;

  @Column()
  update_at: Date;
}
