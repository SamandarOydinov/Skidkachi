import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtCreatorGuard } from '../guards/jwt-creator.guard';
import { JwtSelfGuard } from '../guards/jwt-self.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

 @Roles('ADMIN', 'SUPERADMIN')
 @Controller('admin')
 export class AdminController {
   constructor(private readonly adminService: AdminService) {}

  //  @UseGuards(JwtCreatorGuard)
  //  @UseGuards(JwtSelfGuard)
  //  @UseGuards(JwtAuthGuard)
   @Post(':id')
   @UseInterceptors(FileInterceptor('image'))
   create(@Body() createAdminDto: CreateAdminDto, @UploadedFile() image: any) {
     console.log('image: ', image);
     return this.adminService.create(createAdminDto, image);
   }

  //  @UseGuards(RolesGuard)
  //  @Roles('SUPERADMIN')
   @Get()
   findAll() {
     return this.adminService.findAll();
   }

  //  @UseGuards(JwtSelfGuard)
  //  @UseGuards(RolesGuard)
  //  @Roles('ADMIN', 'SUPERADMIN')
   @Get(':id')
   findOne(@Param('id') id: string) {
     return this.adminService.findOne(+id);
   }

  //  @UseGuards(JwtSelfGuard)
  //  @Roles('ADMIN', 'SUPERADMIN')
  //  @UseGuards(RolesGuard)
   @Patch(':id')
   update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
     return this.adminService.update(+id, updateAdminDto);
   }

   @UseGuards(JwtSelfGuard)
   @Roles('ADMIN', 'SUPERADMIN')
   @UseGuards(RolesGuard)
   @Delete(':id')
   remove(@Param('id') id: string) {
     return this.adminService.remove(+id);
   }
a
  //  @UseGuards(JwtSelfGuard)
  //  @Roles('SUPERADMIN')
  //  @UseGuards(RolesGuard)
   @Post('creator/add')
   @UseInterceptors(FileInterceptor("image"))
   addCreator(@Body() createAdminDto: CreateAdminDto, @UploadedFile() image: any) {
     return this.adminService.addCreator(createAdminDto, image);
   }
 }
