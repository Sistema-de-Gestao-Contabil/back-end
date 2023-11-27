import { Test, TestingModule } from '@nestjs/testing';
import { TransactiosController } from './transactions.controller';
import { TransactiosService } from './transactions.service';

describe('TransactiosController', () => {
  let controller: TransactiosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactiosController],
      providers: [TransactiosService],
    }).compile();

    controller = module.get<TransactiosController>(TransactiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
