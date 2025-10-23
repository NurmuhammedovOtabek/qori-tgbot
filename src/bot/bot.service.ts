import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "./schema/bot.schema";
import { Model } from "mongoose";
import { Ustoz } from "./schema/ustoz.schema";
import { UstozService } from "./ustoz/ustoz.service";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    @InjectModel(Ustoz.name) private readonly ustozModel: Model<Ustoz>,
    private readonly ustozService:UstozService
  ) {}

  async start(ctx: Context) {
    try {
      await this.mainMenu(
        ctx,
        "🌙 Assalomu alaykum! 🌙\n🤖 Botimizga xush kelibsiz!\n\n📖 Bu bot orqali:\n✨ Yurtimizda nechta hatm qilinganini bilib olasiz.\n🕋 O‘zingiz qilgan hatmlarni yozib qo‘yishingiz mumkin.\n👨‍🏫 Shuningdek, Ustoz yoki Shogird sifatida ro‘yxatdan o‘tishingiz mumkin.\n\n🕌 Alloh barchamizdan rozi bo‘lsin! 🤲"
      );
    } catch (error) {
      console.log(error);
    }
  }

  async mainMenu(ctx: Context, menuText = "Asosiy menusi") {
    try {
      await ctx.replyWithHTML(menuText, {
        ...Markup.keyboard([["Ustoz"], ["Shogird"]]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from!.id;
        const user = await this.ustozModel.findOne({ user_id });
        if (!user) {
          this.mainMenu(ctx)
          
        } else if (ctx.message.contact.user_id != user_id) {
          await ctx.replyWithHTML(
            "O'zingizni telefoni raqaminginzni jonating",
            {
              ...Markup.keyboard([
                [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
              ])
                .oneTime()
                .resize(),
            }
          );
        } else {
          const phone = ctx.message.contact.phone_number;
          user.is_active = true;
          user.phone_number = phone[0] == "+" ? phone : "+" + phone;
          user.last_state = "serifikat";
          await user.save();
          await ctx.replyWithHTML("Sertifikatingizni rasmini kriting",{
            ...Markup.removeKeyboard()
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onPhoto(ctx: Context) {
    try {
      if ("photo" in ctx.message!) {        
        const user_id = ctx.from?.id;
        const user = await this.ustozModel.findOne({user_id});
        
        if (!user) {
          this.mainMenu(ctx)
        } else {

          const ustoz = await this.ustozModel
            .findOne({ user_id, last_state: "serifikat" })
            .sort({ _id: -1 });
          if (ustoz) {
            const GROUP_ID = process.env.CHAT_ID;
            console.log(GROUP_ID);
            const photo = ctx.message.photo.pop();
            const fileId = photo?.file_id;
            const sent = await ctx.telegram.sendPhoto(GROUP_ID!, fileId!, {
              caption: `👨‍🏫 <b>Ustoz:</b> ${ustoz.full_name}\n🆔 <b>ID:</b> <code>${user_id}</code>`,
              parse_mode:"HTML"
            });
            const storedFileId = sent.photo.pop()?.file_id;

            ustoz.serifikat = storedFileId!;
            ustoz.last_state = "finish";
            await ustoz.save();
            await this.ustozService.UstozMenu(ctx);
          }
        }
      }
    } catch (error) {
      console.log("Error on text", error);
    }
  }
}
