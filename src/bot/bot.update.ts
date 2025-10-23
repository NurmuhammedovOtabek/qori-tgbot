import { BotService } from './bot.service';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from "telegraf";


@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

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
}
