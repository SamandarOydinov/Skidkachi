import { repl } from '@nestjs/core';
import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { BotService } from './bot.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from '../filters/telegraf-exception.filter';
import { AdminGuard } from '../guards/admin.guard';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  // @UseFilters(TelegrafExceptionFilter)
  // @UseGuards(AdminGuard)
  // @Command('admin')
  // async onAdminCommand(@Ctx() ctx: Context) {
  //   await this.botService.admin_menu(ctx, `Xush kelibsiz, ADMIN 🍴`);
  // }

  // @Action('Mijozlar')
  // async onMijoz(@Ctx() ctx: Context){
  //   // await this.botService.admin_menu(ctx)
  // }


  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @Command('stop')
  async onStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }

  @On('location')
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    await this.botService.onPhoto(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  // @On('message')
  // async onMessage(@Ctx() ctx: Context) {
  //   await this.botService.onText(ctx);
  // }
}
//  @On("contact")
//  async onStart(@Ctx() ctx: Context) {
//     await this.botService.start(ctx);
//   }


//   @On("document")
//   async onDocument(@Ctx() ctx: Context) {
//     if ("document" in ctx.message!) {
//       console.log(ctx.message.document);
//       await ctx.replyWithHTML(String(ctx.message.document.file_name));
//     }
//   }

//   @Hears("hi")
//   async onHears(@Ctx() ctx: Context) {
//     await ctx.replyWithHTML("salom");
//   }

//   @Command("help")
//   async onHelpCommand(@Ctx() ctx: Context) {
//     await ctx.replyWithHTML("Kutib tur");
//   }

//   @Command("inline")
//   async onInlineCommand(@Ctx() ctx: Context) {
//     const inlineKeyboard = [
//       [
//         {
//           text: "Tugma 1",
//           callback_data: "button_1",
//         },
//         {
//           text: "Tugma 2",
//           callback_data: "button_2",
//         },
//         {
//           text: "Tugma 3",
//           callback_data: "button_3",
//         },
//       ],
//       [
//         {
//           text: "Tugma 4",
//           callback_data: "button_4",
//         },
//         {
//           text: "Tugma 5",
//           callback_data: "button_5",
//         },
//       ],
//       [
//         {
//           text: "Tugma 6",
//           callback_data: "button_6",
//         },
//       ],
//     ];

//     await ctx.reply("Inline Keyboard: kerakli tugmani bosing", {
//       reply_markup: {
//         inline_keyboard: inlineKeyboard,
//       },
//     });
//   }

//   @Action("button_1")
//   async onButton_1Action(@Ctx() ctx: Context) {
//     await ctx.replyWithHTML("Button1 bosildi");
//   }

//   @Action(/^button_+[1-9]/)
//   async onButtonActionAny(@Ctx() ctx: Context) {
//     const actionText = ctx.callbackQuery!["data"];
//     const buttonId = actionText.split("_")[1];
//     console.log(actionText);

//     await ctx.replyWithHTML(`${buttonId}-button bosildi`);
//   }

//   @Command("main")
//   async onMainButton(@Ctx() ctx: Context) {
//     await ctx.replyWithHTML(`Kerakli main tugmani bos`, {
//       ...Markup.keyboard([
//         [Markup.button.contactRequest(`Telefon raqamingizni yuboring`)],
//         [Markup.button.locationRequest(`Turgan manzilingizni yuboring`)],
//         ["dori1"],
//         ["dori2", "dori3"],
//         ["dori4", "dori5", "dori6"],
//       ]),
//     });
//   }

//   // @Hears(/^dori+\d+$/)
//   // async onButtonHear(@Ctx() ctx:Context){
//   //   if("text" in ctx.message){
//   //     await ctx.replyWithHTML(`<b>`)
//   //   }

//   //   await ctx.replyWithHTML(`${ctx.text!.split["i"][1]}- bosildi`)
//   // }

//   @On("video")
//   async onVideo(@Ctx() ctx: Context) {
//     if ("video" in ctx.message!) {
//       console.log(ctx.message.video);
//       await ctx.replyWithHTML(String(ctx.message.video.duration));
//     }
//   }

//   @On("sticker")
//   async onSticker(@Ctx() ctx: Context) {
//     if ("sticker" in ctx.message!) {
//       console.log(ctx.message.sticker);
//       await ctx.replyWithHTML(String(ctx.message.sticker.emoji));
//     }
//   }

//   @On("animation")
//   async onAnimation(@Ctx() ctx: Context) {
//     if ("animation" in ctx.message!) {
//       console.log(ctx.message.animation);
//       await ctx.replyWithHTML(String(ctx.message.animation.duration));
//     }
//   }

//   @On("contact")
//   async onContact(@Ctx() ctx: Context) {
//     if ("contact" in ctx.message!) {
//       console.log(ctx.message.contact);
//       await ctx.replyWithHTML(String(ctx.message.contact.first_name));
//       await ctx.replyWithHTML(String(ctx.message.contact.last_name));
//     }
//   }

//   @On("location")
//   async onLocation(@Ctx() ctx: Context) {
//     if ("location" in ctx.message!) {
//       console.log(ctx.message.location);
//       await ctx.replyWithHTML(String(ctx.message.location.latitude));
//       await ctx.replyWithHTML(String(ctx.message.location.longitude));
//     }
//   }

//   @On("voice")
//   async onVoice(@Ctx() ctx: Context) {
//     if ("voice" in ctx.message!) {
//       console.log(ctx.message.voice);
//       await ctx.replyWithAudio(String(ctx.message.voice.duration));
//       // await ctx.replyWithHTML(String(ctx.message.voice));
//     }
//   }
// }
