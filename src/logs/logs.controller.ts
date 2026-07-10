import { Body, Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ArchiveService } from './archieve.service';


@Controller('logs')
@UseGuards(AuthGuard)
export class LogsController {
  constructor(private logsService: LogsService, private archiveService: ArchiveService) {}

  @Post()
  create(@Body() dto: CreateLogDto) {
    return this.logsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  return this.logsService.remove(id);
}

  @Get()
  findRecent() {
    return this.logsService.findRecent();
  }

  @Get('averages')
  getAverages() {
    return this.logsService.getAverages();
  }
  @Get('test-archieve')
  async testArchieve() {
    this.archiveService.computeAndSaveAverages();
    return {triggered: true}
  }
}