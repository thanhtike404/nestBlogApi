import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service'; 
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
        const { email, password, ...restOfDto } = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
          const existingUser = await this.prisma.user.findUnique({
            where:{
              email:email
            }
          })
           if(existingUser){
            throw new ConflictException('User with this email already exists');
          }
          try {
            const newUser=await  this.prisma.user.create({
              data:{
                    email,
                    passwordHash:hashedPassword,
                    ...restOfDto
                  }})
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { passwordHash, ...result } = newUser;
                return result;
          } catch (error) {
                    throw new InternalServerErrorException('An unexpected error occurred.');
          }
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`; 
  }
}
