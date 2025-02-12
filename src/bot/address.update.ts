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

  @Command('cars')
  async onCars(@Ctx() ctx: Context) {
    await this.addressService.onCars(ctx);
  }

  @Hears("Yangi manzil qo'shish!")
  async onCommandNewAddress(@Ctx() ctx: Context) {
    await this.addressService.onCommandNewAddress(ctx);
  }

  @Hears('Mening manzillarim!')
  async onCommandMyAddress(@Ctx() ctx: Context) {
    await this.addressService.onCommandMyAddresses(ctx);
  }

  @Hears("Yangi mashina qo'shish!")
  async onCommandNewCars(@Ctx() ctx: Context) {
    await this.addressService.onCommandNewCars(ctx);
  }

  @Hears('Mening mashinalarim!')
  async onCommandMyCars(@Ctx() ctx: Context) {
    await this.addressService.onCommandMyCars(ctx);
  }

  @Action(/^loc_+\d+/)
  async onClickLocationAddress(@Ctx() ctx: Context) {
    await this.addressService.onClickLocationAddress(ctx);
  }

  @Action(/^del_+\d+/)
  async onClickDeleteLocationAddress(@Ctx() ctx: Context) {
    await this.addressService.onClickDeleteLocationAddress(ctx);
  }

  @Action(/^car_+\d+/)
  async onClick(@Ctx() ctx: Context) {
    console.log("salomlar");
    await this.addressService.onClickCars(ctx);
  }

  @Action(/^cardel_+\d+/)
  async onClickDelete(@Ctx() ctx: Context) {
    await this.addressService.onClickDeleteCars(ctx);
  }
}