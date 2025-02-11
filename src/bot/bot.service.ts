import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { Ctx, InjectBot, On } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.constants';
import { Context, Markup, Telegraf } from 'telegraf';
import { Address } from './models/address.model';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
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
          if(address && address.last_state !== "finish"){
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
            address.last_state = "location";
            await address.save()
            await ctx.reply('Manzilingizni lokatsiyasini yuboring: ', {
              parse_mode: 'HTML',
              ...Markup.keyboard([
                [Markup.button.locationRequest('lokatsiyangizni yuboring')],
              ]).resize(),
            });
            }
          }
        }
      }
    } catch (error) {
      console.log('onTextError: ', error);
    }
  }
}
