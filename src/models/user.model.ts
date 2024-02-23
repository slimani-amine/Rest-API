import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserInput {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  email: string;
  name: string;
  password: string;
  creeatedAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  let user = this;
  console.log("🚀 ~ user:", user);

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((err) => false);
};

const User = mongoose.model("User", userSchema);

export default User;
