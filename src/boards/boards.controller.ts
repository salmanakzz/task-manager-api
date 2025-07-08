import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(user._id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.boardsService.findAllByUser(user._id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.boardsService.findOne(user._id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.update(user._id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.boardsService.remove(user._id, id);
  }
}
