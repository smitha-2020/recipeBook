import mongoose from "mongoose";
const { Schema } = mongoose;

interface CustomerFn {
  default: () => boolean;
}

export interface ICustomer extends Document {
  name: string;
  paid: boolean;
  isGold: boolean;
  phone: string;
}

export const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, minLength: 3, maxlength: 50 },
  paid: { type: Boolean, default: false },
  isGold: {
    type: Boolean,
    default: function (this: ICustomer) {
      return this.paid === true;
    },
  },
  phone: { type: String, required: true, minLength: 5, maxlength: 50 },
});

export const Customer = mongoose.model("Customer", customerSchema);
