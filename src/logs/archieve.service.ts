import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ArchiveService {
  private readonly logger = new Logger(ArchiveService.name);

  constructor(private supabase: SupabaseService) {}

  @Cron('0 23 * * *', { timeZone: 'Asia/Kolkata' })
  async handleDailyAverageUpdate() {
    this.logger.log('Running nightly 180-day average computation...');
    await this.computeAndSaveAverages();
  }

  async computeAndSaveAverages() {
    const today = new Date();

    const start = new Date(today);
    start.setDate(start.getDate() - 180);
    const startStr = start.toISOString().split('T')[0];

    const end = new Date(today);
    end.setDate(end.getDate() - 31);
    const endStr = end.toISOString().split('T')[0];

    const { data, error } = await this.supabase.client
      .from('logs')
      .select('category, duration_minutes')
      .gte('log_date', startStr)
      .lte('log_date', endStr);

    if (error) throw new Error(error.message);

    const totals = { builder: 0, learner: 0, casual: 0 };
    const dayCount = 150; // 180 - 31 + 1, the size of the window

    for (const row of data) {
      totals[row.category] += row.duration_minutes;
    }

    const builderAvg = totals.builder / dayCount;
    const learnerAvg = totals.learner / dayCount;
    const casualAvg = totals.casual / dayCount;

    const { error: updateError } = await this.supabase.client
      .from('summary_averages')
      .update({
        builder_avg_minutes: builderAvg,
        learner_avg_minutes: learnerAvg,
        casual_avg_minutes: casualAvg,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateError) throw new Error(updateError.message);

    this.logger.log(
      `Averages updated — builder: ${builderAvg.toFixed(1)}m, learner: ${learnerAvg.toFixed(1)}m, casual: ${casualAvg.toFixed(1)}m`,
    );
  }
}