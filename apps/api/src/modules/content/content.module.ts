import { Body, Controller, Get, Module, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('content')
@Controller('content')
class ContentController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get('posts')
  posts(@Query('limit') limit = '10') {
    return this.prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: Math.min(50, Number(limit)),
    });
  }

  @Public()
  @Get('posts/:slug')
  post(@Param('slug') slug: string) {
    return this.prisma.blogPost.findUnique({ where: { slug } });
  }

  @Public()
  @Get('reviews')
  reviews() {
    return this.prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 24,
    });
  }

  @Public()
  @Get('faq')
  faq() {
    return this.prisma.faqItem.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }

  @Public()
  @Get('certificates')
  certs() {
    return this.prisma.certificate.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }

  @Public()
  @Get('instructions')
  instructions() {
    return this.prisma.instruction.findMany({
      where: { published: true },
      include: { media: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Roles('DIRECTOR')
  @Post('instructions')
  createInstruction(@Body() body: any) {
    return this.prisma.instruction.create({ data: body });
  }

  @Roles('DIRECTOR')
  @Patch('instructions/:id')
  updateInstruction(@Param('id') id: string, @Body() body: any) {
    return this.prisma.instruction.update({ where: { id }, data: body });
  }
}

@Module({ controllers: [ContentController] })
export class ContentModule {}
