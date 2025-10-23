import { Injectable } from "@nestjs/common";
import { Context, Markup } from "telegraf";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ustoz } from "../schema/ustoz.schema";

@Injectable()
export class UstozService {
  constructor(
    @InjectModel(Ustoz.name) private readonly ustozModel: Model<Ustoz>
  ) {}

  async UstozMenu(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.ustozModel.findOne({ user_id });
      if(!user){
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
        user.last_state="phone_number"
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
        user.save()
      } else if(user.serifikat.length == 0){
        user.last_state = 'serifikat'
        await ctx.replyWithHTML("Sertifikatingizni rasmini kriting");
        user.save()
      }else {
        await ctx.reply("Ustozlar menyusi",{
            ...Markup.keyboard([
                ["Mening malumotlarim"],["Shogirtlarim"]
            ]).resize()
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  
}
