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
import { Shogird, ShogirdSchema } from "./schema/shogird.schema";
import { Hatm, HatmSchema } from "./schema/hatm.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bot.name, schema: BotSchema },
      { name: Ustoz.name, schema: UstozSchema },
      { name: Shogird.name, schema: ShogirdSchema },
      { name: Hatm.name, schema: HatmSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UstozService,
    UstozUpdate,
    ShogirdService,
    ShogirdUpdate,
    BotService,
    BotUpdate,
  ],
})
export class BotModule {}
