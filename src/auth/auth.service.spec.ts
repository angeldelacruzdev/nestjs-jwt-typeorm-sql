import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/hash.service';

const mockUser = {
  id: 1,
  name: 'Test',
  email: 'test@test.com',
  password: 'hashed_password',
  hashdRt: 'hashed_refresh_token',
  full_name: null,
  isActive: true,
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    hashService = module.get(HashService) as jest.Mocked<HashService>;
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      hashService.hash.mockResolvedValue('new_hashed_rt');

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@test.com');
      expect(hashService.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(usersService.update).toHaveBeenCalledWith(1, { hashdRt: 'new_hashed_rt' });
      expect(result).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
    });

    it('should throw ForbiddenException when user is not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@test.com', password: 'password123' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('register', () => {
    const dto = { name: 'New', email: 'new@test.com', password: 'password123', full_name: undefined };

    it('should create user and return tokens', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');
      hashService.hash.mockResolvedValue('hashed_rt');

      const result = await service.register(dto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('new@test.com');
      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
    });

    it('should throw ConflictException when email already exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logout', () => {
    it('should clear hashdRt for the user', async () => {
      usersService.update.mockResolvedValue(undefined);

      await service.logout(1);

      expect(usersService.update).toHaveBeenCalledWith(1, { hashdRt: null });
    });
  });

  describe('refreshTokens', () => {
    const refreshToken = 'valid_refresh_token';

    it('should return new tokens when refresh token is valid', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('new_access_token')
        .mockResolvedValueOnce('new_refresh_token');
      hashService.hash.mockResolvedValue('new_hashed_rt');

      const result = await service.refreshTokens(1, refreshToken);

      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(hashService.compare).toHaveBeenCalledWith(refreshToken, 'hashed_refresh_token');
      expect(result).toEqual({ access_token: 'new_access_token', refresh_token: 'new_refresh_token' });
    });

    it('should throw ForbiddenException when user is not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.refreshTokens(1, refreshToken)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user has no refresh token', async () => {
      usersService.findOne.mockResolvedValue({ ...mockUser, hashdRt: null });

      await expect(service.refreshTokens(1, refreshToken)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when refresh token does not match', async () => {
      usersService.findOne.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      await expect(service.refreshTokens(1, refreshToken)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');

      const result = await service.getTokens(1, 'test@test.com');

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ access_token: 'access_token', refresh_token: 'refresh_token' });
    });
  });
});
