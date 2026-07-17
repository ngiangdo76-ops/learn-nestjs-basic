import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export default class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
