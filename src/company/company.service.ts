import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { SectorService } from 'src/sector/sector.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private readonly sectorService: SectorService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const sector = await this.sectorService.findOne(
        createCompanyDto.sectorId,
      );

      if (!sector) {
        throw new Error('Setor não encontrada');
      }

      const company = this.companyRepository.create({
        name: createCompanyDto.name,
        email: createCompanyDto.email,
        phone: createCompanyDto.phone,
        address: createCompanyDto.address,
        sector: sector,
        cashBalance: 0.0,
      });
      return await this.companyRepository.save(company);
    } catch (error) {
      console.error('Erro ao criar empresa:', error.message);
      throw error;
    }
  }

  async findAll() {
    return await this.companyRepository.find({
      relations: { sector: true, employees: true },
    });
  }

  async findOne(id: number) {
    return await this.companyRepository.findOne({
      where: { id },
      relations: {
        sector: true,
        employees: true,
        transactions: true,
        plannings: true,
      },
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    console.log(updateCompanyDto);
    await this.companyRepository.update(id, updateCompanyDto);
    return this.companyRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.companyRepository.delete(id);
  }
}
