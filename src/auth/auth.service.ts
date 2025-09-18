import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signup(signupDto: SignupDto) {

    const { email, password } = signupDto;
    const user = await this.usersService.findOne({ where: { email } });

    if (user)
      throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(signupDto);
    newUser.password = await this.hashPassword(password);
    await this.usersService.saveOne(newUser);
    const { password: _removed, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async validateUser(email: string, password: string) {

    const user = await this.usersService.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    const token = await this.createJwt({ id: user.id, userType: user.type });
    // Avoid using delete on a required property; instead, create a copy without the password
    const { password: _removed, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: number, updateAuthDto: UpdateUserDto) {
    const user = await this.usersService.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.usersService.update(id, updateAuthDto);
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createJwt(payload: Partial<JwtPayload>, time?: number): Promise<string> {
    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: time || 60 * 60 * 24,
    });
  }
}
