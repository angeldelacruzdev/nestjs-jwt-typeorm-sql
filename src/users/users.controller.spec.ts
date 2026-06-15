import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  it('should call usersService.create', async () => {
    const dto = { name: 'Test', email: 'test@test.com', password: '12345678' };
    usersService.create.mockResolvedValue({ id: 1, ...dto, password: 'hashed', full_name: null, hashdRt: null, isActive: true });

    await controller.create(dto);

    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('should call usersService.findAll', async () => {
    await controller.findAll();

    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('should call usersService.findOne', async () => {
    await controller.findOne(1);

    expect(usersService.findOne).toHaveBeenCalledWith(1);
  });

  it('should call usersService.update', async () => {
    const dto = { name: 'Updated' };
    await controller.update(1, dto);

    expect(usersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call usersService.remove', async () => {
    await controller.remove(1);

    expect(usersService.remove).toHaveBeenCalledWith(1);
  });
});
