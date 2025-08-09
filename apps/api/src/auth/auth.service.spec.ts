import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';


describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;


  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword', // simulated bcrypt hash
    roles: ['user'],
    orgId: 'org1',
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user object if credentials are valid', async () => {
      mockUserService.findOne.mockResolvedValue({ ...mockUser });
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: '1', email: 'test@example.com', roles: ['user'], orgId: 'org1' });
      expect(mockUserService.findOne).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      const result = await service.validateUser('wrong@example.com', 'password');
      expect(result).toBeNull();
      expect(mockUserService.findOne).toHaveBeenCalledWith('wrong@example.com');
    });

    it('should return null if password does not match', async () => {
      mockUserService.findOne.mockResolvedValue({ ...mockUser });
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    });
  });

  describe('login', () => {
    it('should return an access_token with correct payload', async () => {
      const user = { email: 'test@example.com', id: '1', roles: ['user'], orgId: 'org1' };
      mockJwtService.sign.mockReturnValue('signed.jwt.token');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'signed.jwt.token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'test@example.com',
        sub: '1',
        roles: ['user'],
        orgId: 'org1',
      });
    });
  });
});