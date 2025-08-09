import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user login.
   * Validates the request body for email and password, checks user credentials,
   * and returns a JWT token if successful.
   *
   * @param body - The request body containing email, password.
   * @returns A JWT token if login is successful.
   * @throws UnauthorizedException if the credentials are invalid.
   */
  @Post('login')
  async login(@Body() body) {
    // Validate request body
    if (!body.email || !body.password) {
      throw new Error('Email and password are required');
    }

    // Validate user credentials
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If user is found, proceed with login
    return this.authService.login({
      ...user,
      roles: body.roles || [], // Provide roles from the request body or default to an empty array
      orgId: body.orgId || '', // Provide orgId from the request body or default to an empty string
    });
  }
}