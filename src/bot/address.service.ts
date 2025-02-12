import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Ctx, InjectBot, On } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.constants';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';
import { Cars } from './models/cars.model';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Cars) private readonly carsModel: typeof Cars,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  async onAddress(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi manzillari: `, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['Mening manzillarim!', "Yangi manzil qo'shish!"],
        ]).resize(),
      });
    } catch (error) {
      console.log('OnAddressError: ', error);
    }
  }

  async onCars(ctx: Context) {
    try {
      await ctx.reply(`Foydalanuvchi mashinalari: `, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['Mening mashinalarim!', "Yangi mashina qo'shish!"],
        ]).resize(),
      });
    } catch (error) {
      console.log('OnCarsError: ', error);
    }
  }

  async onClickLocationAddress(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!['data'];
      const addressId = contextAction.split('_')[1];
      const address = await this.addressModel.findByPk(addressId);
      await ctx.replyWithLocation(
        Number(address?.location?.split(',')[0]),
        Number(address?.location?.split(',')[1]),
      );
    } catch (error) {
      console.log('onClickLocationError: ', error);
    }
  }

  async onClickDeleteLocationAddress(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!['data'];
      const addressId = contextAction.split('_')[1];
      const address = await this.addressModel.findByPk(addressId);
      const deletedAddress = await this.addressModel.destroy({
        where: { id: addressId },
      });
      await ctx.replyWithLocation(
        Number(address?.location?.split(',')[0]),
        Number(address?.location?.split(',')[1]),
      );
      await ctx.reply("ushbu yuqoridagi locatsiya o'chirildi!");
    } catch (error) {
      console.log('onClickLocationError: ', error);
    }
  }

  async onCommandNewAddress(ctx: Context) {
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']]).resize(),
        });
      } else {
        await this.addressModel.create({ user_id, last_state: 'name' });
        const onCommandNewAddress = await ctx.reply(
          `Yangi manzilingiz nomini kiriting (masalan, address:<i>uyim</i>): `,
          {
            parse_mode: 'HTML',
            ...Markup.removeKeyboard(),
          },
        );
        console.log('onCommandNewAddress: ', onCommandNewAddress);
      }
    } catch (error) {
      console.log('onCommandNewAddressError: ', error);
    }
  }

  async onCommandMyAddresses(ctx: Context) {
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']]).resize(),
        });
      } else {
        const addresses = await this.addressModel.findAll({
          where: { user_id, last_state: 'finish' },
        });
        addresses.forEach(async (address) => {
          await ctx.replyWithHTML(
            `<b>Manzil nomi: </b> ${address.name}\n<b>Manzil:</b> ${address.address}\n`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Locatsiyani ko'rish",
                      callback_data: `loc_${address.id}`,
                    },
                    {
                      text: "Locatsiyani o'chirish",
                      callback_data: `del_${address.id}`,
                    },
                  ],
                ],
              },
            },
          );
        });
      }
    } catch (error) {
      console.log('onCommandMyAddressesError: ', error);
    }
  }

  ////Cars

  async onCommandNewCars(ctx: Context) {
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']]).resize(),
        });
      } else {
        await this.carsModel.create({ user_id, last_state: 'name' });
        const onCommandNewCars = await ctx.reply(
          `Yangi mashinangiz nomini kiriting (masalan, <i>nexia2</i>): `,
          {
            parse_mode: 'HTML',
            ...Markup.removeKeyboard(),
          },
        );
      }
    } catch (error) {
      console.log('onCommandNewCarsError: ', error);
    }
  }

  async onCommandMyCars(ctx: Context) {
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']]).resize(),
        });
      } else {
        const carss = await this.carsModel.findAll({
          where: { user_id, last_state: 'finish' },
        });
        carss.forEach(async (cars) => {
          await ctx.replyWithHTML(
            `<b>Mashina nomi: </b> ${cars.name}\n<b>raqami:</b> ${cars.number}\n`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Mashina rasmini ko'rish",
                      callback_data: `car_${cars.id}`,
                    },
                    {
                      text: "Mashinani o'chirish",
                      callback_data: `cardel_${cars.id}`,
                    },
                  ],
                ],
              },
            },
          );
        });
      }
    } catch (error) {
      console.log('onCommandMyCarsError: ', error);
    }
  }

  async onClickCars(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!['data'];
      const carsId = contextAction.split('_')[1];
      console.log(carsId);
      const cars = await this.carsModel.findByPk(carsId);
      await ctx.replyWithPhoto(String(cars?.image));
    } catch (error) {
      console.log('onClickCarsError: ', error);
    }
  }

  async onClickDeleteCars(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!['data'];
      const carsId = contextAction.split('_')[1];
      const cars = await this.carsModel.findByPk(carsId);
      const deletedCar = await this.carsModel.destroy({
        where: { id: carsId },
      });
      await ctx.replyWithPhoto(String(cars?.image))
      await ctx.reply("ushbu yuqoridagi locatsiya o'chirildi!");
    } catch (error) {
      console.log('onClickCarsError: ', error);
    }
  }
}
