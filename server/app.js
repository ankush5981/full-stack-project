require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userModel = require("./models/user");
const postModel = require("./models/post");
const multer = require("multer");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ankush-social-app.onrender.com"],
    credentials: true,
  }),
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

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
        process.env.JWT_SECRET,
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Registered successfully",
      });
    });
  });
});

app.delete("/post/:id", IsloggedIn, async (req, res) => {
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
        process.env.JWT_SECRET,
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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

// Get All Posts
app.get("/allposts", IsloggedIn, async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("user", "name username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
    });
  }
});

app.post(
  "/upload-profile-pic",
  IsloggedIn,
  upload.single("profilePic"),

  async (req, res) => {
    try {
      let user = await userModel.findOne({
        email: req.user.email,
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // save image filename
      user.profilePic = req.file.filename;

      await user.save();

      res.json({
        message: "Profile picture uploaded",
        image: req.file.filename,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Upload failed",
      });
    }
  },
);

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.json({
    message: "Logged out",
  });
});

// Middleware
function IsloggedIn(req, res, next) {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

// Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
