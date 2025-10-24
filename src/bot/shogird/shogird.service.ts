import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ustoz } from "../schema/ustoz.schema";
import { Shogird } from "../schema/shogird.schema";

@Injectable()
export class ShogirdService {
  constructor(
    @InjectModel(Shogird.name) private readonly shogirdModel: Model<Shogird>
  ) {}

  async ShogirdMenu(ctx: Context) {
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
      } else if (!user.teacher_code) {
        user.last_state = "teacher_code";
        await ctx.replyWithHTML("Ustozingizdan olgan maxsus kodni kriting");
        user.save();
      } else {
        await ctx.reply("Shogirdlar menusi", {
          ...Markup.keyboard([
            ["Mening malumotlarim👈"],
            ["Ustozim"],
            ["Hatm qildim"],
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
      let teacher = "Admin sizni tasdiqladi";
      if (!user?.is_student) {
        teacher = "Admin hali sizni tasdiqlamadi";
      }
      await ctx.replyWithHTML(
        `<b>👨‍🏫 Ustoz:</b> ${user?.first_name}\n` +
          `<b>🆔 User ID:</b> <code>${user?.user_id}</code>\n` +
          `<b>📞 Telefon:</b> ${user?.phone_number}\n` +
          // `<b>🔐 Secret key:</b> <code>${user?.secret_key}</code>\n` +
          `<b>📌 Holat:</b> ${teacher}`,
        {
          ...Markup.keyboard([["Ustozlar menyusi"]]).resize(),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }


}
