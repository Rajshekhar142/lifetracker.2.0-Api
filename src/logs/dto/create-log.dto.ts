import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateLogDto {
  @IsIn(['builder', 'learner', 'casual'])
  category!: string;

  @IsString()
  @IsNotEmpty()
  taskName!: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be in HH:MM format' })
  startTime!: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be in HH:MM format' })
  endTime!: string;
}