import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AtGuard } from './at.guard';

describe('AtGuard', () => {
  let guard: AtGuard;
  let reflector: jest.Mocked<Reflector>;
  let mockContext: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new AtGuard(reflector);
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;
  });

  it('should allow access when route is marked as public', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const result = guard.canActivate(mockContext);

    expect(reflector.getAllAndOverride).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
