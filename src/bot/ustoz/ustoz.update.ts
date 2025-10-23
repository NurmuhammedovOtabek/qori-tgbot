import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from "telegraf";
import { UstozService } from './ustoz.service';


@Update()
export class UstozUpdate {
  constructor(private readonly ustozService: UstozService) {}

  @Hears("Ustoz")
  async hearsUstoz(@Ctx() ctx: Context) {
    await this.ustozService.UstozMenu(ctx);
  }

}
