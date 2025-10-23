import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BotDocument = HydratedDocument<Bot>;

@Schema()
export class Bot {
}

export const BotSchema = SchemaFactory.createForClass(Bot);
