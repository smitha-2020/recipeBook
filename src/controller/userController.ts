import { User } from "../model/user.js";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { IDecodedTokenReq } from "../types/express.js";
const saltRounds = 10;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const checkIfUserExists = await User.findOne({ email: req.body.email });
    if (checkIfUserExists)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("User Already Exixts, Try with anather email address!");

    const salt = bcrypt.genSaltSync(saltRounds);

    const createdUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hashSync(req.body.password, salt),
      isAdmin: req.body.isAdmin,
    });

    if (createdUser) {
      const token = await createdUser.jwtCreation();
      //Registered user is automatically Authenticated
      res
        .header("x-auth-token", token)
        .send(_.pick(createdUser, ["name", "email", "isAdmin"]));
    }
  } catch (err) {
    if (err instanceof Error)
      res.status(StatusCodes.BAD_REQUEST).send(err.message);
  }
};

export const getCurrentUser = async (req: IDecodedTokenReq, res: Response) => {
  const loggedInUserDetails = await User.findById(req.user.id).select(
    "-password",
  );
  if (!loggedInUserDetails)
    return res.status(StatusCodes.NOT_FOUND).send("could not find the user");
};

export const loggingOut = async (req: IDecodedTokenReq, res: Response) => {
  req.header("x-auth-token");
  req.user = "";
  res.send("LoggedOut!");
};
