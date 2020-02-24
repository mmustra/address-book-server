import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Ping server',
  })
  @ApiResponse({
    status: 200,
    description: 'Server api is live!',
  })
  ping(): string {
    return 'Server api is live!';
  }
}
