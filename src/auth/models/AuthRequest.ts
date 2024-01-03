import { Request } from 'express';
import { User } from 'src/entities/user.entity';
export interface AuthRequest extends Request {
  user: User;
}
