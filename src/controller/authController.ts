import { User } from "../model/user.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export const authentication = async (req: Request, res: Response) => {
  const authenticatedUser = await User.findOne({
    email: req.body.email,
  });

  if (!authenticatedUser) {
    return res.status(StatusCodes.BAD_REQUEST).send("Not a registered user!");
  }

  if (authenticatedUser) {
    const validUser = await bcrypt.compare(
      req.body.password,
      authenticatedUser.password,
    );

    if (validUser) {
      const token = authenticatedUser.jwtCreation();
      //need to store the token in the local store in future
      if (token) {
        return res.status(StatusCodes.OK).send(token);
      }
    }
    return res.status(StatusCodes.BAD_REQUEST).send("Invalid User!");
  }
};
