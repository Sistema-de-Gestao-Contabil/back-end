import { Test, TestingModule } from '@nestjs/testing';
import { BackAccountService } from './back-account.service';

describe('BackAccountService', () => {
  let service: BackAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackAccountService],
    }).compile();

    service = module.get<BackAccountService>(BackAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
