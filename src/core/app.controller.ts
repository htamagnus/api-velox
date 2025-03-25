import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/status')
  healthCheck(): string {
    return 'Running';
    // return `${packageJson.name}@${packageJson.version} is running (environment: ${process.env['NODE_ENV']})`;
  }
}
