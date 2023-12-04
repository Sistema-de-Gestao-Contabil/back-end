import { HttpException, Injectable } from '@nestjs/common';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {Transaction} from '../entities/transaction.entity'
import { DataSource, Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { Company } from 'src/entities/company.entity';
import { Request } from 'express';

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

  //Buscando todas as transações
  async findAll(resquest: Request) {

    const {valueFilter, statusFilter, dateFilter, typeFilter} = resquest.query
    const query =  this.transactionsRepository.createQueryBuilder('transaction')
    .select('transaction')
    .leftJoinAndSelect('transaction.category', 'category')
    .leftJoinAndSelect('transaction.company', 'company')

    if(typeFilter){
      query.where('transaction.type = :typeFilter', {typeFilter})
    }

    if(valueFilter){

      //filtrando pelos valores mais altos
      if(valueFilter === 'alto'){
        query.orderBy('value', 'DESC')
      }

      //filtrando pelos valores mais baixos
      else{
        query.orderBy('value', 'ASC')
      }
    }

    //filtrando por pago e não pago
    if(statusFilter){
      query.where('transaction.status = :statusFilter', {statusFilter})
    }

    if(dateFilter){

      //filtrando pelas datas mais recente
      if(dateFilter == 'recente'){
        query.orderBy('date', 'DESC')
      }

      //filtrando pelas datas mais antiga
      else{
        query.orderBy('date', 'ASC')
      }
    }

    try {
      const result = await query.getMany(); // Executa a consulta e obtém os resultados
      return {
        result,
        status: 200
      }; // Retorna os resultados como resposta JSON

    } catch (error) {
      console.error('Erro na execução da consulta:', error.message);

      return {
        status: 500,
        massage: 'Devido a um erro interno não foi possível realizar as buscas'
      }
    }
  }

  async findOne(id: number) {
    const result = await this.transactionsRepository.find({
      where:{
        id
      }
    });

    if(result.length == 0){
      return{
        status: 404,
        massage: 'Transação não encontrada'
      }
    }

    try {
      return {
        status: 200,
        result
      }

    } catch (error) {
      return{
        status: 500,
        massage: 'Devido a um erro interno não foi possível realizar a busca'
      }
    }
  }

  async update(id: number, updateTransactioDto: UpdateTransactioDto) {
    return `This action updates a #${id} transactio`;
  }

  async remove(id: number) {
    return `This action removes a #${id} transactio`;
  }
}
