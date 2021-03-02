const express = require("express");
const router = express.Router();

const Item = require("../../models/Items");

// @route GET api/items
// @desc Get all items
// @Access public
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((item) => res.json(item));
});

// @route POST api/items
// @desc Create a item
// @Access public
router.post("/", (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });

  newItem.save().then((item) => res.json(item));
});

// @route DELETE api/items
// @desc Delete a item
// @Access public
router.delete("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => err.status(400).json({ success: false }));
});

module.exports = router;
