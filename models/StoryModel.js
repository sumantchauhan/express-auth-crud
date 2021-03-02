const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StorySchema = new Schema({
  storyHeading: {
    type: String,
    required: true,
  },
  storyDescription: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  private: {
    type: Boolean,
    default: false,
  },
});
module.exports = StoryModel = mongoose.model("storyModel", StorySchema);
