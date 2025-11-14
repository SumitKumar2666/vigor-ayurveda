import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find().select('-hash -refreshToken').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-hash -refreshToken').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>) {
    const user = new this.userModel(userData);
    return user.save();
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-hash -refreshToken')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async delete(id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken }).exec();
  }
}
