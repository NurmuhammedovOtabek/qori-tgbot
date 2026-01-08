import { Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { Shogird } from "../schema/shogird.schema";
import { ShogirdService } from "./shogird.service";

@Update()
export class ShogirdUpdate {
  constructor(private readonly shogirdService: ShogirdService) {}

  @Hears("Shogird")
  async shogird(@Ctx() ctx: Context) {
    await this.shogirdService.ShogirdMenu(ctx);
  }

  @Hears("Shogirdlar menusi")
  async hearsshogird(@Ctx() ctx: Context) {
    await this.shogirdService.ShogirdMenu(ctx);
  }

  @Hears("Mening malumotlarim👈")
  async shogirdmalumoti(@Ctx() ctx: Context) {
    await this.shogirdService.ShogirdDate(ctx);
  }

  @Hears("Ustozim")
  async Ustoz(@Ctx() ctx: Context) {
    await this.shogirdService.ustoz(ctx);
  }

  @Hears("Hatm qildim 📖")
  async UstozlarniTasdiqlash(@Ctx() ctx: Context) {
    await this.shogirdService.hatim(ctx);
  }
}
