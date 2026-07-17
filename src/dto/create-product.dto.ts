import { IsNumber, IsString, Length } from 'class-validator';

export default class CreateProductDto {
  @IsString({ message: 'Tên phải là ký tự' })
  @Length(1, 255, { message: 'Tên bắt buộc phải nhập' })
  name?: string;

  @IsNumber({}, { message: 'gia bat buoc phải là số' })
  price?: number;

  @IsString({ message: 'mo ta bat buoc phai la ky tu' })
  description?: string;
}
