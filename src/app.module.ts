import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.model';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';
import { AdminModule } from './admin/admin.module';
import { SocialLinkModule } from './social_link/social_link.module';
import { CategoryModule } from './category/category.module';
import { DiscountTypeModule } from './discount_type/discount_type.module';
import { StoreSocialLinkModule } from './store_social_link/store_social_link.module';
import { StoreModule } from './store/store.module';
import { StoreSubscribeModule } from './store_subscribe/store_subscribe.module';
import { DiscountModule } from './discount/discount.module';
import { PhotoModule } from './photo/photo.module';
import { FavouritesModule } from './favourites/favourites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoreSubscribe } from './store_subscribe/models/store_subscribe.model';
import { Store } from './store/models/store.model';
import { Favourites } from './favourites/models/favourite.model';
import { Admin } from './admin/models/admin.model';
import { Category } from './category/models/category.model';
import { Discount } from './discount/models/discount.model';
import { DiscountType } from './discount_type/models/discount_type.model';
import { District } from './district/models/district.model';
import { Review } from './reviews/models/review.model';
import { Photo } from './photo/models/photo.model';
import { Region } from './region/models/region.model';
import { SocialLink } from './social_link/models/social_link.model';
import { StoreSocialLink } from './store_social_link/models/store_social_link.model';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { BOT_NAME } from './app.constants';
import { Address } from './bot/models/address.model';
import { Cars } from './bot/models/cars.model';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/models/otp.model';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN || '12345',
        middlewares: [],
        include: [BotModule],
      }),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        StoreSubscribe,
        Store,
        Favourites,
        Admin,
        Category,
        Discount,
        DiscountType,
        District,
        Review,
        Photo,
        Region,
        SocialLink,
        StoreSocialLink,
        Address,
        Cars,
        Otp,
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    RegionModule,
    DistrictModule,
    AdminModule,
    SocialLinkModule,
    CategoryModule,
    DiscountTypeModule,
    StoreSocialLinkModule,
    StoreModule,
    DiscountModule,
    PhotoModule,
    FavouritesModule,
    ReviewsModule,
    StoreSubscribeModule,
    BotModule,
    OtpModule,
    SmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
