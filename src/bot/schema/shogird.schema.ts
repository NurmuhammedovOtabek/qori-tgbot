import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ShogirdDocument = HydratedDocument<Shogird>;

@Schema({ timestamps: true })
export class Shogird {
  @Prop()
  user_id: number;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Virtual({
    get: function (this: Shogird) {
      return `${this.first_name} ${this.last_name}`;
    },
  })
  full_name: string;

  @Prop()
  language_code: string;

  @Prop()
  phone_number: string;

  @Prop()
  is_active: boolean;

  @Prop()
  is_student: boolean;

  @Prop()
  teacher_id: number;

  @Prop({ default: 0 })
  hatm: number;

  @Prop()
  last_date: Date;

  @Prop()
  last_state: string;
}

export const ShogirdSchema = SchemaFactory.createForClass(Shogird);
