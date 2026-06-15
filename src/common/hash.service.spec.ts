import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { HashService } from './hash.service';

jest.mock('bcrypt');

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  describe('hash', () => {
    it('should hash the data', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_value');
      const result = await service.hash('password123');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toBe('hashed_value');
    });
  });

  describe('compare', () => {
    it('should return true when data matches the hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.compare('password123', 'hashed_value');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_value');
      expect(result).toBe(true);
    });

    it('should return false when data does not match the hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const result = await service.compare('wrong', 'hashed_value');
      expect(result).toBe(false);
    });
  });
});
