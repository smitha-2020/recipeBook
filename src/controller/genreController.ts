import { Genre } from "../model/genre.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NextFunction } from "express-serve-static-core";
import { ErrorWithStatusCode } from "../middleware/error.js";

export const getGenres = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const genres = await Genre.find();
  if (!genres || genres.length === 0)
    throw new ErrorWithStatusCode("Genres not found!", StatusCodes.NOT_FOUND);
  return res.status(StatusCodes.OK).send(genres);
};

export const getGenreById = async (req: Request, res: Response) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send("The genre with the given ID was not found.");
  return res.status(StatusCodes.OK).send(genre);
};

export const postGenre = async (req: Request, res: Response) => {
  const genreToPost = { name: req.body.name };
  await Genre.create(genreToPost);
  return res.status(StatusCodes.OK).send(await Genre.find());
};

export const putGenre = async (req: Request, res: Response) => {
  const genreToUpdate = { name: req.body.name };

  const updatedGenre = await Genre.findByIdAndUpdate(
    req.params.id,
    genreToUpdate,
    { returnDocument: "after" },
  );

  if (!updatedGenre)
    throw new ErrorWithStatusCode(
      "Genres with ID not found",
      StatusCodes.NOT_FOUND,
    );

  return res.status(StatusCodes.OK).send(updatedGenre);
};

export const deleteGenre = async (req: Request, res: Response) => {
  const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
  if (!deletedGenre)
    throw new ErrorWithStatusCode(
      "Genres with ID could not be found and deleted",
      StatusCodes.NOT_FOUND,
    );
  return res.status(StatusCodes.NOT_FOUND).send(deletedGenre);
};
