import { Category } from './../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';

@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,

  ){}

  async create(createCategoryDto: CreateCategoryDto) {
 
    try {
      const findCategory = await this.categorysRepository.find(
        {
          where: {
            name: createCategoryDto.name
          }

        }
      )

      if (findCategory.length > 0){
        return {
          status: 400, 
          message: 'Essa categoria já foi criada!'
        }
      }

      else {
        const addCategory = this.categorysRepository.create(
          { 
            name: createCategoryDto.name,
            companyId: createCategoryDto.companyId
          }
        )
    
        const result = await this.categorysRepository.save(addCategory)
        return {
          status: 200, 
          result
        }

      }

    } catch (error) {
      return {
        status: 500, 
        message: 'Devido a um erro interno não foi possível criar a categoria.'
      }
    }
  }


  async findAll() {
    try {
      const result = await this.categorysRepository.find()
      if (result.length > 0){
        return {
          status: 200,
          result
        }
      }
      else{
        return {
          status: 400,
          message: 'Categorias não encontradas!'
        }
      }

    } catch (error) {
      return {
        status: 500,
        message: 'Devido a um erro interno não foi possível encontrar as categorias'
      }
    }
  }


  async findOne(id: number) {
    try {
      const result = await this.categorysRepository.find(
        {
          where: {
            id
          }
        }
      )
      if (result.length > 0){
        return {
          status: 200,
          result
        }
      }
      else{
        return {
          status: 400,
          message: 'Categoria não encontrada!'
        }
      }

    } catch (error) {
      return {
        status: 500,
        message: 'Devido a um erro interno não foi possível encontrar a categoria'
      }
    }
  }


 async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const findCategory = await this.categorysRepository.find(
        {
          where:{
            id
          }
        }
      )
      if (findCategory.length > 0 ){
        await this.categorysRepository.update(id, updateCategoryDto)
        return {
          status: 200,
          message: 'Categoria atualizada com sucesso!'
        }
      }
      else{
        return{
          status:400,
          message: 'Categoria não encontrada!'
        }
      }

    } catch (error) {
      return {
        status: 500,
        message: 'Devido a um erro interno não foi possível atualizar a categoria'
      }
    }  
  }


 async remove(id: number) {
    try {
      const result = await this.categorysRepository.find(
        {
          where: {
            id
          }
        }
      )
      if (result.length > 0){
        await this.categorysRepository.delete(id)
        return {
          status:200,
          message: 'A categoria foi deletada com sucesso!'
        }
      }
      else{
        return {
          status: 400,
          message: 'Categoria não encontrada!'
        }
      }

    } catch (error) {
      return {
        status: 500,
        message: 'Devido a um erro interno não foi possível deletar a categoria'
      }
    } 
  }
}
