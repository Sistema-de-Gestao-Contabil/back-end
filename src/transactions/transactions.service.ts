import { Injectable } from '@nestjs/common';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Transaction} from '../entities/transaction.entity'
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private categorysRepository: Repository<Category>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ){}

  async create(createTransactioDto: CreateTransactioDto) {
    console.log(createTransactioDto.value);
    
    const addTransaction = this.transactionsRepository.create({
      value: createTransactioDto.value,
      description: createTransactioDto.description,
      date: createTransactioDto.date,
      type: createTransactioDto.type,
      status: createTransactioDto.status
    })

    //Buscando a categoria pelo id indicado pela requisição
    const findCategory = await this.categorysRepository.findOne({
      where: {
        id: createTransactioDto.categoryId
      }
    })

    //Buscando a empresa pelo id indicado pela requisição
    const findCompany = await this.companyRepository.findOne({
      where:{
        id: createTransactioDto.companyId
      }
    })

    if(!findCategory){
      throw new Error('Categoria não encontrada')
    }

    if(!findCompany){
      throw new Error('Empresa não encontrada')
    }

    //Associando a categoria a transação
    addTransaction.category = findCategory

    //Associando a empresa a transação
    addTransaction.company = findCompany

    return await this.transactionsRepository.save(addTransaction)
  }

  async findAll() {
    return this.transactionsRepository.find()
  }

  async findOne(id: number) {
    return `This action returns a #${id} transactio`;
  }

  async update(id: number, updateTransactioDto: UpdateTransactioDto) {
    return `This action updates a #${id} transactio`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transactio`;
  }
}
