import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { ArchiveService } from './archieve.service';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [LogsController],
  providers: [LogsService,ArchiveService],
})
export class LogsModule {}
