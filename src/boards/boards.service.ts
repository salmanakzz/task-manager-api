import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board, BoardDocument } from './entities/board.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  // ✅ Create a new board
  async create(userId: string, dto: CreateBoardDto): Promise<Board> {
    const board = new this.boardModel({
      ...dto,
      owner: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)],
    });
    return board.save();
  }

  // ✅ Get all boards for a user (where they're a member)
  async findAllByUser(userId: string): Promise<Board[]> {
    return this.boardModel.find({ members: userId }).exec();
  }

  // ✅ Get single board by ID (and ensure user is a member)
  async findOne(userId: string, boardId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) throw new NotFoundException('Board not found');

    const isMember = board.members.some((m) => m.toString() === userId);
    if (!isMember) throw new ForbiddenException('Access denied');

    return board;
  }

  // ✅ Update board (only if user is the owner)
  async update(
    userId: string,
    boardId: string,
    dto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    if (board.owner.toString() !== userId)
      throw new ForbiddenException('Only board owner can update');

    Object.assign(board, dto);
    return board.save();
  }

  // ✅ Delete board (only if user is the owner)
  async remove(userId: string, boardId: string): Promise<void> {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found');

    if (board.owner.toString() !== userId)
      throw new ForbiddenException('Only board owner can delete');

    await board.deleteOne();
  }
}
