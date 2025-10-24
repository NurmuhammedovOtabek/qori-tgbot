import { UseGuards } from '@nestjs/common';
import { BotService } from './bot.service';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from "telegraf";
import { AdminGuard } from '../common/guard/admin.guard';


@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @UseGuards(AdminGuard)
  @Command("admin")
  async admin(@Ctx() ctx:Context){
    await this.botService.adminMenu(ctx)
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
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
  async message(@Ctx() ctx:Context){
    await this.botService.onMessage(ctx)
  }
}
