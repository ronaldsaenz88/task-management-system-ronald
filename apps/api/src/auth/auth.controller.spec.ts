import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw error if email or password is missing', async () => {
      await expect(controller.login({ email: '', password: '' })).rejects.toThrow('Email and password are required');
      await expect(controller.login({ email: 'test@example.com' })).rejects.toThrow('Email and password are required');
      await expect(controller.login({ password: '123456' })).rejects.toThrow('Email and password are required');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      await expect(controller.login({ email: 'test@example.com', password: 'wrongpass' }))
        .rejects
        .toThrow(UnauthorizedException);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith('test@example.com', 'wrongpass');
    });

    it('should return JWT if credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockImplementation((payload) => ({ access_token: 'jwt.token', ...payload }));

      const result = await controller.login({ email: 'test@example.com', password: 'goodpass', roles: ['user'], orgId: 'org1' });
      expect(result).toEqual({ access_token: 'jwt.token', ...user, roles: ['user'], orgId: 'org1' });
      expect(mockAuthService.login).toHaveBeenCalledWith({ ...user, roles: ['user'], orgId: 'org1' });
    });

    it('should default roles and orgId if not provided', async () => {
      const user = { id: 2, email: 'another@example.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockImplementation((payload) => ({ access_token: 'jwt.token', ...payload }));

      const result = await controller.login({ email: 'another@example.com', password: 'goodpass' });
      expect(result).toEqual({ access_token: 'jwt.token', ...user, roles: [], orgId: '' });
      expect(mockAuthService.login).toHaveBeenCalledWith({ ...user, roles: [], orgId: '' });
    });
  });
});