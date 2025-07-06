import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Request,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   * Returns the authenticated user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async createProfile(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * PATCH /users/me
   * Updates the authenticated user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user._id, updateUserDto);
  }

  /**
   * DELETE /users/me
   * Deletes the authenticated user's account
   */
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteProfile(@CurrentUser() user: JwtPayload) {
    await this.usersService.remove(user._id);
    return { message: 'Account deleted successfully' };
  }
}
