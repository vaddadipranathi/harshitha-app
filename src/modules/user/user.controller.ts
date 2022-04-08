/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, Res  } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Response, Request, response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   *
   * @param userDto accepts objects of adduserDto
   * @returns user object , if user is added Successfully
   */
  @Post('/addUser')
  addUserDetails(@Body() userDto: UserDto): Promise<string> {
    return this.userService.addUserDetails(userDto);
  }

  @Post('/login')
  login(@Body() userDto: UserDto,@Res({ passthrough: true }) response: Response,
  @Req() request: Request,) {
    return this.userService.login(userDto, response, request);
  }
}