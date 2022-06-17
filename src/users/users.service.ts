import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
const bcrypt = require('bcrypt');
// This should be a real class/interface representing a user entity
export type User = any;
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });
  }
  async createUser({ email, password, firstName }): Promise<User | undefined> {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    password = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        firstName,
        password,
      },
    });
  }
}
