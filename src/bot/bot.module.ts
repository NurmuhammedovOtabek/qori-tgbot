import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { MongooseModule } from "@nestjs/mongoose";
import { Bot, BotSchema } from "./schema/bot.schema";
import { UstozService } from "./ustoz/ustoz.service";
import { UstozUpdate } from "./ustoz/ustoz.update";
import { Ustoz, UstozSchema } from "./schema/ustoz.schema";
import { ShogirdService } from "./shogird/shogird.service";
import { ShogirdUpdate } from "./shogird/shogird.update";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Ustoz.name, schema: UstozSchema },
    ]),
  ],
  controllers: [],
  providers: [
    BotService,
    UstozService,
    UstozUpdate,
    ShogirdService,
    ShogirdUpdate,
    BotUpdate,
  ],
})
export class BotModule {}
