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

  @Hears("Mening malumotlarim")
  async Ustozmalumoti(@Ctx() ctx: Context) {
    await this.ustozService.UstozDate(ctx);
  }

  @Hears("Ustozlar menyusi")
  async Ustoz(@Ctx() ctx: Context) {
    await this.ustozService.UstozMenu(ctx);
  }

  @Hears("Ustozlarni tasdiqlash")
  async UstozlarniTasdiqlash(@Ctx() ctx: Context) {
    await this.ustozService.UstozlarniTasdiqlash(ctx);
  }

  @Hears("Hatm qildim")
  async Hatm(@Ctx() ctx: Context) {
    console.log("aaa");
    
    await this.ustozService.hatim(ctx);
  }
}
