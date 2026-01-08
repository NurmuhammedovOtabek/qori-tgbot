import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ustoz } from "../schema/ustoz.schema";
import { Hatm } from "../schema/hatm.schema";

@Injectable()
export class UstozService {
  constructor(
    @InjectModel(Ustoz.name) private readonly ustozModel: Model<Ustoz>,
    @InjectModel(Hatm.name) private readonly hatmModel: Model<Hatm>
  ) {}

  async UstozMenu(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.ustozModel.findOne({ user_id });
      if (!user) {
        await this.ustozModel.create({
          user_id,
          username: ctx.from!.username,
          first_name: ctx.from!.first_name,
          last_name: ctx.from!.last_name,
          language_code: ctx.from!.language_code,
          last_state: "phone_number",
        });

        await ctx.replyWithHTML(
          `iltimos,<b> telefon raqamingizni kriting</b> tugmani bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
            ])
              .oneTime()
              .resize(),
          }
        );
      } else if (!user.is_active) {
        user.last_state = "phone_number";
        await ctx.replyWithHTML(
          `iltimos,<b> telefon raqamingizni kriting</b> tugmani bosing`,
          {
            ...Markup.keyboard([
              [Markup.button.contactRequest(`telefon raqamingizni kriting`)],
            ])
              .oneTime()
              .resize(),
          }
        );
        user.save();
      } else if (user.serifikat.length == 0) {
        user.last_state = "serifikat";
        await ctx.replyWithHTML("Sertifikatingizni rasmini kriting");
        user.save();
      } else {
        await ctx.reply("Ustozlar menusi", {
          ...Markup.keyboard([
            ["Mening malumotlarim", "Shogirtlarim"],
            ["Hatm qildim", "Asosiy menu"],
          ]).resize(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async UstozDate(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.ustozModel.findOne({ user_id });
      let teacher = "Admin sizni tasdiqladi";
      if (!user?.is_teacher) {
        teacher = "Admin hali sizni tasdiqlamadi";
      }
      await ctx.replyWithPhoto(user?.serifikat!, {
        caption:
          `<b>👨‍🏫 Ustoz:</b> ${user?.first_name}\n` +
          `<b>🆔 User ID:</b> <code>${user?.user_id}</code>\n` +
          `<b>📞 Telefon:</b> ${user?.phone_number}\n` +
          `<b>🔐 Secret key:</b> <code>${user?.secret_key}</code>\n` +
          `<b>📌 Holat:</b> ${teacher}\n` +
          `<b>📌 Hatmlar Soni:</b> ${user?.hatm}`,
        parse_mode: "HTML",
        ...Markup.keyboard([["Ustozlar menyusi"]]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async UstozlarniTasdiqlash(ctx: Context) {
    ctx.reply("Ustozni tasdiqlash uchun uning id sini kriting");
  }

  async hatim(ctx: Context) {
    try {
      function xatim() {
        ctx.replyWithHTML(
          `✅ <b>Hatm muvaffaqiyatli tugallandi!</b>` +
            `🤲 <i>Alloh sizdan rozi bo‘lsin, savobingizni ziyoda qilsin.</i>`,
        );
      }
      const user_id = ctx.from?.id
      
      const ustoz = await this.ustozModel.findOne({ user_id });
      if (ustoz) {
        if(!ustoz.last_date){
          ustoz!.hatm = ustoz!.hatm + 1;
          ustoz.last_date = new Date()
          ustoz.save();
          await this.hatmModel.create({
            name: "ustoz",
            hatmDate: new Date(),
          });
          xatim()
        }else{
          const updateD = new Date(ustoz.last_date)
          const after20 = new Date(updateD.getTime() + 20 * 60 * 60 * 1000);
          if (after20 < new Date()) {
            ustoz!.hatm = ustoz!.hatm + 1;
            ustoz.last_date = new Date();
            ustoz.save();
            await this.hatmModel.create({
              name: "ustoz",
              hatmDate: new Date(),
            });
            await this.hatmModel.create({name: "ustoz", hatmDate: new Date()})
            xatim()
          } else {
            ctx.replyWithHTML(
              "Hatm qilishga hali erta 😊" +
                "Siz avvalgi hatmni tugatganingizdan beri hali 20 soat o‘tmagan." +
                "Iltimos, biroz sabr qiling va vaqt to‘liq o‘tgach yana urinib ko‘ring ⏳"
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async shogirdlarm (ctx:Context){
    try {
      
    } catch (error) {
      console.log(error);
      
    }
  }
}
