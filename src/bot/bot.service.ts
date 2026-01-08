import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Bot } from "./schema/bot.schema";
import { Model } from "mongoose";
import { Ustoz } from "./schema/ustoz.schema";
import { UstozService } from "./ustoz/ustoz.service";
import { Shogird } from "./schema/shogird.schema";
import { ShogirdService } from "./shogird/shogird.service";
import { Hatm } from "./schema/hatm.schema";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot.name) private readonly botModel: Model<Bot>,
    @InjectModel(Ustoz.name) private readonly ustozModel: Model<Ustoz>,
    @InjectModel(Shogird.name) private readonly shogirdModel: Model<Shogird>,
    @InjectModel(Hatm.name) private readonly hatmdModel: Model<Hatm>,
    private readonly ustozService: UstozService,
    private readonly shogirdService: ShogirdService
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

  async mainMenu(ctx: Context, menuText = "Asosiy menu") {
    try {
      await ctx.replyWithHTML(menuText, {
        ...Markup.keyboard([["Ustoz", "Shogird"], ["Hatmlar"]]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onContact(ctx: Context) {
    try {
      if ("contact" in ctx.message!) {
        const user_id = ctx.from!.id;
        const ustoz = await this.ustozModel.findOne({ user_id });
        const shogird = await this.shogirdModel.findOne({ user_id });
        if (ustoz) {
          if (ctx.message.contact.user_id != user_id) {
            await ctx.replyWithHTML(
              "O'zingizni telefoni raqaminginzni jonating",
              {
                ...Markup.keyboard([
                  [
                    Markup.button.contactRequest(
                      `telefon raqamingizni kriting`
                    ),
                  ],
                ])
                  .oneTime()
                  .resize(),
              }
            );
          } else {
            const phone = ctx.message.contact.phone_number;
            ustoz.is_active = true;
            ustoz.phone_number = phone[0] == "+" ? phone : "+" + phone;
            ustoz.last_state = "serifikat";
            await ustoz.save();
            await ctx.replyWithHTML("Sertifikatingizni rasmini kriting", {
              ...Markup.removeKeyboard(),
            });
          }
        } else if (shogird) {
          if (ctx.message.contact.user_id != user_id) {
            await ctx.replyWithHTML(
              "O'zingizni telefoni raqaminginzni jonating",
              {
                ...Markup.keyboard([
                  [
                    Markup.button.contactRequest(
                      `telefon raqamingizni kriting`
                    ),
                  ],
                ])
                  .oneTime()
                  .resize(),
              }
            );
          } else {
            const phone = ctx.message.contact.phone_number;
            shogird.is_active = true;
            shogird.phone_number = phone[0] == "+" ? phone : "+" + phone;
            shogird.last_state = "teacher_code";
            await shogird.save();
            await ctx.replyWithHTML(
              "Ustozingizdan olgan mahfiy parolni kriting",
              {
                ...Markup.removeKeyboard(),
              }
            );
          }
        } else {
          return this.mainMenu(ctx, "Iltimos royxatdan oting");
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
        const user = await this.ustozModel.findOne({ user_id });

        if (!user) {
          this.mainMenu(ctx);
        } else {
          const ustoz = await this.ustozModel
            .findOne({ user_id, last_state: "serifikat" })
            .sort({ _id: -1 });
          if (ustoz) {
            const GROUP_ID = process.env.CHAT_ID;
            const photo = ctx.message.photo.pop();
            const fileId = photo?.file_id;
            const sent = await ctx.telegram.sendPhoto(GROUP_ID!, fileId!, {
              caption: `👨‍🏫 <b>Ustoz:</b> ${ustoz.full_name}\n🆔 <b>ID:</b> <code>${user_id}</code>`,
              parse_mode: "HTML",
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

  async adminMenu(ctx: Context) {
    ctx.replyWithHTML("Xush kelibsiz admin", {
      ...Markup.keyboard([["Ustozlar", "Shogidlar"], ["Ustozlarni tasdiqlash"]])
        .resize()
        .oneTime(),
    });
  }

  async onMessage(ctx: Context) {
    try {
      const id = ctx.from?.id;
      if (id === process.env.ADMIN) {
        if ("text" in ctx.message!) {
          const user_id = Number(ctx.message.text);
          const ustoz = await this.ustozModel.findOne({ user_id: user_id });
          if (ustoz) {
            ustoz.is_teacher = true;
            ustoz.save();
            await ctx.replyWithHTML(
              `shu id: ${ustoz.user_id} li ustoz tasdiqlandi`
            );
          } else {
            await ctx.reply("Bunday ustoz yoq");
          }
        } else {
          await ctx.replyWithHTML("Bosh matin yubormang");
        }
      }
      const shogird = await this.shogirdModel.findOne({ user_id: id });
      if (shogird) {
        if (shogird.is_active == false) {
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
        }
        if ("text" in ctx.message!) {
          const s_key = ctx.message.text;
          const ustoz_key = await this.ustozModel.findOne({
            secret_key: s_key,
            is_teacher: true,
          });
          if (ustoz_key) {
            shogird.is_student = true;
            shogird.last_state = "finish";
            shogird.teacher_id = ustoz_key.user_id;
            await shogird.save();
            await this.shogirdService.ShogirdMenu(ctx, "Royxatdan otdingiz😊");
          }
        } else {
          await ctx.replyWithHTML("Bosh matin yubormang");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async hatimlar(ctx: Context) {
    try {
      ctx.replyWithHTML("Muddatni tanglang", {
        ...Markup.keyboard([
          ["oxirgi 1 kun", "oxirgi 7 kun"],
          ["oxirgi 30 kun", "oxirgi 1 yil"],
          ["Asosiy menu"],
        ]).resize(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async oxirgi1kun(ctx: Context) {
    try {
      const ldate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const shogird = await this.hatmdModel.find({
        // name: "shogird",
        // hatmDate: { $gte: ldate },
      });
      const ustoz = await this.hatmdModel.find({
        name: "ustoz",
        hatmDate: { $gte: ldate },
      });
      console.log(ustoz);
      
      const shHatm = shogird.length;
      console.log(shHatm);
      
      const uHatm = ustoz.length;
      const jamiHatm = shHatm + uHatm;
      const message = `
      📖 *Oxirgi 1 kungi Hatmlar hisoboti*

      👨‍🏫 *Ustozlar* tomonidan bajarilgan hatmlar soni: *${uHatm} ta*
      🧑‍🎓 *Shogirdlar* tomonidan bajarilgan hatmlar soni: *${shHatm} ta*

      🌟 Umumiy jami hatmlar soni: *${jamiHatm} ta*

      Alloh barchangizning ilm yo‘lidagi harakatlaringizni qabul qilsin 🤲
      `;

      await ctx.sendMessage(message, { parse_mode: "Markdown" });
    } catch (error) {
      console.log(error);
    }
  }

  async oxirgi7kun(ctx: Context) {
    try {
      const ldate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const shogird = await this.hatmdModel.find({
        name: "shogird",
        hatmDate: { $gte: ldate },
      });
      const ustoz = await this.hatmdModel.find({
        name: "ustoz",
        hatmDate: { $gte: ldate },
      });
      const shHatm = shogird.length;
      const uHatm = ustoz.length;
      const jamiHatm = shHatm + uHatm;
      const message = `
      📖 *Oxirgi 7 kungi Hatmlar Hisoboti*

      👨‍🏫 *Ustozlar* tomonidan bajarilgan hatmlar soni: *${uHatm} ta*
      🧑‍🎓 *Shogirdlar* tomonidan bajarilgan hatmlar soni: *${shHatm} ta*

      🌟 Umumiy jami hatmlar soni: *${jamiHatm} ta*

      Alloh barchangizning ilm yo‘lidagi harakatlaringizni qabul qilsin 🤲
      `;

      await ctx.sendMessage(message, { parse_mode: "Markdown" });
    } catch (error) {
      console.log(error);
    }
  }

  async oxirgi30kun(ctx: Context) {
    try {
      const ldate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const shogird = await this.hatmdModel.find({
        name: "shogird",
        hatmDate: { $gte: ldate },
      });
      const ustoz = await this.hatmdModel.find({
        name: "ustoz",
        hatmDate: { $gte: ldate },
      });
      const shHatm = shogird.length;
      const uHatm = ustoz.length;
      const jamiHatm = shHatm + uHatm;
      const message = `
      📖 *Oxirgi 30 kungi Hatmlar hisoboti*

      👨‍🏫 *Ustozlar* tomonidan bajarilgan hatmlar soni: *${uHatm} ta*
      🧑‍🎓 *Shogirdlar* tomonidan bajarilgan hatmlar soni: *${shHatm} ta*

      🌟 Umumiy jami hatmlar soni: *${jamiHatm} ta*

      Alloh barchangizning ilm yo‘lidagi harakatlaringizni qabul qilsin 🤲
      `;

      await ctx.sendMessage(message, { parse_mode: "Markdown" });
    } catch (error) {
      console.log(error);
    }
  }

  async oxirgi1yil(ctx: Context) {
    try {
      const ldate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const shogird = await this.hatmdModel.find({
        name: "shogird",
        hatmDate: { $gte: ldate },
      });
      const ustoz = await this.hatmdModel.find({
        name: "ustoz",
        hatmDate: { $gte: ldate },
      });
      const shHatm = shogird.length;
      const uHatm = ustoz.length;
      const jamiHatm = shHatm + uHatm;
      const message = `
      📖 *Oxirgi 1 yildagi Hatmlar hisoboti*

      👨‍🏫 *Ustozlar* tomonidan bajarilgan hatmlar soni: *${uHatm} ta*
      🧑‍🎓 *Shogirdlar* tomonidan bajarilgan hatmlar soni: *${shHatm} ta*

      🌟 Umumiy jami hatmlar soni: *${jamiHatm} ta*

      Alloh barchangizning ilm yo‘lidagi harakatlaringizni qabul qilsin 🤲
      `;

      await ctx.sendMessage(message, { parse_mode: "Markdown" });
    } catch (error) {
      console.log(error);
    }
  }
}
