import { Category } from './../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,
    private readonly companyService: CompanyService,
  ) {}

  async create(companyId: number, createCategoryDto: CreateCategoryDto) {
    try {
      const findCategory = await this.categorysRepository.find({
        where: {
          name: createCategoryDto.name,
        },
      });

      const company = await this.companyService.findOne(companyId);

      if (!company) {
        //throw new Error('Company não encontrada');
        return {
          status: 400,
          message: 'Company não encontrada',
        };
      }

      if (findCategory.length > 0) {
        return {
          status: 400,
          message: 'Essa categoria já foi criada!',
        };
      } else {
        const addCategory = this.categorysRepository.create({
          name: createCategoryDto.name,
          type: createCategoryDto.type,
          company: company,
        });

        const result = await this.categorysRepository.save(addCategory);
        return {
          status: 200,
          result,
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: 'Devido a um erro interno não foi possível criar a categoria.',
      };
    }
  }

  async findAll() {
    try {
      const result = await this.categorysRepository.find({
        relations: { company: true },
      });
      if (result.length > 0) {
        return {
          status: 200,
          result,
        };
      } else {
        return {
          status: 400,
          message: 'Categorias não encontradas!',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível encontrar as categorias',
      };
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.categorysRepository.find({
        where: {
          id,
        },
        relations: { company: true },
      });
      if (result.length > 0) {
        return {
          status: 200,
          result,
        };
      } else {
        return {
          status: 400,
          message: 'Categoria não encontrada!',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível encontrar a categoria',
      };
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto, request: Request) {
    try {
      const id = Number(request.query.id);
      const companyId = Number(request.query.companyId);

      const findCategory = await this.categorysRepository.find({
        where: {
          id,
        },
        relations: { company: true },
      });

      if (findCategory.length > 0) {
        if (companyId === findCategory[0].company.id) {
          await this.categorysRepository.update(id, updateCategoryDto);
          return {
            status: 200,
            message: 'Categoria atualizada com sucesso!',
          };
        } else {
          return {
            status: 400,
            message:
              'A empresa informada não tem permissão para alterar essa categoria.',
          };
        }
      } else {
        return {
          status: 400,
          message: 'Categoria não encontrada!',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível atualizar a categoria',
      };
    }
  }

  async remove(request: Request) {
    try {
      const id = Number(request.query.id);
      const companyId = Number(request.query.companyId);
      const findCategory = await this.categorysRepository.find({
        where: {
          id,
        },
        relations: { company: true },
      });

      if (findCategory.length > 0) {
        if (companyId === findCategory[0].company.id) {
          await this.categorysRepository.delete(id);
          return {
            status: 200,
            message: 'A categoria foi deletada com sucesso!',
          };
        } else {
          return {
            status: 400,
            message:
              'A empresa informada não tem permissão para remover essa categoria.',
          };
        }
      } else {
        return {
          status: 400,
          message: 'Categoria não encontrada!',
        };
      }
    } catch (error) {
      return {
        status: 500,
        message:
          'Devido a um erro interno não foi possível deletar a categoria',
      };
    }
  }
}
