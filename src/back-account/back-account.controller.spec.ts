import { Test, TestingModule } from '@nestjs/testing';
import { BackAccountController } from './back-account.controller';
import { BackAccountService } from './back-account.service';

describe('BackAccountController', () => {
  let controller: BackAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackAccountController],
      providers: [BackAccountService],
    }).compile();

    controller = module.get<BackAccountController>(BackAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
