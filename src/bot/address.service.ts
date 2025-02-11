import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Ctx, InjectBot, On } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Address } from "./models/address.model";

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
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

  async onCommandNewAddress(ctx: Context){
    try {
      const user_id = await ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if(!user || !user.status){
        await ctx.reply(`Siz avval ro'yxatdan o'ting`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            ["/start"],
          ]).resize(),
        });
      } else {
        await this.addressModel.create({user_id, last_state: "name"})
        const onCommandNewAddress = await ctx.reply(`Yangi manzilingiz nomini kiriting (masalan, <i>uyim</i>): `, {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });
        console.log('onCommandNewAddress: ', onCommandNewAddress);
      }
    } catch (error) {
      console.log("onCommandNewAddressError: ", error);
    }
  }
}
