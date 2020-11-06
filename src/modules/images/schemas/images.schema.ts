import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type ImagesDocument = Images & Document

@Schema({ collection: 'images' })
export class Images {
  @Prop({ required: true })
  url: string

  @Prop({ required: true })
  labels: string[]

  @Prop({ required: true })
  username: string

  @Prop({ required: false, default: 0 })
  likes: number

  @Prop({ required: false, default: 0 })
  views: number

  @Prop({ required: false, default: Date.now() })
  createdAt: Date
}

export const ImagesSchema = SchemaFactory.createForClass(Images)
