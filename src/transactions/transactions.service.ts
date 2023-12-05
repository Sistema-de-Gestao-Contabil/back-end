import { Injectable } from '@nestjs/common';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity'
import { Repository } from 'typeorm';
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
  ) { }

  async create(createTransactioDto: CreateTransactioDto) {
    try {
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
        where: {
          id: createTransactioDto.companyId
        }
      })
  
      if (!findCategory) {
        return{
          status: 400,
          message: 'Categoria não encontrada'
        }
      }
  
      if (!findCompany) {
        return{
          status: 400,
          message: 'Empresa não encontrada'
        }
      }
  
      //Associando a categoria a transação
      addTransaction.category = findCategory
  
      //Associando a empresa a transação
      addTransaction.company = findCompany
  
      const result = await this.transactionsRepository.save(addTransaction)
      return {
        status: 201,
        result
      }
      
    } catch (error) {
      console.error(error);
      return{
        status: 500,
        message: 'Devido a um erro interno não possível realizar o cadastro da transação'
      }
      
    }
  }

  //Buscando todas as transações
  async findAll(resquest: Request) {
    try {
      const { valueFilter, statusFilter, dateFilter, typeFilter, companyId } = resquest.query
      const query = this.transactionsRepository.createQueryBuilder('transaction')
      .select('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.company', 'company')
      .where('transaction.companyId = :companyId', {companyId})

      if (typeFilter) {
        query.where('transaction.type = :typeFilter', { typeFilter })
      }

      if (valueFilter) {

        //filtrando pelos valores mais altos
        if (valueFilter === 'alto') {
          query.orderBy('value', 'DESC')
        }

        //filtrando pelos valores mais baixos
        else {
          query.orderBy('value', 'ASC')
        }
      }

      //filtrando por pago e não pago
      if (statusFilter) {
        query.where('transaction.status = :statusFilter', { statusFilter })
      }

      if (dateFilter) {

        //filtrando pelas datas mais recente
        if (dateFilter == 'recente') {
          query.orderBy('date', 'DESC')
        }

        //filtrando pelas datas mais antiga
        else {
          query.orderBy('date', 'ASC')
        }
      }

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
    try {
      const result = await this.transactionsRepository.createQueryBuilder('transaction')
      .select('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.company', 'company')
      .where('transaction.id = :id', {id})
      .getOne()

      if (!result?.id) {
        return {
          status: 404,
          massage: 'Transação não encontrada'
        }
      }

      return {
        status: 200,
        result
      }

    } catch (error) {
      return {
        status: 500,
        massage: 'Devido a um erro interno não foi possível realizar a busca'
      }
    }
  }

  async update(updateTransactioDto: UpdateTransactioDto, request: Request) {
    try {
      const id = Number(request.query.id)
      const companyId = Number(request.query.companyId)
      const findTransaction = await this.transactionsRepository.find({
        where:{
          id: id
        }
      })

      if(findTransaction.length > 0){
        if(companyId === findTransaction[0].companyId){
          await this.transactionsRepository.update(id, updateTransactioDto)
          return{
            status:200,
            message: 'Transação atualizada com sucesso.'
          }
        }

        else{
          return{
            status: 400,
            message: 'Esta empresa não tem permissão para alterar essa transação.'
          }
        }
      }

      else{
        return{
          status: 400,
          message: 'Transação não encontrada.'
        }
      }
    } catch (error) {
      console.error(error)
      return{
        status: 500,
        message: 'Devido a um erro interno não foi possível alterar a transação.'
      }
    }
  }

  async remove(id: number) {
    try {
      const findTransaction = await this.transactionsRepository.find({
        where:{
          id
        }
      })

      if(findTransaction.length > 0){
        await this.transactionsRepository.delete(id)
        return {
          status:200,
          message: 'A transação foi removida com sucesso.'
        }
      }

      else{
        return {
          status: 400,
          message: 'Transação não encontrada.'
        }
      }
    } catch (error) {
      console.error(error)
      return{
        status: 500,
        message: 'Devido a um erro interno não foi possível remover a transação.'
      }
    }
  }
}
