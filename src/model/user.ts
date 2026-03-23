import mongoose, { Model } from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import config from "config";

const { Schema } = mongoose;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IUserMethods {
  jwtCreation(): string;
}

export const userSchema = new Schema<IUser, Model<IUser>, IUserMethods>({
  name: { type: String, required: true, minLen: 3, maxLen: 50 },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid Email or already exists!`,
    },
    required: [true, "Email is required and must be unique"],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024,
  },
  isAdmin: { type: Boolean, default: false },
});

userSchema.method("jwtCreation", function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    config.get("privateKey"),
  );
});

export const UserJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(8).max(255).required().email(),
  password: Joi.string()
    .min(8)
    .max(1024)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  isAdmin: Joi.boolean(),
});

export const User = mongoose.model("User", userSchema);
