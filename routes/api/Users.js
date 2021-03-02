const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult, check } = require("express-validator");
const auth = require("../../middleware/auth");

const UsersModel = require("../../models/UsersModel");

// @route GET api/users
// @desc Get all users or user by email or user by mobile or user by userName
// @Access public
router.get("/user", auth, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.query && req.query.email) {
    UsersModel.find({ email: req.query.email }, (err, user) => {
      if (err) {
        res.status(400).json({ errors: err });
      }
      if (Boolean(user)) {
        res.json(user);
      }
    }).catch((error) => {
      console.log("Error", error);
    });
  } else if (req.query && req.query.mobile) {
    UsersModel.find({ mobile: req.query.mobile }, (err, user) => {
      if (err) {
        res.status(400).json({ errors: err });
      }
      if (Boolean(user)) {
        res.json(user);
      }
    }).catch((error) => {
      console.log("Error", error);
    });
  } else if (req.query && req.query.userName) {
    UsersModel.find({ userName: req.query.userName }, (err, user) => {
      if (err) {
        res.status(400).json({ errors: err });
      }
      if (Boolean(user)) {
        res.json(user);
      }
    }).catch((error) => {
      console.log("Error", error);
    });
  } else {
    UsersModel.find()
      .sort({ date: -1 })
      .then((users) => res.json(users));
  }
});

// @route POST api/user
// @desc Create a user
// @Access public

// router.post(
//   "/",
//   body("userName")
//     .not()
//     .isEmpty()
//     .trim()
//     .escape()
//     .isLength({ min: 3 })
//     .withMessage("User Name is invalid!")
//     .custom((value, { req }) => {
//       return new Promise((resolve, reject) => {
//         UsersModel.findOne(
//           { userName: req.body.userName },
//           function (err, user) {
//             if (err) {
//               reject(new Error("Server Error"));
//             }
//             if (Boolean(user)) {
//               reject(new Error("User name already in use"));
//             }
//             resolve(true);
//           }
//         );
//       });
//     }),
//   body("email")
//     .isEmail()
//     .normalizeEmail()
//     .custom((value, { req }) => {
//       return new Promise((resolve, reject) => {
//         UsersModel.findOne({ email: req.body.email }, function (err, email) {
//           if (err) {
//             reject(new Error("Server Error"));
//           }
//           if (Boolean(email)) {
//             reject(new Error("Email id already in use"));
//           }
//           resolve(true);
//         });
//       });
//     }),
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("password must be at least 6 chars long")
//     .matches(/\d/)
//     .withMessage("password must be contain a number"),
//   body("mobile")
//     .isLength({ min: 9, max: 10 })
//     .withMessage("Invalid mobile number")
//     .custom((value, { req }) => {
//       return new Promise((resolve, reject) => {
//         UsersModel.findOne({ mobile: req.body.mobile }, function (err, mobile) {
//           if (err) {
//             reject(new Error("Server Error"));
//           }
//           if (Boolean(mobile)) {
//             reject(new Error("Mobile no. already in use"));
//           }
//           resolve(true);
//         });
//       });
//     }),
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const newItem = new UsersModel({
//       userName: req.body.userName,
//       email: req.body.email,
//       password: req.body.password,
//       mobile: req.body.mobile,
//     });
//     newItem.save().then((user) => res.json(user));
//   }
// );

router.post(
  "/signup",
  [
    check("userName", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors", errors);
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { userName, email, password, mobile } = req.body;
    try {
      let user = await UsersModel.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new UsersModel({
        userName,
        email,
        password,
        mobile,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await UsersModel.findOne({
        email,
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

// @route EDIT api/user
// @desc Edit a user
// @Access public
router.put(
  "/user/:id",
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("password must be contain a number"),
  auth,
  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    UsersModel.findByIdAndUpdate(
      req.params.id,
      { password: await bcrypt.hash(req.body.password, salt) },
      { new: true },
      (err, result) => {
        if (err) {
          res.status(400).json({ errors: err });
        }
        res.json(result);
      }
    );
  }
);

// @route DELETE api/user
// @desc Delete a user
// @Access public
router.delete("/user/:id", auth, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  UsersModel.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => err.status(400).json({ success: false }));
});

module.exports = router;
