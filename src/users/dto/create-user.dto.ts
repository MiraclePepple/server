export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  roleIds?: string[];
}
