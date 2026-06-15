import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
            refreshTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  it('should call authService.login', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    authService.login.mockResolvedValue({ access_token: 'at', refresh_token: 'rt' });

    await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('should call authService.register', async () => {
    const dto = { name: 'Test', email: 'test@test.com', password: '12345678' };
    authService.register.mockResolvedValue({ access_token: 'at', refresh_token: 'rt' });

    await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should call authService.logout', async () => {
    authService.logout.mockResolvedValue(undefined);

    await controller.logout(1);

    expect(authService.logout).toHaveBeenCalledWith(1);
  });

  it('should call authService.refreshTokens', async () => {
    authService.refreshTokens.mockResolvedValue({ access_token: 'at', refresh_token: 'rt' });

    await controller.refreshTokens('refresh_token', 1);

    expect(authService.refreshTokens).toHaveBeenCalledWith(1, 'refresh_token');
  });
});
