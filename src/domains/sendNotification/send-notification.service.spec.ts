import { Test, TestingModule } from '@nestjs/testing';
import { SendNotificationService } from './send-notification.service';

describe('SendNotificationService', () => {
  let service: SendNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendNotificationService],
    }).compile();

    service = module.get<SendNotificationService>(SendNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
