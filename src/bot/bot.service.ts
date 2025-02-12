import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Ctx, InjectBot, On } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.constants';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';
import { Cars } from './models/cars.model';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Cars) private readonly carsModel: typeof Cars,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from?.id;
    const user = await this.botModel.findByPk(user_id);
    console.log(ctx.message);
    console.log('user: ', user);
    if (!user) {
      await this.botModel.create({
        user_id,
        username: ctx.from?.username,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        lang: ctx.from?.language_code,
      });
      await ctx.reply(
        `Iltimos, <b>Telefon raqamni yuborish</b> tugmasini bosing`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Telefon raqamni yuborish')],
          ])
            .resize()
            .oneTime(),
        },
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos, <b>Telefon raqamni yuborish</b> tugmasini bosing`,
        {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Telefon raqamni yuborish')],
          ])
            .resize()
            .oneTime(),
        },
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id!, 'typing');
      await ctx.reply(
        `Ushbu bot Chegirmachi foydalanuvchilarini faollashtirish uchun ishlatiladi`,
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    try {
      if ('contact' in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.reply(`Iltimos, <b>Start</b> tugmasini bosing`, {
            parse_mode: 'HTML',
            ...Markup.keyboard([['/start']])
              .resize()
              .oneTime(),
          });
        } else if (ctx.message!.contact.user_id != user_id) {
          await ctx.reply(`Iltimos, o'zingizni telefon raqamingizni yuboring`, {
            parse_mode: 'HTML',
            ...Markup.keyboard([
              [Markup.button.contactRequest('Telefon raqamni yuborish')],
            ])
              .resize()
              .oneTime(),
          });
        } else {
          user.phone_number = ctx.message.contact.phone_number;
          user.status = true;
          await user.save();
          await ctx.reply(
            `Tabriklayman, sizning akkauntingiz faollashtirildi.`,
            {
              parse_mode: 'HTML',
              ...Markup.removeKeyboard(),
            },
          );
        }
      }
    } catch (error) {
      console.log('OnContactError: ', error);
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (user && user.status) {
        user.status = false;
        user.phone_number = '';
        await user.save();
        await ctx.reply(`Sizni yana kutib qolamiz!`, {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log('OnStopError: ', error);
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ('location' in ctx.message!) {
        const user_id = await ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: 'HTML',
            ...Markup.keyboard([['/start']]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [['id', 'DESC']],
          });
          if (address && address.last_state == 'location') {
            console.log('salom');
            address.location = `${ctx.message.location.latitude}, ${ctx.message.location.longitude}`;
            address.last_state = 'finish';
            await address.save();
            await ctx.reply('siznig manzilingiz saqlandi', {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                ['Mening manzillarim!', "Yangi manzil qo'shish!"],
              ]).resize(),
            });
          }
        }
      }
    } catch (error) {
      console.log('OnLocationError: ', error);
    }
  }

  async onPhoto(ctx: Context) {
    try {
      if ('photo' in ctx.message!) {
        const user_id = await ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: 'HTML',
            ...Markup.keyboard([['/start']]).resize(),
          });
        } else {
          await ctx.reply('hozir0');

          const cars = await this.carsModel.findOne({
            where: { user_id },
            order: [['id', 'DESC']],
          });
          if (cars && cars.last_state == 'image') {
            if ('photo' in ctx.message!) {
              cars.image = String(ctx.message.photo);
              cars.last_state = 'finish';
              await cars.save();
              await ctx.reply('siznig avtomobilingiz saqlandi', {
                parse_mode: 'HTML',
                ...Markup.keyboard([
                  ['Mening mashinalarim!', "Yangi mashina qo'shish!"],
                ]).resize(),
              });
            } else {
              await ctx.reply('hozir');
            }
          } else {
            await ctx.reply('hozir2');
          }
        }
      }
    } catch (error) {
      console.log('OnLocationError: ', error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ('text' in ctx.message!) {
        const user_id = await ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
            parse_mode: 'HTML',
            ...Markup.keyboard([['/start']]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [['id', 'DESC']],
          });
          if (address && address.last_state !== 'finish') {
            if (address.last_state == 'name') {
              address.name = ctx.message.text;
              address.last_state = 'address';
              await address.save();
              await ctx.reply('Manzilingizni kiriting: ', {
                parse_mode: 'HTML',
                ...Markup.removeKeyboard(),
              });
            } else if (address.last_state == 'address') {
              address.address = ctx.message.text;
              address.last_state = 'location';
              await address.save();
              await ctx.reply('Manzilingizni lokatsiyasini yuboring: ', {
                parse_mode: 'HTML',
                ...Markup.keyboard([
                  [Markup.button.locationRequest('lokatsiyangizni yuboring')],
                ]).resize(),
              });
            }
          }

          const cars = await this.carsModel.findOne({
            where: { user_id },
            order: [['id', 'DESC']],
          });
          if (cars && cars.last_state !== 'finish') {
            if (cars && cars.last_state == 'name') {
              cars.name = ctx.message.text;
              cars.last_state = 'brand';
              await cars.save();
              await ctx.reply(
                'Mashinangiz brandini kiriting masalan:(Chevrolet): ',
                {
                  parse_mode: 'HTML',
                  ...Markup.removeKeyboard(),
                },
              );
            } else if (cars?.last_state == 'brand') {
              cars.brand = ctx.message.text;
              cars.last_state = 'number';
              await cars.save();
              await ctx.reply(
                'Mashinangiz numberini yuboring masalan:(01A000AA) ',
                {
                  parse_mode: 'HTML',
                  ...Markup.removeKeyboard(),
                },
              );
            } else if (cars?.last_state == 'number') {
              console.log('rasm');
              const regex =
                /^\d{2} (?:[A-Z] \d{3} [A-Z]{2}|\d{3} [A-Z]{3}|\d{4} [A-Z]{2})$/;

              if (regex.test(String(ctx.message.text).trim())) {
                try {
                  cars.number = String(ctx.message.text).trim();
                  cars.last_state = 'image';
                  await cars.save();

                  await ctx.reply('🚗 Mashinangiz rasmini yuboring:', {
                    parse_mode: 'HTML',
                    ...Markup.removeKeyboard(),
                  });
                } catch (error) {
                  console.error('❌ Xatolik:', error);
                  await ctx.reply(
                    '❌ Ma’lumot saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring!',
                  );
                }
              } else {
                await ctx.reply(
                  '❌ Siz noto‘g‘ri formatda raqam yubordingiz! ❌\n\n⏳ Iltimos, quyidagi formatda kiriting:\n- `10 A 123 AB`\n- `10 123 ABC`\n- `10 1234 AB`',
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('onTextError: ', error);
    }
  }

  async sendOtp(phone_number: string, OTP: string): Promise<Boolean | undefined> {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      if (!user || !user.status) {
        return false;
      }
      await this.bot.telegram.sendMessage(
        user.user_id!,
        `Verification Otp code: ${OTP}`,
      );
       return true
    } catch (error) {
      console.log('send otp error: ', error);
    }
  }
}
