import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ustoz } from "../schema/ustoz.schema";
import { Shogird } from "../schema/shogird.schema";
import { Hatm } from "../schema/hatm.schema";

@Injectable()
export class ShogirdService {
  constructor(
    @InjectModel(Shogird.name) private readonly shogirdModel: Model<Shogird>,
    @InjectModel(Ustoz.name) private readonly ustozModel: Model<Ustoz>,
    @InjectModel(Hatm.name) private readonly hatmModel: Model<Hatm>
  ) {}

  async ShogirdMenu(ctx: Context, message = "Shogirdlar menusi") {
    try {
      const user_id = ctx.from?.id;
      const user = await this.shogirdModel.findOne({ user_id });
      if (!user) {
        await this.shogirdModel.create({
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
      } else if (!user.teacher_id) {
        user.last_state = "teacher_code";
        await ctx.replyWithHTML("Ustozingizdan olgan maxsus kodni kriting");
        user.save();
      } else {
        await ctx.reply(message, {
          ...Markup.keyboard([
            ["Mening malumotlarim👈", "Ustozim"],
            ["Hatm qildim 📖", "Asosiy menu"],
          ]).resize(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ShogirdDate(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.shogirdModel.findOne({ user_id });
      await ctx.replyWithHTML(
        `<b>👨‍🏫 Ustoz:</b> ${user?.first_name}\n` +
          `<b>🆔 User ID:</b> <code>${user?.user_id}</code>\n` +
          `<b>📞 Telefon:</b> ${user?.phone_number}\n` +
          `<b>Hatmlar:</b>${user?.hatm}`,
        {
          ...Markup.keyboard([["Shogirdlar menusi"]]).resize(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async ustoz(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const shogird = await this.shogirdModel.findOne({ user_id });
      if (shogird) {
        if (shogird.is_active) {
          if (shogird.is_student) {
            const ustoz = await this.ustozModel.findOne({
              user_id: shogird.teacher_id,
            });
            await ctx.replyWithHTML(
              `<b>👨‍🏫 Ustoz:</b> ${ustoz?.first_name}\n` +
                `<b>📞 Telefon:</b> ${ustoz?.phone_number}\n` +
                `<b>📌 Hatmlar Soni:</b> ${ustoz?.hatm}`,
              {
                ...Markup.keyboard([["Shogirdlar menusi"]]).resize(),
              }
            );
          } else {
            ctx.reply(
              "Sizda hali ustoz yoq\n\n Iltimos ustozingizdan olgan maxviy kalitingizni kritin"
            );
          }
        } else {
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
      } else {
        await this.ShogirdMenu(ctx, "iltimos royxatdan oting");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async hatim(ctx: Context) {
    try {
      function xatim() {
        ctx.replyWithHTML(
          `✅ <b>Hatm muvaffaqiyatli tugallandi!</b>` +
            `🤲 <i>Alloh sizdan rozi bo‘lsin, savobingizni ziyoda qilsin.</i>`
        );
      }
      const user_id = ctx.from?.id;

      const shogird = await this.shogirdModel.findOne({ user_id , is_student:true});
      if (shogird) {
        if (!shogird.last_date) {
          shogird!.hatm = shogird!.hatm + 1;
          shogird.last_date = new Date();
          await this.hatmModel.create({name: "shogird", hatmDate: new Date()})
          shogird.save();
          xatim();
        } else {
          const updateD = new Date(shogird.last_date);
          const after20 = new Date(updateD.getTime() + 20 * 60 * 60 * 1000);
          if (after20 < new Date()) {
            shogird!.hatm = shogird!.hatm + 1;
            shogird.last_date = new Date();
            shogird.save();
          await this.hatmModel.create({
            name: "shogird",
            hatmDate: new Date(),
          })
            xatim();
          } else {
            ctx.replyWithHTML(
              "Hatm qilishga hali erta 😊" +
                "Siz avvalgi hatmni tugatganingizdan beri hali 20 soat o‘tmagan." +
                "Iltimos, biroz sabr qiling va vaqt to‘liq o‘tgach yana urinib ko‘ring ⏳"
            );
          }
        }
      } else{
        await ctx.replyWithHTML("Ustozingizdan olgan mahfiy parolni kriting", {
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
