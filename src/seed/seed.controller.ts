import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seddService: SeedService,
  ) {}

  @Get()
  executedSeed() {
    return this.seddService.runSeed();
  }
}
