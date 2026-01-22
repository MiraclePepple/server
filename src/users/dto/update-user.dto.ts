export class UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
  roleIds?: string[];
}
