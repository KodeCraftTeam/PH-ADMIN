import { Controller, Get, Header } from '@nestjs/common';
import { register } from './metrics';

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  getMetrics() {
    return register.metrics();
  }
}
