import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { Category } from 'src/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategorysController],
  providers: [CategorysService],
})
export class CategorysModule {}
