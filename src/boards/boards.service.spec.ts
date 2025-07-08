import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Board } from './entities/board.schema';
import { Types } from 'mongoose';

describe('BoardsService', () => {
  let service: BoardsService;
  let mockBoardModel: jest.Mock;

  beforeEach(async () => {
    mockBoardModel = jest.fn(); // mock the class constructor

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getModelToken(Board.name),
          useValue: mockBoardModel,
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a board with owner and members', async () => {
      const userId = new Types.ObjectId().toString();

      const dto = { name: 'Test Board', description: 'desc' };

      const mockSave = jest.fn().mockResolvedValue({
        _id: new Types.ObjectId(),
        ...dto,
        owner: userId,
        members: [userId],
      });

      // When `new this.boardModel(...)` is called, it returns this object
      mockBoardModel.mockImplementation(() => ({
        ...dto,
        save: mockSave,
      }));

      const board = await service.create(userId, dto);

      expect(mockBoardModel).toHaveBeenCalledWith({
        ...dto,
        owner: new Types.ObjectId(userId),
        members: [new Types.ObjectId(userId)],
      });
      expect(mockSave).toHaveBeenCalled();
      expect(board).toHaveProperty('name', dto.name);
      expect(board).toHaveProperty('owner', userId);
    });
  });

  // describe('findOne', () => {
  //   it('should return board if user is a member', async () => {
  //     const userId = new Types.ObjectId().toString();
  //     const boardId = new Types.ObjectId().toString();

  //     const board = {
  //       _id: boardId,
  //       name: 'Board 1',
  //       owner: new Types.ObjectId(),
  //       members: [userId],
  //     };

  //     model.findById.mockResolvedValue(board);

  //     const result = await service.findOne(userId, boardId);
  //     expect(result).toEqual(board);
  //   });

  //   it('should throw NotFoundException if board not found', async () => {
  //     model.findById.mockResolvedValue(null);

  //     await expect(
  //       service.findOne(new Types.ObjectId().toString(), 'invalidId'),
  //     ).rejects.toThrow(NotFoundException);
  //   });

  //   it('should throw ForbiddenException if user not member', async () => {
  //     const board = {
  //       _id: 'someId',
  //       name: 'Board 1',
  //       owner: new Types.ObjectId(),
  //       members: [new Types.ObjectId().toString()],
  //     };

  //     model.findById.mockResolvedValue(board);

  //     await expect(service.findOne('non-member-id', 'someId')).rejects.toThrow(
  //       ForbiddenException,
  //     );
  //   });
  // });

  // describe('remove', () => {
  //   it('should delete board if user is owner', async () => {
  //     const userId = new Types.ObjectId().toString();
  //     const board = {
  //       _id: '1',
  //       owner: userId,
  //       deleteOne: jest.fn(),
  //     };

  //     model.findById.mockResolvedValue(board);
  //     await service.remove(userId, '1');
  //     expect(board.deleteOne).toHaveBeenCalled();
  //   });

  //   it('should throw if user is not owner', async () => {
  //     const board = {
  //       _id: '1',
  //       owner: 'otherUser',
  //       deleteOne: jest.fn(),
  //     };

  //     model.findById.mockResolvedValue(board);

  //     await expect(service.remove('not-owner', '1')).rejects.toThrow(
  //       ForbiddenException,
  //     );
  //   });
  // });
});
