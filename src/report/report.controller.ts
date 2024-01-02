/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { Response, Request } from 'express';
const path = require('path');
const fs = require('fs');

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':companyId')
  // @Render('report-template')
  async generateMonthlyPdf(
    @Res() res: Response,
    @Req() req: Request,
    @Param('companyId') companyId: string,
  ): Promise<void> {
    try {
      const pdfBuffer = await this.reportService.generatePdfFromHtml(
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
  // <tbody>
  //     {{#each content}}
  //       <tr>
  //         <td>{{this.categoryName}}</td>
  //         <td>{{this.total}}</td>
  //       </tr>
  //     {{/each}}
  //   </tbody>
  // try {
  //   const htmlFilePath = path.join(
  //     __dirname,
  //     '../../views/report-template.hbs',
  //   ); // Caminho para o arquivo HTML
  //   const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
  //   const pdfBuffer =
  //     await this.reportService.generatePdfFromHtml(htmlContent);
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.status(200).end(pdfBuffer, 'binary');
  // } catch (error) {
  //   console.error('Erro ao gerar PDF:', error);
  //   res.status(500).send('Erro ao gerar PDF');
  // }
  // const htmlContent = '<h1>Relatorio</h1>'; // Seu conteúdo HTML aqui
  // const outputPath = path.join(__dirname, 'output.pdf');

  // await this.reportService.generatePdfFromHtml(htmlContent, outputPath);

  // res.sendFile(outputPath, () => {
  //   // Remova o arquivo temporário após o envio do arquivo
  //   fs.unlinkSync(outputPath);
  // });

  // @Render('report-template')
  // async create(@Res() res: Response) {
  //   // return this.reportService.create();
  //   const html = res.locals.renderData;
  //   const pdfStream = await this.reportService.create(html);
  //   res.setHeader('Content-Type', 'application/pdf');

  //   pdfStream.pipe(res);
  // }
  // @Render('report-template')
}
