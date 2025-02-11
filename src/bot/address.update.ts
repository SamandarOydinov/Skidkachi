import { repl } from "@nestjs/core";
import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { AddressService } from "./address.service";

@Update()
export class AddressUpdate {
  constructor(private readonly addressService: AddressService) {}

  @Command('address')
  async onAddress(@Ctx() ctx: Context) {
    await this.addressService.onAddress(ctx);
  }

  @Hears("Yangi manzil qo'shish!")
  async onCommandNewAddress(@Ctx() ctx: Context){
    await this.addressService.onCommandNewAddress(ctx)
  }
}