import mongoose from "mongoose";

const NewsFeedSchema = new mongoose.Schema({
  newsFeed: { type: [String], required: true },
});

export const NewsFeedModel = mongoose.model("NewsFeed", NewsFeedSchema);
