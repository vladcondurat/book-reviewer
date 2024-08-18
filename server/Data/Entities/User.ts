import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  authentification: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  favouriteBooks: { type: [String], required: true },
  reviews: { type: [String], required: true, select: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  readingProgress: {
    type: Map,
    of: Number,
    default: {},
  },
});

export const UserModel = mongoose.model("User", UserSchema);
