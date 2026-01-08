import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type HatmDocument = HydratedDocument<Hatm>;

export class Hatm {
  @Prop()
  name:string

  @Prop()
  hatmDate: Date
}

export const HatmSchema = SchemaFactory.createForClass(Hatm);
