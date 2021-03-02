const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const item = require("./routes/api/Item");
const users = require("./routes/api/Users");
const story = require("./routes/api/Story");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("Error", err));

app.use("/api/items", item);
app.use("/api", users);
app.use("/api/story", story);

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
