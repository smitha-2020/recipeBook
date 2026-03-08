import mongoose, { Document } from "mongoose";
import Joi from "joi";
const { Schema } = mongoose;

export interface IGenre {
  name?: string;
}

export interface IGenreSchema extends Document {
  name: string;
}

export const genreSchema = new Schema<IGenreSchema>({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
});

export const Genre = mongoose.model<IGenreSchema>("Genre", genreSchema);

export const GenreJoiSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});
