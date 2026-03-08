import mongoose from "mongoose";
const { Schema } = mongoose;

import { genreSchema, IGenre } from "./genre.js";

export interface IMovieListing extends Document{
  title: string;
  genre: IGenre;
  numberInStock: number;
  dailyRentalRate: number;
}

export interface IJoiMovieListing {
  title: string;
  genreId: number;
  numberInStock: number;
  dailyRentalRate: number;
}

export const movieListingSchema = new Schema<IMovieListing>({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

export const MovieListing = mongoose.model("MovieListing", movieListingSchema);
