import { UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { Command, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from "telegraf";
import { AdminGuard } from '../common/guard/admin.guard';


@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @UseGuards(AdminGuard)
  @Command("admin")
  async admin(@Ctx() ctx: Context) {
    await this.botService.adminMenu(ctx);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @Hears("Asosiy menu")
  async mainMenu(@Ctx() ctx: Context) {
    await this.botService.mainMenu(ctx);
  }

  @Hears("oxirgi 1 kun")
  async oxirgi1kun(@Ctx() ctx: Context) {
    await this.botService.oxirgi1kun(ctx);
  }

  @Hears("oxirgi 7 kun")
  async oxirgi7kun(@Ctx() ctx: Context) {
    await this.botService.oxirgi7kun(ctx);
  }

  @Hears("oxirgi 30 kun")
  async oxirgi30kun(@Ctx() ctx: Context) {
    await this.botService.oxirgi30kun(ctx);
  }

  @Hears("oxirgi 1 yil")
  async oxirgi1yil(@Ctx() ctx: Context) {
    await this.botService.oxirgi1yil(ctx);
  }

  @Hears("Hatmlar")
  async hatmlar(@Ctx() ctx: Context) {
    await this.botService.hatimlar(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);
  }

  @On("photo")
  async onPhoto(@Ctx() ctx: Context) {
    await this.botService.onPhoto(ctx);
  }

  @On("text")
  async message(@Ctx() ctx: Context) {
    await this.botService.onMessage(ctx);
  }
}
