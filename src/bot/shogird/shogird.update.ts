import { Ctx, Hears, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { Shogird } from "../schema/shogird.schema";
import { ShogirdService } from "./shogird.service";

@Update()
export class ShogirdUpdate {
  constructor(private readonly ustozService: ShogirdService) {}

  @Hears("Shogird")
  async hearsUstoz(@Ctx() ctx: Context) {
    await this.ustozService.ShogirdMenu(ctx);
  }

  @Hears("Mening malumotlarim")
  async Ustozmalumoti(@Ctx() ctx: Context) {
    await this.ustozService.ShogirdDate(ctx);
  }

  // @Hears("Ustozlar menyusi")
  // async Ustoz(@Ctx() ctx: Context) {
  //   await this.ustozService.UstozMenu(ctx);
  // }

  // @Hears("Ustozlarni tasdiqlash")
  // async UstozlarniTasdiqlash(@Ctx() ctx: Context) {
  //   await this.ustozService.UstozlarniTasdiqlash(ctx);
  // }
}
