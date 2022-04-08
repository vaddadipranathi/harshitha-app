/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtTokenService } from 'src/config/providers/jwtService.service';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Response, Request, response } from 'express';
import { globalAccess } from 'src/config/constants/globalAccess';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtToken: JwtTokenService,
    private jwtService: JwtService,

  ) { }

  /**
*
* @param userDto accepts objects of adduserDto
* @returns user object , if user is added Successfully
*/
  async addUserDetails(userDto: UserDto): Promise<string> {
    const user: User = new User();
    Object.assign(user, userDto);
    user.display_name = userDto.userName;
    const date = new Date();
    user.created_date = date.toLocaleDateString();
    user.updated_date = date.toLocaleTimeString();
    await this.userRepository.save(user);
    return "user added Successfully";
  }

  async login(userDto: UserDto, response: Response, req: Request) {
    const user = await this.userLogin(userDto.userName);
    console.log(user);
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(userDto.password, user.password))) {
      throw new BadRequestException('invalid ');
    }
    const jwt = await this.jwtToken.generateToken(user);
    response.cookie('jwt', jwt, { httpOnly: true });
    globalAccess.role = user.role;
    console.log('globcal: ', user.role);
    const cookie = req.cookies['jwt'];
    const result = await this.jwtToken.verifyToken(cookie);
    return result;
  }

  async userLogin(userName: string) {
    return await this.userRepository.findOne({ where: { userName: userName } });
  }
}