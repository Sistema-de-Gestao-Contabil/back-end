import { Module } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorController } from './sector.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from 'src/entities/sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector])],

  controllers: [SectorController],
  providers: [SectorService],
})
export class SectorModule {}
