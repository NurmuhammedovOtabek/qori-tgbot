import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
const { v4: uuidv4 } = require('uuid');
export type UstozDocument = HydratedDocument<Ustoz>;

@Schema()
export class Ustoz {
  @Prop()
  user_id: number;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Virtual({
    get: function (this: Ustoz) {
      return `${this.first_name} ${this.last_name}`;
    },
  })
  full_name: string;

  @Prop()
  language_code: string;

  @Prop()
  phone_number: string;

  @Prop()
  serifikat: string;

  @Prop({type:String, default: uuidv4})
  secret_key: string;

  @Prop()
  is_active: boolean;

  @Prop()
  is_teacher: boolean;

  @Prop()
  last_state: string;
}

export const UstozSchema = SchemaFactory.createForClass(Ustoz);
