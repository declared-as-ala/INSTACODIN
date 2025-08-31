import { IsString, IsUUID, Length } from 'class-validator';
export class CreateVariantDto {
  @IsUUID() productId!: string;
  @IsString() @Length(1, 120) name!: string;
}
