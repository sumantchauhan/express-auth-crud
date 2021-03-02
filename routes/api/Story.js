const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");

const StoryModel = require("../../models/StoryModel");

// @route POST api/story
// @desc Create a story
// @Access public
router.post("/", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newStory = new StoryModel({
    id: req.body.id,
    storyHeading: req.body.storyHeading,
    storyDescription: req.body.storyDescription,
    createdBy: req.body.createdBy,
  });
  newStory.save().then((story) => res.json(story));
});

// @route GET api/story
// @desc Get all stories
// @Access public
router.get("/", (req, res) => {
  StoryModel.find()
    .sort({ date: -1 })
    .then((item) => res.json(item))
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

module.exports = router;
