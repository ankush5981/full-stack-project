require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Register
app.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  let existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already registered",
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        username,
        email,
        password: hash,
      });

      let token = jwt.sign(
        {
          email: user.email,
          userid: user._id,
        },
        "shhhh",
      );

      res.cookie("token", token);

      res.json({
        message: "Registered successfully",
      });
    });
  });
});

app.delete("/post/:id", async (req, res) => {
  await postModel.findByIdAndDelete(req.params.id);

  res.json({
    message: "Post deleted",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User not Registered",
    });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign(
        {
          email: user.email,
          userid: user._id,
        },
        "shhhh",
      );

      res.cookie("token", token);

      res.json({
        message: "Login successful",
      });
    } else {
      res.status(400).json({
        message: "wrong password",
      });
    }
  });
});

// Profile
app.get("/profile", IsloggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");

  res.json(user);
});

// Create Post
app.post("/post", IsloggedIn, async (req, res) => {
  let user = await userModel.findOne({
    email: req.user.email,
  });

  let post = await postModel.create({
    user: user._id,
    content: req.body.content,
  });

  user.posts.push(post._id);

  await user.save();

  res.json({
    message: "Post created",
  });
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "Logged out",
  });
});

// Middleware
function IsloggedIn(req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  let data = jwt.verify(req.cookies.token, "shhhh");

  req.user = data;

  next();
}

// Database
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connected");

  app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
  });
});
