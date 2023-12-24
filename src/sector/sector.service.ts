import { Injectable } from '@nestjs/common';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from 'src/entities/sector.entity';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private sectorRepository: Repository<Sector>,
  ) {}

  async create(createSectorDto: CreateSectorDto) {
    const sector = this.sectorRepository.create({
      name: createSectorDto.name,
    });

    return await this.sectorRepository.save(sector);
  }

  async findAll() {
    return await this.sectorRepository.find();
  }

  async findOne(id: number) {
    return await this.sectorRepository.findOneBy({ id: id });
  }

  async update(id: number, updateCompanyDto: UpdateSectorDto) {
    console.log(updateCompanyDto);
    await this.sectorRepository.update(id, updateCompanyDto);
    return this.sectorRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.sectorRepository.delete({ id: id });
  }
}
