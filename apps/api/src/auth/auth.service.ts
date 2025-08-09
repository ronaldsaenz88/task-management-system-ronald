import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Validates a user by checking the email and password.
   * @param email - The email of the user.
   * @param pass - The password of the user.
   * @returns The user object if validation is successful, otherwise null.
   */
  async validateUser(email: string, pass: string): Promise<{ id: string; email: string } | null> {
    const user = await this.userService.findOne(email);

    // Check if user exists and password matches
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return { ...result, id: result.id.toString() };
    }
    return null;
  }

  /**
   * Logs in a user by generating a JWT token.
   * @param user - The user object containing email, id, roles, and orgId.
   * @returns An object containing the access token.
   */
  async login(user: { email: string; id: string; roles: string[]; orgId: string }) {
    // Include roles and org in JWT payload
    const payload = { username: user.email, sub: user.id, roles: user.roles, orgId: user.orgId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}