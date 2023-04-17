import { Controller, Get, Param, Res } from '@nestjs/common';
import { Public } from './common/decorator';
 

@Controller('/')
export class AppController {
  constructor() {}

  @Public()
  @Get('files/:file')
  async files(@Param('file') file: string, @Res() res) {
    return res.sendFile(file, { root: './files' });
  }
}
