import User, { UserInput } from "../models/user.model";
import { omit } from "lodash";

export async function createUser(input: UserInput) {
  console.log("🚀 ~ createUser ~ input:", input)
  try {
    const user = await User.create(input);
    console.log("🚀 ~ createUser ~ user:", user)

    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}
