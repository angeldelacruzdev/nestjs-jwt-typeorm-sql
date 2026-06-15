import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HashService } from '../common/hash.service';
import { DRIZZLE } from '../database/drizzle.provider';

const mockUser = {
  id: 1,
  name: 'Test',
  email: 'test@test.com',
  password: 'hashed_password',
  hashdRt: null,
  full_name: null,
  isActive: true,
};

function createMockDb() {
  let resolveData: any = [];

  const queryBuilder = {
    where: jest.fn().mockImplementation(() => Promise.resolve(resolveData)),
    then: function (onfulfilled: any) { return Promise.resolve(resolveData).then(onfulfilled); },
  };

  return {
    setResolveData: (data: any) => { resolveData = data; },
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue([{ insertId: 1 }]),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue(queryBuilder),
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue([]),
    }),
  };
}

describe('UsersService', () => {
  let service: UsersService;
  let mockDb: ReturnType<typeof createMockDb>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    mockDb = createMockDb();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DRIZZLE, useValue: mockDb },
        {
          provide: HashService,
          useValue: { hash: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    hashService = module.get(HashService) as jest.Mocked<HashService>;
  });

  describe('create', () => {
    it('should insert a user and return it', async () => {
      hashService.hash.mockResolvedValue('hashed_password');
      mockDb.setResolveData([mockUser]);

      const result = await service.create({
        name: 'Test',
        email: 'test@test.com',
        password: 'plain_password',
      });

      expect(hashService.hash).toHaveBeenCalledWith('plain_password');
      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockDb.setResolveData([mockUser]);

      const result = await service.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockDb.setResolveData([mockUser]);

      const result = await service.findOne(1);

      expect(mockDb.select().from().where).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockDb.setResolveData([]);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      mockDb.setResolveData([mockUser]);

      const result = await service.findOneByEmail('test@test.com');

      expect(mockDb.select().from().where).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when email is not found', async () => {
      mockDb.setResolveData([]);

      const result = await service.findOneByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      mockDb.setResolveData([mockUser]);

      const result = await service.update(1, { name: 'Updated' });

      expect(mockDb.update).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should hash the password if provided', async () => {
      hashService.hash.mockResolvedValue('new_hashed');
      mockDb.setResolveData([mockUser]);

      await service.update(1, { password: 'new_password' });

      expect(hashService.hash).toHaveBeenCalledWith('new_password');
    });
  });

  describe('remove', () => {
    it('should delete a user by id', async () => {
      await service.remove(1);

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
