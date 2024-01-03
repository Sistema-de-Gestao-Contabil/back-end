import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactioDto } from './dto/create-transactio.dto';
import { UpdateTransactioDto } from './dto/update-transactio.dto';
import { Response, Request } from 'express';

@Controller('transactions')
export class TransactiosController {
  constructor(private readonly transactiosService: TransactionsService) {}

  @Post()
  async create(
    @Res() response: Response,
    @Body() createTransactioDto: CreateTransactioDto,
  ) {
    const result = await this.transactiosService.create(createTransactioDto);

    return response.status(result.status).json(result);
  }

  @Get()
  async findAll(@Res() response: Response, @Req() request: Request) {
    const result = await this.transactiosService.findAll(request);
    return response.status(result.status).json(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const result = await this.transactiosService.findOne(+id);
    return response.status(result.status).json(result);
  }

  @Patch()
  async update(
    @Body() updateTransactioDto: UpdateTransactioDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const result = await this.transactiosService.update(
      updateTransactioDto,
      request,
    );
    return response.status(result.status).json(result);
  }

  @Delete('')
  async remove(@Res() response: Response, @Req() request: Request) {
    const result = await this.transactiosService.remove(request);
    return response.status(result.status).json(result);
  }

  @Get('graphic-data/:id')
  async graphicData(@Param('id') id: string) {
    return await this.transactiosService.graphicData(+id);
  }

  @Get('generate-pdf/:companyId')
  async generatePdf(
    @Res() res: Response,
    @Req() req: Request,
    @Param('companyId') companyId: string,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.transactiosService.generatePdfFromHtml(
        +companyId,
        req,
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.status(200).end(pdfBuffer, 'binary');
    } catch (error) {
      res.status(error.status).send(error);
      // console.error('Erro ao gerar PDF:', error);
      // res.status(500).send('Erro ao gerar PDF');
    }
  }
}
