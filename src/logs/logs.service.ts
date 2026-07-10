import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(private supabase: SupabaseService) {}


  private getISTDateString(): string {
    // Get "today" as a YYYY-MM-DD string, in IST, regardless of server timezone
    const now = new Date();
    const istString = now.toLocaleString('en-CA', { timeZone: 'Asia/Kolkata' });
    // 'en-CA' locale formats as YYYY-MM-DD, which matches Postgres 'date' type
    return istString.split(',')[0];
  }

  async create(dto: CreateLogDto) {
    let diff =
      (new Date(`1970-01-01 ${dto.endTime}`).getTime() -
        new Date(`1970-01-01 ${dto.startTime}`).getTime()) /
      60000;
    if (diff < 0) diff += 1440;
    diff = Math.round(diff);

    const { data, error } = await this.supabase.client
      .from('logs')
      .insert({
        category: dto.category,
        task_name: dto.taskName,
        start_time: dto.startTime,
        end_time: dto.endTime,
        duration_minutes: diff,
        log_date: this.getISTDateString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
  const { error } = await this.supabase.client.from('logs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}

  async findRecent() {
    // last 30 days, full detail
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoff = thirtyDaysAgo.toISOString().split('T')[0];

    const { data, error } = await this.supabase.client
      .from('logs')
      .select('*')
      .gte('log_date', cutoff)
      .order('log_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getAverages() {
    const { data, error } = await this.supabase.client
      .from('summary_averages')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}